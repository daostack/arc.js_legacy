[@DAOstack/Arc.js API Reference](../README.md) > [ConsoleLogger](../classes/consolelogger.md)



# Class: ConsoleLogger

## Implements

* [ILogger](../interfaces/ilogger.md)

## Index

### Properties

* [level](consolelogger.md#level)


### Methods

* [debug](consolelogger.md#debug)
* [error](consolelogger.md#error)
* [info](consolelogger.md#info)
* [warn](consolelogger.md#warn)



---
## Properties
<a id="level"></a>

###  level

**●  level**:  *[LogLevel](../enums/loglevel.md)*  =  parseInt(Config.get("logLevel"), 10) as LogLevel

*Implementation of [ILogger](../interfaces/ilogger.md).[level](../interfaces/ilogger.md#level)*

*Defined in [loggingService.ts:50](https://github.com/daostack/arc.js/blob/0fff6d4/lib/loggingService.ts#L50)*





___


## Methods
<a id="debug"></a>

###  debug

► **debug**(message: *`string`*): `void`



*Implementation of [ILogger](../interfaces/ilogger.md).[debug](../interfaces/ilogger.md#debug)*

*Defined in [loggingService.ts:52](https://github.com/daostack/arc.js/blob/0fff6d4/lib/loggingService.ts#L52)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___

<a id="error"></a>

###  error

► **error**(message: *`string`*): `void`



*Implementation of [ILogger](../interfaces/ilogger.md).[error](../interfaces/ilogger.md#error)*

*Defined in [loggingService.ts:58](https://github.com/daostack/arc.js/blob/0fff6d4/lib/loggingService.ts#L58)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___

<a id="info"></a>

###  info

► **info**(message: *`string`*): `void`



*Implementation of [ILogger](../interfaces/ilogger.md).[info](../interfaces/ilogger.md#info)*

*Defined in [loggingService.ts:54](https://github.com/daostack/arc.js/blob/0fff6d4/lib/loggingService.ts#L54)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___

<a id="warn"></a>

###  warn

► **warn**(message: *`string`*): `void`



*Implementation of [ILogger](../interfaces/ilogger.md).[warn](../interfaces/ilogger.md#warn)*

*Defined in [loggingService.ts:56](https://github.com/daostack/arc.js/blob/0fff6d4/lib/loggingService.ts#L56)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___


