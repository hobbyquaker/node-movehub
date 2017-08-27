const EventEmitter = require('events').EventEmitter;

/**
 * @class Boost
 */
class Boost extends EventEmitter {
    constructor() {
        super();
        this.peripherals = {};
        this.debug = false;
        this.log = this.debug ? console.log : () => {};
        this.autoSubscribe = true;
        this.ports = {};
        this.num2type = {
            23: 'LED',
            37: 'DISTANCE',
            38: 'IMOTOR',
            39: 'MOTOR',
            40: 'TILT'
        };
        this.port2num = {
            C: 0x01,
            D: 0x02,
            LED: 0x32,
            A: 0x37,
            B: 0x38,
            AB: 0x39,
            TILT: 0x3A
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
                 * @event Boost#ble-ready
                 * @param bleReady {boolean} reports `true`/`false` when BLE is active
                 */
                this.emit('ble-ready', true);
            } else {
                this.noble.stopScanning();
                this.emit('ble-ready', false);
            }
        });
        this.noble.on('discover', peripheral => {
            this.log('peripheral', peripheral.uuid, peripheral.address, peripheral.advertisement.localName);
            if (peripheral.advertisement.serviceUuids[0] === '000016231212efde1623785feabcd123') {
                this.peripherals[peripheral.address] = peripheral;
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
                        this.log('Service', s.uuid);
                    });

                    characteristics.forEach(c => {
                        this.log('Characteristic', c.uuid);
                        if (c.uuid === '000016241212efde1623785feabcd123') {
                            this.characteristic = c;

                            c.on('data', data => this.parseMessage(data));
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

    parseMessage(data) {
        switch (data[2]) {
            case 0x04: {
                clearTimeout(this.portInfoTimeout);
                this.portInfoTimeout = setTimeout(() => {
                    /**
                     * Fires when a connection to the Move Hub is established
                     * @event Boost#connect
                     */
                    this.log(this.ports);
                    this.emit('connect');
                    this.connected = true;

                    if (this.autoSubscribe) {
                        this.subscribeAll();
                    }

                }, 200);

                if (data[4] === 0x01) {
                    this.ports[data[3]] = {
                        type: 'port',
                        deviceType: this.num2type[data[5]],
                        deviceTypeNum: data[5]
                    };
                } else if (data[4] === 0x02) {
                    this.ports[data[3]] = {
                        type: 'group',
                        deviceType: this.num2type[data[5]],
                        deviceTypeNum: data[5],
                        members: [data[7], data[8]]
                    }
                }
                break;
            }
            case 0x45: {
                this.parseSensor(data);
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
                this.log('unknown message type 0x' + data[2].toString(16));
                this.log('<', data);
        }
    }

    parseSensor(data) {
        if (!this.ports[data[3]]) {
            this.log('parseSensor unknown port 0x' + data[3].toString(16));
            this.log(data);
            return;
        }
        switch (this.ports[data[3]].deviceType) {
            case 'DISTANCE': {
                /**
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
                 * @event Boost#distance
                 * @param distance {number} distance in millimeters
                 */
                this.emit('distance', distance);
                break;
            }
            case 'TILT': {
                let roll = data.readInt8(4) ^ 0x80;
                let pitch = data.readInt8(5) ^ 0x80;

                /**
                 * @event Boost#tilt
                 * @param tilt {object}
                 * @param tilt.roll {number}
                 * @param tilt.pitch {number}
                 */
                this.emit('tilt', {roll, pitch});
                break;
            }
            case 'MOTOR':
            case 'IMOTOR': {
                this.log(data);
                let angle = data.readInt32LE(4);
                this.log('angle', angle);

                /**
                 * @event Boost#rotation
                 * @param rotation {object}
                 * @param rotation.port {string}
                 * @param rotation.angle
                 */
                this.emit('rotation', {
                    port: this.num2port[data[3]],
                    angle
                });
                break;
            }
            default:
                this.log('unknown sensor type 0x' + data[3].toString(16), data[3], this.ports[data[3]].deviceType);
                this.log('<', data);
        }
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
            port = this.port2num[port];
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
            port = this.port2num[port];
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
     * @param {number} [option=0]. Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt
     * @param {function} [callback]
     */
    subscribe(port, option = 0, callback) {
        if (typeof option === 'function') {
            callback = option;
            option = 0x00;
        }
        if (typeof port === 'string') {
            port = this.port2num[port];
        }
        this.write(this.characteristic, Buffer.from([0x0A, 0x00, 0x41, port, option, 0x01, 0x00, 0x00, 0x00, 0x01]), callback);
    }

    /**
     * Unsubscribe from sensor notifications
     * @param {string|number} port
     * @param {number} [option=0]. Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt
     * @param {function} [callback]
     */
    unsubscribe(port, option = 0, callback) {
        if (typeof option === 'function') {
            callback = option;
            option = 0x00;
        }
        if (typeof port === 'string') {
            port = this.port2num[port];
        }
        this.write(this.characteristic, Buffer.from([0x0A, 0x00, 0x41, port, option, 0x01, 0x00, 0x00, 0x00, 0x00]), callback);
    }

    subscribeAll() {
        Object.keys(this.ports).forEach(port => {
            if (this.ports[port].deviceType === 'DISTANCE') {
                this.subscribe(parseInt(port, 10), 8);
            } else if (this.ports[port].deviceType === 'TILT') {
                this.subscribe(parseInt(port, 10), 0);
            } else if (this.ports[port].deviceType === 'IMOTOR') {
                this.subscribe(parseInt(port, 10), 2);
            } else if (this.ports[port].deviceType === 'MOTOR') {
               // this.subscribe(parseInt(port, 10), 2);
            }
        });
    }

    write(characteristic, data, cb) {
        this.log('>', data);
        characteristic.write(data, true, cb);
    }

    encodeMotorTime(port, seconds, dutyCycle = 100) {
        const buf = Buffer.from([0x0C, 0x00, 0x81, port, 0x11, 0x09, 0x00, 0x00, 0x00, 0x64, 0x7F, 0x03]);
        buf.writeUInt16LE(seconds * 1000, 6);
        buf.writeInt8(dutyCycle, 8);
        return buf;
    }
    encodeMotorAngle(port, angle, dutyCycle = 100) {
        const buf = Buffer.from([0x0E, 0x00, 0x81, port, 0x11, 0x0B, 0x00, 0x00, 0x00, 0x00, 0x00, 0x64, 0x7F, 0x03]);
        buf.writeUInt32LE(angle, 6);
        buf.writeInt8(dutyCycle, 10);
        return buf;
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

class Hub {

}

module.exports = new Boost();
