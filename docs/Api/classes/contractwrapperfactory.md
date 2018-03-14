[@DAOstack/Arc.js API Reference](../README.md) > [ContractWrapperFactory](../classes/contractwrapperfactory.md)



# Class: ContractWrapperFactory

## Type parameters
#### TContract :  [ExtendTruffleContract](extendtrufflecontract.md)
## Index

### Constructors

* [constructor](contractwrapperfactory.md#constructor)


### Methods

* [at](contractwrapperfactory.md#at)
* [deployed](contractwrapperfactory.md#deployed)
* [new](contractwrapperfactory.md#new)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ContractWrapperFactory**(solidityContractName: *`string`*, wrapper: *`object`*): [ContractWrapperFactory](contractwrapperfactory.md)


*Defined in [ContractWrapperFactory.ts:6](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ContractWrapperFactory.ts#L6)*



Instantiate a contract wrapper factory for the given wrapper class.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContractName | `string`   |  - |
| wrapper | `object`   |  Class of the contract |





**Returns:** [ContractWrapperFactory](contractwrapperfactory.md)

---


## Methods
<a id="at"></a>

###  at

► **at**(address: *`string`*): `Promise`.<`TContract`>



*Defined in [ContractWrapperFactory.ts:21](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ContractWrapperFactory.ts#L21)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| address | `string`   |  - |





**Returns:** `Promise`.<`TContract`>





___

<a id="deployed"></a>

###  deployed

► **deployed**(): `Promise`.<`TContract`>



*Defined in [ContractWrapperFactory.ts:26](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ContractWrapperFactory.ts#L26)*





**Returns:** `Promise`.<`TContract`>





___

<a id="new"></a>

###  new

► **new**(...rest: *`Array`.<`any`>*): `Promise`.<`TContract`>



*Defined in [ContractWrapperFactory.ts:16](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ContractWrapperFactory.ts#L16)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| rest | `Array`.<`any`>   |  - |





**Returns:** `Promise`.<`TContract`>





___


