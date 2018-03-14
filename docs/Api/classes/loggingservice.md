[@DAOstack/Arc.js API Reference](../README.md) > [LoggingService](../classes/loggingservice.md)



# Class: LoggingService

## Index

### Properties

* [logger](loggingservice.md#logger)
* [moduleName](loggingservice.md#modulename)


### Methods

* [debug](loggingservice.md#debug)
* [error](loggingservice.md#error)
* [info](loggingservice.md#info)
* [setLogLevel](loggingservice.md#setloglevel)
* [setLogger](loggingservice.md#setlogger)
* [warn](loggingservice.md#warn)



---
## Properties
<a id="logger"></a>

### «Static» logger

**●  logger**:  *[ILogger](../interfaces/ilogger.md)*  =  new ConsoleLogger()

*Defined in [loggingService.ts:65](https://github.com/daostack/arc.js/blob/6909d59/lib/loggingService.ts#L65)*





___

<a id="modulename"></a>

### «Static»«Private» moduleName

**●  moduleName**:  *`string`*  = "Arc.js"

*Defined in [loggingService.ts:85](https://github.com/daostack/arc.js/blob/6909d59/lib/loggingService.ts#L85)*





___


## Methods
<a id="debug"></a>

### «Static» debug

► **debug**(message: *`string`*): `void`



*Defined in [loggingService.ts:68](https://github.com/daostack/arc.js/blob/6909d59/lib/loggingService.ts#L68)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___

<a id="error"></a>

### «Static» error

► **error**(message: *`string`*): `void`



*Defined in [loggingService.ts:74](https://github.com/daostack/arc.js/blob/6909d59/lib/loggingService.ts#L74)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___

<a id="info"></a>

### «Static» info

► **info**(message: *`string`*): `void`



*Defined in [loggingService.ts:70](https://github.com/daostack/arc.js/blob/6909d59/lib/loggingService.ts#L70)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___

<a id="setloglevel"></a>

### «Static» setLogLevel

► **setLogLevel**(level: *[LogLevel](../enums/loglevel.md)*): `void`



*Defined in [loggingService.ts:77](https://github.com/daostack/arc.js/blob/6909d59/lib/loggingService.ts#L77)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| level | [LogLevel](../enums/loglevel.md)   |  - |





**Returns:** `void`





___

<a id="setlogger"></a>

### «Static» setLogger

► **setLogger**(logger: *[ILogger](../interfaces/ilogger.md)*): `void`



*Defined in [loggingService.ts:81](https://github.com/daostack/arc.js/blob/6909d59/lib/loggingService.ts#L81)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| logger | [ILogger](../interfaces/ilogger.md)   |  - |





**Returns:** `void`





___

<a id="warn"></a>

### «Static» warn

► **warn**(message: *`string`*): `void`



*Defined in [loggingService.ts:72](https://github.com/daostack/arc.js/blob/6909d59/lib/loggingService.ts#L72)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___


