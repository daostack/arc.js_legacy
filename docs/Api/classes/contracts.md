[@DAOstack/Arc.js API Reference](../README.md) > [Contracts](../classes/contracts.md)



# Class: Contracts

## Index

### Properties

* [contracts](contracts.md#contracts-1)


### Methods

* [getContractWrapper](contracts.md#getcontractwrapper)
* [getDeployedContracts](contracts.md#getdeployedcontracts)



---
## Properties
<a id="contracts-1"></a>

### «Static» contracts

**●  contracts**:  *[ArcDeployedContracts](../interfaces/arcdeployedcontracts.md)* 

*Defined in [contracts.ts:71](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts.ts#L71)*





___


## Methods
<a id="getcontractwrapper"></a>

### «Static» getContractWrapper

► **getContractWrapper**(contract: *`string`*, address?: *`string`*): `Promise`.<[ExtendTruffleContract](extendtrufflecontract.md)⎮`undefined`>



*Defined in [contracts.ts:164](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts.ts#L164)*



Returns an Arc.js contract wrapper or undefined if not found.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| contract | `string`   |  name of an Arc contract, like "SchemeRegistrar" |
| address | `string`   |  optional |





**Returns:** `Promise`.<[ExtendTruffleContract](extendtrufflecontract.md)⎮`undefined`>





___

<a id="getdeployedcontracts"></a>

### «Static» getDeployedContracts

► **getDeployedContracts**(): `Promise`.<[ArcDeployedContracts](../interfaces/arcdeployedcontracts.md)>



*Defined in [contracts.ts:73](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts.ts#L73)*





**Returns:** `Promise`.<[ArcDeployedContracts](../interfaces/arcdeployedcontracts.md)>





___


