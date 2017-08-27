const boost = require('./index.js');

boost.on('ble-ready', status => {
    console.log('ble-ready', status);
});

boost.on('hub-found', hubDetails => {
    console.log('boost hub-found', hubDetails);

    // In this example we connect to every boost hub that is found
    boost.connect(hubDetails.address, (err, hub) => {
        if (err) {
            throw err;
        }
        main(hub);
    });
});

function main(hub) {
    hub.on('error', (err) => {
        console.error('hub error', err);
    });

    hub.on('disconnect', () => {
        console.log('hub disconnect');
    });

    hub.on('distance', distance => {
        console.log('distance', distance, 'mm');
    });

    hub.on('color', color => {
        console.log('color', color);
    });

    hub.on('port', details => {
        console.log('port', details);
    });

    hub.on('tilt', details => {
        console.log('tilt', details);
    });

    hub.on('rotation', details => {
        console.log('rotation', details);
    });

    hub.on('rssi', details => {
        console.log('rssi', details);
    });

    hub.on('connect', () => {
        console.log('hub connect');

        hub.led('red');
        hub.motorAngle('D', 100, 50);

        setTimeout(() => {
            hub.led('green');
            hub.motorAngle('D', 100, -50);
        }, 2000);
    });
}
