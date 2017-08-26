const EventEmitter = require('events').EventEmitter;

/**
 * @class Boost
 */
class Boost extends EventEmitter {
    constructor() {
        super();
        this.noble = require('noble');
        this.noble.on('stateChange', state => {
            if (state === 'poweredOn') {
                this.noble.startScanning();
                /**
                 * @event Boost#scanning
                 * @type {boolean} reports when noble is starts/stops to scan for BLE devices
                 */
                this.emit('scanning', true);
            } else {
                this.noble.stopScanning();
                this.emit('scanning', false);
            }
        });
        this.noble.on('discover', peripheral => {
            if (peripheral.advertisement.serviceUuids[0] === '000016231212efde1623785feabcd123') {
                console.log(peripheral);
                /**
                 * @event Boost#hub-found
                 * @type {object}
                 * @property {string} uuid
                 * @property {string} address
                 * @property {string} localName
                 * @property {number} rssi
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
                    console.log(services[0].characteristics);
                    characteristics.forEach(c => {
                        if (c.uuid === '000016241212efde1623785feabcd123') {
                            this.characteristic = c;
                            this.emit('connect');
                            this.connected = true;
                            c.on('data', data => {
                                console.log('<', data);
                            });
                            c.subscribe(err => {
                                this.emit('error', err);
                            });
                        }
                    });
                });
            }

        });
    }
    disconnect() {
        if (this.connected) {
            this.peripheral.disconnect();
            this.emit('disconnect');
        }
    }
    write(characteristic, data, cb) {
        characteristic.write(data, true, cb);
    }
    motorTime(port, milliseconds, dutycyle) {
        this.write(this.characteristic, this.encodeMotorTime(port, milliseconds, dutycyle));

    }
    motorAngle(port, angle, dutycyle) {
        this.write(this.characteristic, this.encodeMotorAngle(port, angle, dutycyle));

    }

    /**
     *
     * @method Boost#led
     * @param {boolean|number|string} color
     * @param {function} [callback]
     *
     * If set to boolean `false` the LED is switched off, if set to `true` the LED will be white.
     * Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`,
     * `white`
     */
    led(color, cb) {
        this.write(this.characteristic, this.encodeLed(color), cb);
    }

    encodeMotorTime(port, milliseconds, dutyCycle = 100) {
        const [loTime, hiTime] = lsb16(milliseconds * 1000);
        return Buffer.from([0x0c, 0x00, 0x81, port, 0x11, 0x09, loTime, hiTime, dutyCycle, 0x64, 0x7f, 0x03]);
    }
    encodeMotorAngle(port, angle, dutyCycle = 100) {
        const [loAngle, hiAngle] = lsb16(angle);
        return Buffer.from([0x0e, 0x00, 0x81, port, 0x11, 0x0b, loAngle, hiAngle, 0x00, 0x00, dutyCycle, 0x64, 0x7f, 0x03]);
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
    return [val & 0xff, (val >> 8) & 0xff];
}

module.exports = new Boost();
