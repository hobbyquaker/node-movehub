const boost = require('./index.js');

boost.on('error', (err) => {
    console.error('boost error', err);
});

boost.on('ble-ready', s => {
    console.log('ble-ready', s);
});

boost.on('hub-found', data => {
    console.log('boost hub-found', data);
});

boost.on('disconnect', () => {
    console.log('boost disconnect');
});

boost.on('distance', distance => {
    console.log('distance', distance, 'mm');
});

boost.on('color', color => {
    console.log('color', color);
});

boost.on('port', details => {
    console.log('port', details);
});

boost.on('tilt', details => {
    console.log('tilt', details);
});

boost.on('rotation', details => {
    console.log('rotation', details);
});

boost.on('rssi', details => {
    console.log('rssi', details);
});

boost.on('connect', () => {
    console.log('boost connect');



   boost.led('red');
   boost.motorAngle('D', 100, 50);


   setTimeout(() => {
       boost.led('green');
       boost.motorAngle('D', 100, -50);
   }, 2000);

});
