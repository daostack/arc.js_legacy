[API Reference](../README.md) > [Utils](../classes/Utils.md)



# Class: Utils

## Index

### Accessors

* [NULL_ADDRESS](Utils.md#NULL_ADDRESS)
* [NULL_HASH](Utils.md#NULL_HASH)


### Methods

* [SHA3](Utils.md#SHA3)
* [getDefaultAccount](Utils.md#getDefaultAccount)
* [getValueFromLogs](Utils.md#getValueFromLogs)
* [getWeb3](Utils.md#getWeb3)
* [numberToPermissionsString](Utils.md#numberToPermissionsString)
* [permissionsStringToNumber](Utils.md#permissionsStringToNumber)
* [requireContract](Utils.md#requireContract)



---
## Accessors
<a id="NULL_ADDRESS"></a>

### «Static» NULL_ADDRESS


getNULL_ADDRESS(): [Address](../#Address)

*Defined in [utils.ts:12](https://github.com/daostack/arc.js/blob/616f6e7/lib/utils.ts#L12)*





**Returns:** [Address](../#Address)



___

<a id="NULL_HASH"></a>

### «Static» NULL_HASH


getNULL_HASH(): [Hash](../#Hash)

*Defined in [utils.ts:13](https://github.com/daostack/arc.js/blob/616f6e7/lib/utils.ts#L13)*





**Returns:** [Hash](../#Hash)



___


## Methods
<a id="SHA3"></a>

### «Static» SHA3

► **SHA3**(str: *`string`*): `string`



*Defined in [utils.ts:176](https://github.com/daostack/arc.js/blob/616f6e7/lib/utils.ts#L176)*



Return the hash of a string the same way solidity would, and to a format that will be properly translated into a bytes32 that solidity expects


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| str | `string`   |  a string |





**Returns:** `string`





___

<a id="getDefaultAccount"></a>

### «Static» getDefaultAccount

► **getDefaultAccount**(): `Promise`.<`string`>



*Defined in [utils.ts:157](https://github.com/daostack/arc.js/blob/616f6e7/lib/utils.ts#L157)*



Returns the address of the default user account.

Has the side-effect of setting web3.eth.defaultAccount.

Throws an exception on failure.




**Returns:** `Promise`.<`string`>





___

<a id="getValueFromLogs"></a>

### «Static» getValueFromLogs

► **getValueFromLogs**(tx: *[TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)*, arg: *`string`*, eventName?: *`string`*, index?: *`number`*): `any`⎮`undefined`



*Defined in [utils.ts:93](https://github.com/daostack/arc.js/blob/616f6e7/lib/utils.ts#L93)*



Returns a value from the given transaction log. Undefined if not found for any reason.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| tx | [TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)  | - |   The transaction |
| arg | `string`  | - |   The name of the property whose value we wish to return from the args object: tx.logs[index].args[argName] |
| eventName | `string`  |  null |   Overrides index, identifies which log, where tx.logs[n].event === eventName |
| index | `number`  | 0 |   Identifies which log when eventName is not given |





**Returns:** `any`⎮`undefined`





___

<a id="getWeb3"></a>

### «Static» getWeb3

► **getWeb3**(): `any`



*Defined in [utils.ts:46](https://github.com/daostack/arc.js/blob/616f6e7/lib/utils.ts#L46)*



Returns the web3 object. When called for the first time, web3 is initialized from the Arc.js configuration. Throws an exception when web3 cannot be initialized.




**Returns:** `any`





___

<a id="numberToPermissionsString"></a>

### «Static» numberToPermissionsString

► **numberToPermissionsString**(permissions: *[SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)*): `string`



*Defined in [utils.ts:193](https://github.com/daostack/arc.js/blob/616f6e7/lib/utils.ts#L193)*



Convert number to a scheme permissions string


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| permissions | [SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)   |  - |





**Returns:** `string`





___

<a id="permissionsStringToNumber"></a>

### «Static» permissionsStringToNumber

► **permissionsStringToNumber**(permissions: *`string`*): [SchemePermissions](../enums/SchemePermissions.md)



*Defined in [utils.ts:184](https://github.com/daostack/arc.js/blob/616f6e7/lib/utils.ts#L184)*



Convert scheme permissions string to a number


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| permissions | `string`   |  - |





**Returns:** [SchemePermissions](../enums/SchemePermissions.md)





___

<a id="requireContract"></a>

### «Static» requireContract

► **requireContract**(contractName: *`string`*): `Promise`.<`any`>



*Defined in [utils.ts:22](https://github.com/daostack/arc.js/blob/616f6e7/lib/utils.ts#L22)*



Returns TruffleContract given the name of the contract (like "SchemeRegistrar"). Optimized for synchronicity issues encountered with MetaMask. Throws an exception if it can't load the contract. Uses the asynchronous web.eth.getAccounts to obtain the default account (good with MetaMask).


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| contractName | `string`   |  like "SchemeRegistrar" |





**Returns:** `Promise`.<`any`>





___


