[API Reference](../README.md) > [Contracts](../classes/Contracts.md)



# Class: Contracts

## Index

### Properties

* [contracts](Contracts.md#contracts)


### Methods

* [getContractWrapper](Contracts.md#getContractWrapper)
* [getDeployedContracts](Contracts.md#getDeployedContracts)



---
## Properties
<a id="contracts"></a>

### «Static» contracts

**●  contracts**:  *[ArcDeployedContracts](../interfaces/ArcDeployedContracts.md)* 

*Defined in [contracts.ts:71](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts.ts#L71)*





___


## Methods
<a id="getContractWrapper"></a>

### «Static» getContractWrapper

► **getContractWrapper**(contract: *`string`*, address?: *`string`*): `Promise`.<[ExtendTruffleContract](ExtendTruffleContract.md)⎮`undefined`>



*Defined in [contracts.ts:164](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts.ts#L164)*



Returns an Arc.js contract wrapper or undefined if not found.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| contract | `string`   |  name of an Arc contract, like "SchemeRegistrar" |
| address | `string`   |  optional |





**Returns:** `Promise`.<[ExtendTruffleContract](ExtendTruffleContract.md)⎮`undefined`>





___

<a id="getDeployedContracts"></a>

### «Static» getDeployedContracts

► **getDeployedContracts**(): `Promise`.<[ArcDeployedContracts](../interfaces/ArcDeployedContracts.md)>



*Defined in [contracts.ts:73](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts.ts#L73)*





**Returns:** `Promise`.<[ArcDeployedContracts](../interfaces/ArcDeployedContracts.md)>





___


