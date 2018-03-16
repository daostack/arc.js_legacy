[API Reference](../README.md) > [ConsoleLogger](../classes/ConsoleLogger.md)



# Class: ConsoleLogger

## Implements

* [ILogger](../interfaces/ILogger.md)

## Index

### Properties

* [level](ConsoleLogger.md#level)


### Methods

* [debug](ConsoleLogger.md#debug)
* [error](ConsoleLogger.md#error)
* [info](ConsoleLogger.md#info)
* [warn](ConsoleLogger.md#warn)



---
## Properties
<a id="level"></a>

###  level

**●  level**:  *[LogLevel](../enums/LogLevel.md)*  =  parseInt(Config.get("logLevel"), 10) as LogLevel

*Implementation of [ILogger](../interfaces/ILogger.md).[level](../interfaces/ILogger.md#level)*

*Defined in [loggingService.ts:50](https://github.com/daostack/arc.js/blob/616f6e7/lib/loggingService.ts#L50)*





___


## Methods
<a id="debug"></a>

###  debug

► **debug**(message: *`string`*): `void`



*Implementation of [ILogger](../interfaces/ILogger.md).[debug](../interfaces/ILogger.md#debug)*

*Defined in [loggingService.ts:52](https://github.com/daostack/arc.js/blob/616f6e7/lib/loggingService.ts#L52)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___

<a id="error"></a>

###  error

► **error**(message: *`string`*): `void`



*Implementation of [ILogger](../interfaces/ILogger.md).[error](../interfaces/ILogger.md#error)*

*Defined in [loggingService.ts:58](https://github.com/daostack/arc.js/blob/616f6e7/lib/loggingService.ts#L58)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___

<a id="info"></a>

###  info

► **info**(message: *`string`*): `void`



*Implementation of [ILogger](../interfaces/ILogger.md).[info](../interfaces/ILogger.md#info)*

*Defined in [loggingService.ts:54](https://github.com/daostack/arc.js/blob/616f6e7/lib/loggingService.ts#L54)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___

<a id="warn"></a>

###  warn

► **warn**(message: *`string`*): `void`



*Implementation of [ILogger](../interfaces/ILogger.md).[warn](../interfaces/ILogger.md#warn)*

*Defined in [loggingService.ts:56](https://github.com/daostack/arc.js/blob/616f6e7/lib/loggingService.ts#L56)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___


