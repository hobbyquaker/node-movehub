const boost = require('./index.js');



boost.on('boost error', (err) => {
    console.error('boost error', err);
});

boost.on('scanning', s => {
    console.log('scanning', s);
});

boost.on('hub-found', () => {
    console.log('boost hub-found');
});

boost.on('connect', () => {
    console.log('boost connect');
    boost.led('red');
    setTimeout(() => {
        boost.led('green');
    }, 1000);
    setTimeout(() => {
        boost.led('blue');
    }, 2000);
    setTimeout(() => {
        boost.led('white');
        boost.disconnect();
    }, 3000);
});

boost.on('disconnect', () => {
    console.log('boost disconnect');
});