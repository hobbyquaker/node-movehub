const boost = require('./index.js');

boost.on('connect', () => {
    boost.led('red');
    setTimeout(() => {
        boost.led('green');
    }, 1000);
    setTimeout(() => {
        boost.led('blue');
    }, 2000);
    setTimeout(() => {
        boost.led('white');
    }, 3000);
});