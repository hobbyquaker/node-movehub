# movehub

[![NPM version](https://badge.fury.io/js/movehub.svg)](http://badge.fury.io/js/movehub)
[![Dependency Status](https://gemnasium.com/badges/github.com/hobbyquaker/node-movehub.svg)](https://gemnasium.com/github.com/hobbyquaker/node-movehub)
[![Build Status](https://travis-ci.org/hobbyquaker/node-movehub.svg?branch=master)](https://travis-ci.org/hobbyquaker/node-movehub)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License][mit-badge]][mit-url]

> Node.js interface for the Lego Boost Move Hub

**WORK IN PROGRESS - UNFINISHED!**


## Install

```
$ npm install movehub
```


## Usage example

See [test.js](test.js).


## API

<a name="Boost"></a>

## Boost
**Kind**: global class  

* [Boost](#Boost)
    * [.disconnect()](#Boost+disconnect)
    * [.motorTime(port, seconds, [dutycycle], [callback])](#Boost+motorTime)
    * [.motorAngle(port, angle, [dutycycle], [callback])](#Boost+motorAngle)
    * [.led(color, [callback])](#Boost+led)
    * [.subscribe(port, [option], [callback])](#Boost+subscribe)
    * [.unsubscribe(port, [option], [callback])](#Boost+unsubscribe)
    * ["ble-ready" (bleReady)](#Boost+event_ble-ready)
    * ["hub-found" (hub)](#Boost+event_hub-found)
    * ["rssi" (rssi)](#Boost+event_rssi)
    * ["connect"](#Boost+event_connect)
    * ["port" (port)](#Boost+event_port)
    * ["color" (color)](#Boost+event_color)
    * ["distance" (distance)](#Boost+event_distance)
    * ["tilt" (tilt)](#Boost+event_tilt)
    * ["rotation" (rotation)](#Boost+event_rotation)
    * ["disconnect"](#Boost+event_disconnect)

<a name="Boost+disconnect"></a>

### boost.disconnect()
Disconnect from Move Hub

**Kind**: instance method of [<code>Boost</code>](#Boost)  
<a name="Boost+motorTime"></a>

### boost.motorTime(port, seconds, [dutycycle], [callback])
Run a motor for specific time

**Kind**: instance method of [<code>Boost</code>](#Boost)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| port | <code>string</code> \| <code>number</code> |  | possible string values: `A`, `B`, `AB`, `C`, `D` |
| seconds | <code>number</code> |  |  |
| [dutycycle] | <code>number</code> | <code>100</code> | motor power percentage from `-100` to `100`. If a negative value is given rotation is counterclockwise. |
| [callback] | <code>function</code> |  |  |

<a name="Boost+motorAngle"></a>

### boost.motorAngle(port, angle, [dutycycle], [callback])
Turn a motor to specific angle

**Kind**: instance method of [<code>Boost</code>](#Boost)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| port | <code>string</code> \| <code>number</code> |  | possible string values: `A`, `B`, `AB`, `C`, `D` |
| angle | <code>number</code> |  | degrees to turn from `0` to `2147483647` |
| [dutycycle] | <code>number</code> | <code>100</code> | motor power percentage from `-100` to `100`. If a negative value is given rotation is counterclockwise. |
| [callback] | <code>function</code> |  |  |

<a name="Boost+led"></a>

### boost.led(color, [callback])
Control the LED on the Move Hub

**Kind**: instance method of [<code>Boost</code>](#Boost)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>boolean</code> \| <code>number</code> \| <code>string</code> | If set to boolean `false` the LED is switched off, if set to `true` the LED will be white. Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`, `white` |
| [callback] | <code>function</code> |  |

<a name="Boost+subscribe"></a>

### boost.subscribe(port, [option], [callback])
Subscribe for sensor notifications

**Kind**: instance method of [<code>Boost</code>](#Boost)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| port | <code>string</code> \| <code>number</code> |  | e.g. call `.subscribe('C')` if you have your distance/color sensor on port C. |
| [option] | <code>number</code> | <code>0</code> | Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt |
| [callback] | <code>function</code> |  |  |

<a name="Boost+unsubscribe"></a>

### boost.unsubscribe(port, [option], [callback])
Unsubscribe from sensor notifications

**Kind**: instance method of [<code>Boost</code>](#Boost)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| port | <code>string</code> \| <code>number</code> |  |  |
| [option] | <code>number</code> | <code>0</code> | Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt |
| [callback] | <code>function</code> |  |  |

<a name="Boost+event_ble-ready"></a>

### "ble-ready" (bleReady)
**Kind**: event emitted by [<code>Boost</code>](#Boost)  

| Param | Type | Description |
| --- | --- | --- |
| bleReady | <code>boolean</code> | reports `true`/`false` when BLE is active |

<a name="Boost+event_hub-found"></a>

### "hub-found" (hub)
Fires when a Move Hub is found

**Kind**: event emitted by [<code>Boost</code>](#Boost)  

| Param | Type |
| --- | --- |
| hub | <code>object</code> | 
| hub.uuid | <code>string</code> | 
| hub.address | <code>string</code> | 
| hub.localName | <code>string</code> | 

<a name="Boost+event_rssi"></a>

### "rssi" (rssi)
**Kind**: event emitted by [<code>Boost</code>](#Boost)  

| Param | Type |
| --- | --- |
| rssi | <code>number</code> | 

<a name="Boost+event_connect"></a>

### "connect"
Fires when a connection to the Move Hub is established

**Kind**: event emitted by [<code>Boost</code>](#Boost)  
<a name="Boost+event_port"></a>

### "port" (port)
Fires on port changes

**Kind**: event emitted by [<code>Boost</code>](#Boost)  

| Param | Type |
| --- | --- |
| port | <code>object</code> | 
| port.port | <code>string</code> | 
| port.action | <code>string</code> | 

<a name="Boost+event_color"></a>

### "color" (color)
**Kind**: event emitted by [<code>Boost</code>](#Boost)  

| Param | Type |
| --- | --- |
| color | <code>string</code> | 

<a name="Boost+event_distance"></a>

### "distance" (distance)
**Kind**: event emitted by [<code>Boost</code>](#Boost)  

| Param | Type | Description |
| --- | --- | --- |
| distance | <code>number</code> | distance in millimeters |

<a name="Boost+event_tilt"></a>

### "tilt" (tilt)
**Kind**: event emitted by [<code>Boost</code>](#Boost)  

| Param | Type |
| --- | --- |
| tilt | <code>object</code> | 
| tilt.roll | <code>number</code> | 
| tilt.pitch | <code>number</code> | 

<a name="Boost+event_rotation"></a>

### "rotation" (rotation)
**Kind**: event emitted by [<code>Boost</code>](#Boost)  

| Param | Type |
| --- | --- |
| rotation | <code>object</code> | 
| rotation.port | <code>string</code> | 
| rotation.angle |  | 

<a name="Boost+event_disconnect"></a>

### "disconnect"
**Kind**: event emitted by [<code>Boost</code>](#Boost)  


## Contributing

Pull Requests welcome! :-)


## Credits

Thanks to [Jorge Pereira](https://github.com/JorgePe) who analyzed and documented the move hub ble protocol:
https://github.com/JorgePe/BOOSTreveng


## Disclaimer

LEGO and BOOST are Trademarks from The LEGO Company, which does not support (most probably doesn't even know about) this 
project. And of course I'm not responsible for any damage on your LEGO BOOST devices - use it at your own risk.


## License

MIT (c) Sebastian Raff

[mit-badge]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat
[mit-url]: LICENSE
