[@DAOstack/Arc.js API Reference](../README.md) > [Utils](../classes/utils.md)



# Class: Utils

## Index

### Properties

* [alreadyTriedAndFailed](utils.md#alreadytriedandfailed)
* [web3](utils.md#web3)


### Accessors

* [NULL_ADDRESS](utils.md#null_address)
* [NULL_HASH](utils.md#null_hash)


### Methods

* [SHA3](utils.md#sha3)
* [getDefaultAccount](utils.md#getdefaultaccount)
* [getValueFromLogs](utils.md#getvaluefromlogs)
* [getWeb3](utils.md#getweb3)
* [numberToPermissionsString](utils.md#numbertopermissionsstring)
* [permissionsStringToNumber](utils.md#permissionsstringtonumber)
* [requireContract](utils.md#requirecontract)



---
## Properties
<a id="alreadytriedandfailed"></a>

### «Static»«Private» alreadyTriedAndFailed

**●  alreadyTriedAndFailed**:  *`boolean`*  = false

*Defined in [utils.ts:199](https://github.com/daostack/arc.js/blob/6909d59/lib/utils.ts#L199)*





___

<a id="web3"></a>

### «Static»«Private» web3

**●  web3**:  *`Web3`*  =  undefined

*Defined in [utils.ts:198](https://github.com/daostack/arc.js/blob/6909d59/lib/utils.ts#L198)*





___


## Accessors
<a id="null_address"></a>

### «Static» NULL_ADDRESS


getNULL_ADDRESS(): [Address](../#address)

*Defined in [utils.ts:12](https://github.com/daostack/arc.js/blob/6909d59/lib/utils.ts#L12)*





**Returns:** [Address](../#address)



___

<a id="null_hash"></a>

### «Static» NULL_HASH


getNULL_HASH(): [Hash](../#hash)

*Defined in [utils.ts:13](https://github.com/daostack/arc.js/blob/6909d59/lib/utils.ts#L13)*





**Returns:** [Hash](../#hash)



___


## Methods
<a id="sha3"></a>

### «Static» SHA3

► **SHA3**(str: *`string`*): `string`



*Defined in [utils.ts:176](https://github.com/daostack/arc.js/blob/6909d59/lib/utils.ts#L176)*



Return the hash of a string the same way solidity would, and to a format that will be properly translated into a bytes32 that solidity expects


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| str | `string`   |  a string |





**Returns:** `string`





___

<a id="getdefaultaccount"></a>

### «Static» getDefaultAccount

► **getDefaultAccount**(): `Promise`.<`string`>



*Defined in [utils.ts:157](https://github.com/daostack/arc.js/blob/6909d59/lib/utils.ts#L157)*



Returns the address of the default user account.

Has the side-effect of setting web3.eth.defaultAccount.

Throws an exception on failure.




**Returns:** `Promise`.<`string`>





___

<a id="getvaluefromlogs"></a>

### «Static» getValueFromLogs

► **getValueFromLogs**(tx: *[TransactionReceiptTruffle](../interfaces/transactionreceipttruffle.md)*, arg: *`string`*, eventName?: *`string`*, index?: *`number`*): `any`⎮`undefined`



*Defined in [utils.ts:93](https://github.com/daostack/arc.js/blob/6909d59/lib/utils.ts#L93)*



Returns a value from the given transaction log. Undefined if not found for any reason.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| tx | [TransactionReceiptTruffle](../interfaces/transactionreceipttruffle.md)  | - |   The transaction |
| arg | `string`  | - |   The name of the property whose value we wish to return from the args object: tx.logs[index].args[argName] |
| eventName | `string`  |  null |   Overrides index, identifies which log, where tx.logs[n].event === eventName |
| index | `number`  | 0 |   Identifies which log when eventName is not given |





**Returns:** `any`⎮`undefined`





___

<a id="getweb3"></a>

### «Static» getWeb3

► **getWeb3**(): `any`



*Defined in [utils.ts:46](https://github.com/daostack/arc.js/blob/6909d59/lib/utils.ts#L46)*



Returns the web3 object. When called for the first time, web3 is initialized from the Arc.js configuration. Throws an exception when web3 cannot be initialized.




**Returns:** `any`





___

<a id="numbertopermissionsstring"></a>

### «Static» numberToPermissionsString

► **numberToPermissionsString**(permissions: *`number`*): `string`



*Defined in [utils.ts:193](https://github.com/daostack/arc.js/blob/6909d59/lib/utils.ts#L193)*



Convert number to a scheme permissions string


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| permissions | `number`   |  - |





**Returns:** `string`





___

<a id="permissionsstringtonumber"></a>

### «Static» permissionsStringToNumber

► **permissionsStringToNumber**(permissions: *`string`*): `number`



*Defined in [utils.ts:184](https://github.com/daostack/arc.js/blob/6909d59/lib/utils.ts#L184)*



Convert scheme permissions string to a number


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| permissions | `string`   |  - |





**Returns:** `number`





___

<a id="requirecontract"></a>

### «Static» requireContract

► **requireContract**(contractName: *`string`*): `Promise`.<`any`>



*Defined in [utils.ts:22](https://github.com/daostack/arc.js/blob/6909d59/lib/utils.ts#L22)*



Returns TruffleContract given the name of the contract (like "SchemeRegistrar"). Optimized for synchronicity issues encountered with MetaMask. Throws an exception if it can't load the contract. Uses the asynchronous web.eth.getAccounts to obtain the default account (good with MetaMask).


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| contractName | `string`   |  like "SchemeRegistrar" |





**Returns:** `Promise`.<`any`>





___


