[API Reference](../README.md) > [ILogger](../interfaces/ILogger.md)



# Interface: ILogger

## Implemented by

* [ConsoleLogger](../classes/ConsoleLogger.md)


## Properties
<a id="level"></a>

###  level

**●  level**:  *[LogLevel](../enums/LogLevel.md)* 

*Defined in [loggingService.ts:16](https://github.com/daostack/arc.js/blob/caacbb2/lib/loggingService.ts#L16)*



the LogLevel




___


## Methods
<a id="debug"></a>

###  debug

► **debug**(message: *`string`*): `void`



*Defined in [loggingService.ts:22](https://github.com/daostack/arc.js/blob/caacbb2/lib/loggingService.ts#L22)*



Logs a debug message.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  The message to log. |





**Returns:** `void`





___

<a id="error"></a>

###  error

► **error**(message: *`string`*): `void`



*Defined in [loggingService.ts:43](https://github.com/daostack/arc.js/blob/caacbb2/lib/loggingService.ts#L43)*



Logs an error.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  The message to log. |





**Returns:** `void`





___

<a id="info"></a>

###  info

► **info**(message: *`string`*): `void`



*Defined in [loggingService.ts:29](https://github.com/daostack/arc.js/blob/caacbb2/lib/loggingService.ts#L29)*



Logs info.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  The message to log. |





**Returns:** `void`





___

<a id="warn"></a>

###  warn

► **warn**(message: *`string`*): `void`



*Defined in [loggingService.ts:36](https://github.com/daostack/arc.js/blob/caacbb2/lib/loggingService.ts#L36)*



Logs a warning.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| message | `string`   |  The message to log. |





**Returns:** `void`





___


