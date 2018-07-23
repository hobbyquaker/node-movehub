# movehub

[![NPM version](https://badge.fury.io/js/movehub.svg)](http://badge.fury.io/js/movehub)
[![dependencies Status](https://david-dm.org/hobbyquaker/node-movehub/status.svg)](https://david-dm.org/hobbyquaker/node-movehub)
[![Build Status](https://travis-ci.org/hobbyquaker/node-movehub.svg?branch=master)](https://travis-ci.org/hobbyquaker/node-movehub)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License][mit-badge]][mit-url]

> Node.js interface for the Lego Boost Move Hub 🤖 🐱 🎸 🚚


## Install

```
$ npm install movehub
```

If you want to utilize the new async/await syntax see https://github.com/ttu/node-movehub-async which is based
on this module.


## Usage example

See [test.js](test.js).


## API

## Classes

<dl>
<dt><a href="#Boost">Boost</a></dt>
<dd></dd>
<dt><a href="#Hub">Hub</a></dt>
<dd></dd>
</dl>

<a name="Boost"></a>

## Boost
**Kind**: global class  

* [Boost](#Boost)
    * [.connect(address, callback)](#Boost+connect)
    * ["ble-ready" (bleReady)](#Boost+event_ble-ready)
    * ["hub-found" (hub)](#Boost+event_hub-found)
    * [.connectCallback](#Boost+connectCallback) : <code>function</code>

<a name="Boost+connect"></a>

### boost.connect(address, callback)
**Kind**: instance method of [<code>Boost</code>](#Boost)  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | MAC Address of the Hub |
| callback | [<code>connectCallback</code>](#Boost+connectCallback) |  |

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

<a name="Boost+connectCallback"></a>

### boost.connectCallback : <code>function</code>
**Kind**: instance typedef of [<code>Boost</code>](#Boost)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>null</code> \| <code>error</code> |  |
| hub | [<code>Hub</code>](#Hub) | instance of the Hub Class |

<a name="Hub"></a>

## Hub
**Kind**: global class  

* [Hub](#Hub)
    * [.disconnect()](#Hub+disconnect)
    * [.motorTime(port, seconds, [dutyCycle], [callback])](#Hub+motorTime)
    * [.motorTimeMulti(seconds, dutyCycleA, dutyCycleB, callback)](#Hub+motorTimeMulti)
    * [.motorAngle(port, angle, [dutyCycle], [callback])](#Hub+motorAngle)
    * [.motorAngleMulti(angle, dutyCycleA, dutyCycleB, callback)](#Hub+motorAngleMulti)
    * [.led(color, [callback])](#Hub+led)
    * [.subscribe(port, [option], [callback])](#Hub+subscribe)
    * [.unsubscribe(port, [option], [callback])](#Hub+unsubscribe)
    * [.write(data, callback)](#Hub+write)
    * ["rssi" (rssi)](#Hub+event_rssi)
    * ["disconnect"](#Hub+event_disconnect)
    * ["connect"](#Hub+event_connect)
    * ["port" (port)](#Hub+event_port)
    * ["color" (color)](#Hub+event_color)
    * ["distance" (distance)](#Hub+event_distance)
    * ["tilt" (tilt)](#Hub+event_tilt)
    * ["rotation" (rotation)](#Hub+event_rotation)

<a name="Hub+disconnect"></a>

### hub.disconnect()
Disconnect from Move Hub

**Kind**: instance method of [<code>Hub</code>](#Hub)  
<a name="Hub+motorTime"></a>

### hub.motorTime(port, seconds, [dutyCycle], [callback])
Run a motor for specific time

**Kind**: instance method of [<code>Hub</code>](#Hub)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| port | <code>string</code> \| <code>number</code> |  | possible string values: `A`, `B`, `AB`, `C`, `D`. |
| seconds | <code>number</code> |  |  |
| [dutyCycle] | <code>number</code> | <code>100</code> | motor power percentage from `-100` to `100`. If a negative value is given rotation is counterclockwise. |
| [callback] | <code>function</code> |  |  |

<a name="Hub+motorTimeMulti"></a>

### hub.motorTimeMulti(seconds, dutyCycleA, dutyCycleB, callback)
Run both motors (A and B) for specific time

**Kind**: instance method of [<code>Hub</code>](#Hub)  

| Param | Type | Description |
| --- | --- | --- |
| seconds | <code>number</code> |  |
| dutyCycleA | <code>number</code> | motor power percentage from `-100` to `100`. If a negative value is given rotation is counterclockwise. |
| dutyCycleB | <code>number</code> | motor power percentage from `-100` to `100`. If a negative value is given rotation is counterclockwise. |
| callback | <code>function</code> |  |

<a name="Hub+motorAngle"></a>

### hub.motorAngle(port, angle, [dutyCycle], [callback])
Turn a motor by specific angle

**Kind**: instance method of [<code>Hub</code>](#Hub)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| port | <code>string</code> \| <code>number</code> |  | possible string values: `A`, `B`, `AB`, `C`, `D`. |
| angle | <code>number</code> |  | degrees to turn from `0` to `2147483647` |
| [dutyCycle] | <code>number</code> | <code>100</code> | motor power percentage from `-100` to `100`. If a negative value is given rotation is counterclockwise. |
| [callback] | <code>function</code> |  |  |

<a name="Hub+motorAngleMulti"></a>

### hub.motorAngleMulti(angle, dutyCycleA, dutyCycleB, callback)
Turn both motors (A and B) by specific angle

**Kind**: instance method of [<code>Hub</code>](#Hub)  

| Param | Type | Description |
| --- | --- | --- |
| angle | <code>number</code> | degrees to turn from `0` to `2147483647` |
| dutyCycleA | <code>number</code> | motor power percentage from `-100` to `100`. If a negative value is given rotation is counterclockwise. |
| dutyCycleB | <code>number</code> | motor power percentage from `-100` to `100`. If a negative value is given rotation is counterclockwise. |
| callback | <code>function</code> |  |

<a name="Hub+led"></a>

### hub.led(color, [callback])
Control the LED on the Move Hub

**Kind**: instance method of [<code>Hub</code>](#Hub)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>boolean</code> \| <code>number</code> \| <code>string</code> | If set to boolean `false` the LED is switched off, if set to `true` the LED will be white. Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`, `white` |
| [callback] | <code>function</code> |  |

<a name="Hub+subscribe"></a>

### hub.subscribe(port, [option], [callback])
Subscribe for sensor notifications

**Kind**: instance method of [<code>Hub</code>](#Hub)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| port | <code>string</code> \| <code>number</code> |  | e.g. call `.subscribe('C')` if you have your distance/color sensor on port C. |
| [option] | <code>number</code> | <code>0</code> | Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt |
| [callback] | <code>function</code> |  |  |

<a name="Hub+unsubscribe"></a>

### hub.unsubscribe(port, [option], [callback])
Unsubscribe from sensor notifications

**Kind**: instance method of [<code>Hub</code>](#Hub)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| port | <code>string</code> \| <code>number</code> |  |  |
| [option] | <code>number</code> | <code>0</code> | Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt |
| [callback] | <code>function</code> |  |  |

<a name="Hub+write"></a>

### hub.write(data, callback)
Send data over BLE

**Kind**: instance method of [<code>Hub</code>](#Hub)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> \| <code>Buffer</code> | If a string is given it has to have hex bytes separated by spaces, e.g. `0a 01 c3 b2` |
| callback | <code>function</code> |  |

<a name="Hub+event_rssi"></a>

### "rssi" (rssi)
**Kind**: event emitted by [<code>Hub</code>](#Hub)  

| Param | Type |
| --- | --- |
| rssi | <code>number</code> | 

<a name="Hub+event_disconnect"></a>

### "disconnect"
**Kind**: event emitted by [<code>Hub</code>](#Hub)  
<a name="Hub+event_connect"></a>

### "connect"
Fires when a connection to the Move Hub is established

**Kind**: event emitted by [<code>Hub</code>](#Hub)  
<a name="Hub+event_port"></a>

### "port" (port)
Fires on port changes

**Kind**: event emitted by [<code>Hub</code>](#Hub)  

| Param | Type |
| --- | --- |
| port | <code>object</code> | 
| port.port | <code>string</code> | 
| port.action | <code>string</code> | 

<a name="Hub+event_color"></a>

### "color" (color)
**Kind**: event emitted by [<code>Hub</code>](#Hub)  

| Param | Type |
| --- | --- |
| color | <code>string</code> | 

<a name="Hub+event_distance"></a>

### "distance" (distance)
**Kind**: event emitted by [<code>Hub</code>](#Hub)  

| Param | Type | Description |
| --- | --- | --- |
| distance | <code>number</code> | distance in millimeters |

<a name="Hub+event_tilt"></a>

### "tilt" (tilt)
**Kind**: event emitted by [<code>Hub</code>](#Hub)  

| Param | Type |
| --- | --- |
| tilt | <code>object</code> | 
| tilt.roll | <code>number</code> | 
| tilt.pitch | <code>number</code> | 

<a name="Hub+event_rotation"></a>

### "rotation" (rotation)
**Kind**: event emitted by [<code>Hub</code>](#Hub)  

| Param | Type |
| --- | --- |
| rotation | <code>object</code> | 
| rotation.port | <code>string</code> | 
| rotation.angle |  | 



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
