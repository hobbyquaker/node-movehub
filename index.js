const noble = require('noble');

noble.on('stateChange', state => {
    console.log('noble stateChange', state);
    if (state === 'poweredOn') {

        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', peripheral => {
    console.log('Found device with local name: ' + peripheral.advertisement.localName);
    console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
    console.log();
});

function motorTime(port, milliseconds, dutyCycle = 100) {
    const [loTime, hiTime] = lsb16(milliseconds * 1000);
    return Buffer.from([0x0c, 0x00, 0x81, port, 0x11, 0x09, loTime, hiTime, dutyCycle, 0x64, 0x7f, 0x03]);
}

function motorAngle(port, angle, dutyCycle = 100) {
    const [loAngle, hiAngle] = lsb16(angle);
    return Buffer.from([0x0e, 0x00, 0x81, port, 0x11, 0x0b, loAngle, hiAngle, 0x00, 0x00, dutyCycle, 0x64, 0x7f, 0x03]);
}

function led(color) {
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

function lsb16(val) {
    return [val & 0xff, (val >> 8) & 0xff];
}

