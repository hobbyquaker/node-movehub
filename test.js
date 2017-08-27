const boost = require('./index.js');

boost.on('error', (err) => {
    console.error('boost error', err);
});

boost.on('scanning', s => {
    console.log('scanning', s);
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

boost.on('connect', () => {
    console.log('boost connect');
    boost.subscribe(0x01);
    boost.subscribe(0x3a, 0x00);

    boost.led('red');
    boost.motorAngle('A', 180, 50);

    setTimeout(() => {
        boost.led('green');
        boost.motorAngle('A', 180, -50);
    }, 2000);
});
