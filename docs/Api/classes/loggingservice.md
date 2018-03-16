[API Reference](../README.md) > [LoggingService](../classes/LoggingService.md)



# Class: LoggingService

## Index

### Properties

* [logger](LoggingService.md#logger)


### Methods

* [debug](LoggingService.md#debug)
* [error](LoggingService.md#error)
* [info](LoggingService.md#info)
* [setLogLevel](LoggingService.md#setLogLevel)
* [setLogger](LoggingService.md#setLogger)
* [warn](LoggingService.md#warn)



---
## Properties
<a id="logger"></a>

### «Static» logger

**●  logger**:  *[ILogger](../interfaces/ILogger.md)*  =  new ConsoleLogger()

*Defined in [loggingService.ts:65](https://github.com/daostack/arc.js/blob/61e5f90/lib/loggingService.ts#L65)*





___


## Methods
<a id="debug"></a>

### «Static» debug

► **debug**(message: *`string`*): `void`



*Defined in [loggingService.ts:68](https://github.com/daostack/arc.js/blob/61e5f90/lib/loggingService.ts#L68)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___

<a id="error"></a>

### «Static» error

► **error**(message: *`string`*): `void`



*Defined in [loggingService.ts:74](https://github.com/daostack/arc.js/blob/61e5f90/lib/loggingService.ts#L74)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___

<a id="info"></a>

### «Static» info

► **info**(message: *`string`*): `void`



*Defined in [loggingService.ts:70](https://github.com/daostack/arc.js/blob/61e5f90/lib/loggingService.ts#L70)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___

<a id="setLogLevel"></a>

### «Static» setLogLevel

► **setLogLevel**(level: *[LogLevel](../enums/LogLevel.md)*): `void`



*Defined in [loggingService.ts:77](https://github.com/daostack/arc.js/blob/61e5f90/lib/loggingService.ts#L77)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| level | [LogLevel](../enums/LogLevel.md)   |  - |





**Returns:** `void`





___

<a id="setLogger"></a>

### «Static» setLogger

► **setLogger**(logger: *[ILogger](../interfaces/ILogger.md)*): `void`



*Defined in [loggingService.ts:81](https://github.com/daostack/arc.js/blob/61e5f90/lib/loggingService.ts#L81)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| logger | [ILogger](../interfaces/ILogger.md)   |  - |





**Returns:** `void`





___

<a id="warn"></a>

### «Static» warn

► **warn**(message: *`string`*): `void`



*Defined in [loggingService.ts:72](https://github.com/daostack/arc.js/blob/61e5f90/lib/loggingService.ts#L72)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  - |





**Returns:** `void`





___


