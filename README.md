# movehub

[![NPM version](https://badge.fury.io/js/movehub.svg)](http://badge.fury.io/js/movehub)
[![Dependency Status](https://img.shields.io/gemnasium/hobbyquaker/node-movehub.svg?maxAge=2592000)](https://gemnasium.com/github.com/hobbyquaker/node-movehub)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License][mit-badge]][mit-url]

> Node.js interface for the Lego Boost Move Hub

**WORK IN PROGRESS - UNFINISHED!**


## Install

```
$ npm install movehub
```


## TODO

- [x] LED control
- [ ] Motor control
- [ ] Sound playback
- [ ] Distance sensor events
- [ ] Color sensor events
- [ ] Rotation events
- [ ] Tilt sensor events
- [ ] Connect to multiple Move Hubs
- [ ] API Docs


## API

## Classes

<dl>
<dt><a href="#Boost">Boost</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#led">led(color, [cb])</a></dt>
<dd></dd>
</dl>

## Events

<dl>
<dt><a href="#event_scanning">"scanning" (Reports)</a></dt>
<dd></dd>
</dl>

<a name="Boost"></a>

## Boost
**Kind**: global class  
<a name="led"></a>

## led(color, [cb])
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>boolean</code> \| <code>number</code> \| <code>string</code> |  |
| [cb] | <code>function</code> | If set to boolean `false` the LED is switched off, if set to `true` the LED will be white. Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`, `white` |

<a name="event_scanning"></a>

## "scanning" (Reports)
**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| Reports | <code>boolean</code> | if noble is currently scanning for BLE devices |



## Credits

Thanks to [Jorge Pereira](https://github.com/JorgePe) who analyzed and documented the move hub ble protocol:
https://github.com/JorgePe/BOOSTreveng


## License

MIT (c) Sebastian Raff

[mit-badge]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat
[mit-url]: LICENSE
