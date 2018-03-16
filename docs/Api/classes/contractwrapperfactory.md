[API Reference](../README.md) > [ContractWrapperFactory](../classes/ContractWrapperFactory.md)



# Class: ContractWrapperFactory

## Type parameters
#### TContract :  [ExtendTruffleContract](ExtendTruffleContract.md)
## Index

### Constructors

* [constructor](ContractWrapperFactory.md#constructor)


### Methods

* [at](ContractWrapperFactory.md#at)
* [deployed](ContractWrapperFactory.md#deployed)
* [new](ContractWrapperFactory.md#new)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ContractWrapperFactory**(solidityContractName: *`string`*, wrapper: *`object`*): [ContractWrapperFactory](ContractWrapperFactory.md)


*Defined in [ContractWrapperFactory.ts:6](https://github.com/daostack/arc.js/blob/616f6e7/lib/ContractWrapperFactory.ts#L6)*



Instantiate a contract wrapper factory for the given wrapper class.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContractName | `string`   |  - |
| wrapper | `object`   |  Class of the contract |





**Returns:** [ContractWrapperFactory](ContractWrapperFactory.md)

---


## Methods
<a id="at"></a>

###  at

► **at**(address: *`string`*): `Promise`.<`TContract`>



*Defined in [ContractWrapperFactory.ts:21](https://github.com/daostack/arc.js/blob/616f6e7/lib/ContractWrapperFactory.ts#L21)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| address | `string`   |  - |





**Returns:** `Promise`.<`TContract`>





___

<a id="deployed"></a>

###  deployed

► **deployed**(): `Promise`.<`TContract`>



*Defined in [ContractWrapperFactory.ts:26](https://github.com/daostack/arc.js/blob/616f6e7/lib/ContractWrapperFactory.ts#L26)*





**Returns:** `Promise`.<`TContract`>





___

<a id="new"></a>

###  new

► **new**(...rest: *`Array`.<`any`>*): `Promise`.<`TContract`>



*Defined in [ContractWrapperFactory.ts:16](https://github.com/daostack/arc.js/blob/616f6e7/lib/ContractWrapperFactory.ts#L16)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| rest | `Array`.<`any`>   |  - |





**Returns:** `Promise`.<`TContract`>





___


