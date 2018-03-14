[@DAOstack/Arc.js API Reference](../README.md) > [ContractWrapperFactory](../classes/contractwrapperfactory.md)



# Class: ContractWrapperFactory

## Type parameters
#### TContract :  [ExtendTruffleContract](extendtrufflecontract.md)
## Index

### Constructors

* [constructor](contractwrapperfactory.md#constructor)


### Properties

* [solidityContract](contractwrapperfactory.md#soliditycontract)
* [solidityContractName](contractwrapperfactory.md#soliditycontractname)
* [wrapper](contractwrapperfactory.md#wrapper)


### Methods

* [at](contractwrapperfactory.md#at)
* [deployed](contractwrapperfactory.md#deployed)
* [ensureSolidityContract](contractwrapperfactory.md#ensuresoliditycontract)
* [new](contractwrapperfactory.md#new)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ContractWrapperFactory**(solidityContractName: *`string`*, wrapper: *`object`*): [ContractWrapperFactory](contractwrapperfactory.md)


*Defined in [ContractWrapperFactory.ts:6](https://github.com/daostack/arc.js/blob/6909d59/lib/ContractWrapperFactory.ts#L6)*



Instantiate a contract wrapper factory for the given wrapper class.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContractName | `string`   |  - |
| wrapper | `object`   |  Class of the contract |





**Returns:** [ContractWrapperFactory](contractwrapperfactory.md)

---


## Properties
<a id="soliditycontract"></a>

### «Private» solidityContract

**●  solidityContract**:  *`any`* 

*Defined in [ContractWrapperFactory.ts:6](https://github.com/daostack/arc.js/blob/6909d59/lib/ContractWrapperFactory.ts#L6)*





___

<a id="soliditycontractname"></a>

### «Private» solidityContractName

**●  solidityContractName**:  *`string`* 

*Defined in [ContractWrapperFactory.ts:13](https://github.com/daostack/arc.js/blob/6909d59/lib/ContractWrapperFactory.ts#L13)*





___

<a id="wrapper"></a>

### «Private» wrapper

**●  wrapper**:  *`object`* 

*Defined in [ContractWrapperFactory.ts:13](https://github.com/daostack/arc.js/blob/6909d59/lib/ContractWrapperFactory.ts#L13)*



Class of the contract

#### Type declaration





___


## Methods
<a id="at"></a>

###  at

► **at**(address: *`string`*): `Promise`.<`TContract`>



*Defined in [ContractWrapperFactory.ts:21](https://github.com/daostack/arc.js/blob/6909d59/lib/ContractWrapperFactory.ts#L21)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| address | `string`   |  - |





**Returns:** `Promise`.<`TContract`>





___

<a id="deployed"></a>

###  deployed

► **deployed**(): `Promise`.<`TContract`>



*Defined in [ContractWrapperFactory.ts:26](https://github.com/daostack/arc.js/blob/6909d59/lib/ContractWrapperFactory.ts#L26)*





**Returns:** `Promise`.<`TContract`>





___

<a id="ensuresoliditycontract"></a>

### «Private» ensureSolidityContract

► **ensureSolidityContract**(): `Promise`.<`void`>



*Defined in [ContractWrapperFactory.ts:31](https://github.com/daostack/arc.js/blob/6909d59/lib/ContractWrapperFactory.ts#L31)*





**Returns:** `Promise`.<`void`>





___

<a id="new"></a>

###  new

► **new**(...rest: *`Array`.<`any`>*): `Promise`.<`TContract`>



*Defined in [ContractWrapperFactory.ts:16](https://github.com/daostack/arc.js/blob/6909d59/lib/ContractWrapperFactory.ts#L16)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| rest | `Array`.<`any`>   |  - |





**Returns:** `Promise`.<`TContract`>





___


