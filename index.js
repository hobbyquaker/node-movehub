const EventEmitter = require('events').EventEmitter;

/**
 * @class Boost
 */
class Boost extends EventEmitter {
    constructor() {
        super();
        this.port2num = {
            C: 0x01,
            D: 0x02,
            LED: 0x32,
            A: 0x37,
            B: 0x38,
            AB: 0x39
        };
        this.num2port = {};
        Object.keys(this.port2num).forEach(p => {
            this.num2port[this.port2num[p]] = p;
        });
        this.num2action = {
            1: 'start',
            5: 'conflict',
            10: 'stop'
        };
        this.num2color = {
            0: 'black',
            3: 'blue',
            5: 'green',
            7: 'yellow',
            9: 'red',
            10: 'white'
        };
        this.noble = require('noble');
        this.noble.on('stateChange', state => {
            if (state === 'poweredOn') {
                this.noble.startScanning();
                /**
                 * @event Boost#scanning
                 * @param scanning {boolean} reports `true`/`false` when noble starts/stops to scan for BLE devices
                 */
                this.emit('scanning', true);
            } else {
                this.noble.stopScanning();
                this.emit('scanning', false);
            }
        });
        this.noble.on('discover', peripheral => {
            console.log('peripheral', peripheral.uuid, peripheral.address, peripheral.advertisement.localName);
            if (peripheral.advertisement.serviceUuids[0] === '000016231212efde1623785feabcd123') {
                /**
                 * Fires when a Move Hub is found
                 * @event Boost#hub-found
                 * @param hub {object}
                 * @param hub.uuid {string}
                 * @param hub.address{string}
                 * @param hub.localName {string}
                 * @param hub.rssi {number}
                 */
                this.emit('hub-found', {
                    uuid: peripheral.uuid,
                    address: peripheral.address,
                    localName: peripheral.advertisement.localName,
                    rssi: peripheral.rssi
                });
                this.connect(peripheral);
            }
        });
    }
    connect(peripheral) {
        peripheral.connect(err => {
            if (err) {
                this.emit('error', err);
            } else {
                this.peripheral = peripheral;
                peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
                    if (error) {
                        console.error('discover services and characteristics', error);
                    }

                    services.forEach(s => {
                        console.log('Service', s.uuid);
                    });

                    characteristics.forEach(c => {
                        console.log('Characteristic', c.uuid);
                        if (c.uuid === '000016241212efde1623785feabcd123') {
                            this.characteristic = c;
                            /**
                             * Fires when a connection to the Move Hub is established
                             * @event Boost#connect
                             */
                            this.emit('connect');
                            this.connected = true;

                            c.on('data', data => {
                                switch (data[2]) {
                                    // TODO 0x04
                                    case 0x45: {
                                        // TODO clarify if distinction via data.length is free of issues
                                        switch (data.length) {
                                            case 8: {
                                                /**
                                                 * Fires on color sensor changes (you have to subscribe the port of the
                                                 * sensor to receive these events).
                                                 * @event Boost#color
                                                 * @param color {string}
                                                 */
                                                this.emit('color', this.num2color[data[4]]);

                                                // TODO improve distance calculation!
                                                let distance;
                                                if (data[7] > 0 && data[5] < 2) {
                                                    distance = Math.floor(20 - (data[7] * 2.85));
                                                } else if (data[5] > 9) {
                                                    distance = Infinity;
                                                } else {
                                                    distance = Math.floor((20 + (data[5] * 18)));
                                                }
                                                /**
                                                 * Fires on distance sensor changes (you have to subscribe the port of the
                                                 * sensor to receive these events).
                                                 * @event Boost#distance
                                                 * @param distance {number} distance in millimeters
                                                 */
                                                this.emit('distance', distance);
                                                break;
                                            }
                                            case 6: {
                                                let roll = data[4];
                                                let pitch = data[5];
                                                if (roll & 0x80) {
                                                    roll -= 0xFF;
                                                }
                                                if (pitch & 0x80) {
                                                    pitch -= 0xFF;
                                                }
                                                roll = -roll;
                                                pitch = -pitch;
                                                /**
                                                 * @event Boost#tilt
                                                 * @param tilt {object}
                                                 * @param tilt.roll {number}
                                                 * @param tilt.pitch {number}
                                                 */
                                                this.emit('tilt', {roll, pitch});
                                                break;
                                            }
                                            default:
                                                console.log('unknown sensor type 0x' + data[3].toString(16));
                                                console.log('<', data);
                                        }

                                        break;
                                    }
                                    case 0x82: {
                                        /**
                                         * Fires on port changes
                                         * @event Boost#port
                                         * @param port {object}
                                         * @param port.port {string}
                                         * @param port.action {string}
                                         */
                                        this.emit('port', {port: this.num2port[data[3]], action: this.num2action[data[4]]});
                                        break;
                                    }
                                    default:
                                        console.log('unknown message type 0x' + data[2].toString(16));
                                        console.log('<', data);
                                }
                            });
                            c.subscribe(err => {
                                if (err) {
                                    this.emit('error', err);
                                }
                            });
                        }
                    });
                });
            }
        });
    }

    /**
     * Disconnect from Move Hub
     * @method Boost#disconnect
     */
    disconnect() {
        if (this.connected) {
            this.peripheral.disconnect();
            /**
             * @event Boost#disconnect
             */
            this.emit('disconnect');
        }
    }

    /**
     * Run a motor for specific time
     * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`
     * @param {number} seconds
     * @param {number} [dutycycle=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {function} [callback]
     */
    motorTime(port, seconds, dutycycle, callback) {
        if (typeof dutycycle === 'function') {
            callback = dutycycle;
            dutycycle = 100;
        }
        if (typeof port === 'string') {
            port = this.encodePort(port);
        }
        this.write(this.characteristic, this.encodeMotorTime(port, seconds, dutycycle), callback);
    }

    /**
     * Turn a motor to specific angle
     * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`
     * @param {number} angle - degrees to turn from `0` to `4026531839`
     * @param {number} [dutycycle=100] motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {function} [callback]
     */
    motorAngle(port, angle, dutycycle, callback) {
        if (typeof dutycycle === 'function') {
            callback = dutycycle;
            dutycycle = 100;
        }
        if (typeof port === 'string') {
            port = this.encodePort(port);
        }
        this.write(this.characteristic, this.encodeMotorAngle(port, angle, dutycycle), callback);
    }

    /**
     * Control the LED on the Move Hub
     * @method Boost#led
     * @param {boolean|number|string} color
     * If set to boolean `false` the LED is switched off, if set to `true` the LED will be white.
     * Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`,
     * `white`
     * @param {function} [callback]
     */
    led(color, callback) {
        this.write(this.characteristic, this.encodeLed(color), callback);
    }

    /**
     * Subscribe for sensor notifications
     * @param {string|number} port - e.g. call `.subscribe('C')` if you have your distance/color sensor on port C.
     * @param {function} [callback]
     */
    subscribe(port, option, callback) {
        if (typeof option === 'function') {
            callback = option;
            option = 0x08;
        } else if (typeof option === 'undefined') {
            option = 0x08;
        }
        if (typeof port === 'string') {
            port = this.encodePort(port);
        }
        this.write(this.characteristic, Buffer.from([0x0A, 0x00, 0x41, port, option, 0x01, 0x00, 0x00, 0x00, 0x01]), callback);
    }

    /**
     * Unsubscribe from sensor notifications
     * @param {string|number} port
     * @param {function} [callback]
     */
    unsubscribe(port, callback) {
        if (typeof port === 'string') {
            port = this.encodePort(port);
        }
        this.write(this.characteristic, Buffer.from([0x0A, 0x00, 0x41, port, 0x08, 0x01, 0x00, 0x00, 0x00, 0x00]), callback);
    }

    write(characteristic, data, cb) {
        console.log('>', data);
        characteristic.write(data, true, cb);
    }

    encodePort(port) {
        return this.port2num[port];
    }

    decodePort(num) {
        return this.num2port[num];
    }

    encodeMotorTime(port, seconds, dutyCycle = 100) {
        if (dutyCycle < 0) {
            dutyCycle = 0xFF + dutyCycle;
        }
        const [loTime, hiTime] = lsb16(seconds * 1000);
        return Buffer.from([0x0C, 0x00, 0x81, port, 0x11, 0x09, loTime, hiTime, dutyCycle, 0x64, 0x7F, 0x03]);
    }
    encodeMotorAngle(port, angle, dutyCycle = 100) {
        if (dutyCycle < 0) {
            dutyCycle = 0xFF + dutyCycle;
        }
        const [ang1, ang2, ang3, ang4] = lsb32(angle);
        return Buffer.from([0x0E, 0x00, 0x81, port, 0x11, 0x0B, ang1, ang2, ang3, ang4, dutyCycle, 0x64, 0x7F, 0x03]);
    }
    encodeLed(color) {
        if (color === false) {
            color = 'off';
        } else if (color === true) {
            color = 'white';
        }
        if (typeof color === 'string') {
            const colors = [
                'off',
                'pink',
                'purple',
                'blue',
                'lightblue',
                'cyan',
                'green',
                'yellow',
                'orange',
                'red',
                'white'
            ];
            color = colors.indexOf(color);
        }
        return Buffer.from([0x08, 0x00, 0x81, 0x32, 0x11, 0x51, 0x00, color]);
    }
}

function lsb16(val) {
    return [val & 0xFF, (val >> 8) & 0xFF];
}

function lsb32(val) {
    return [val & 0xFF, (val >> 8) & 0xFF, (val >> 16) & 0xFF, (val >> 24) & 0xFF];
}

module.exports = new Boost();
