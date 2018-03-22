[API Reference](../README.md) > [ContractWrapperFactory](../classes/ContractWrapperFactory.md)



# Class: ContractWrapperFactory


Generic class factory for all of the contract wrapper classes.

## Type parameters
#### TWrapper :  [ContractWrapperBase](ContractWrapperBase.md)
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


*Defined in contractWrapperFactory.ts:9*



Connstructor to create a contract wrapper factory for the given Arc contract name and wrapper class.


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

► **at**(address: *`string`*): `Promise`.<`TWrapper`>



*Defined in contractWrapperFactory.ts:35*



Return a wrapper around the contract, hydrated from the given address. Throws an exception if the contract is not found at the given address.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| address | `string`   |  - |





**Returns:** `Promise`.<`TWrapper`>





___

<a id="deployed"></a>

###  deployed

► **deployed**(): `Promise`.<`TWrapper`>



*Defined in contractWrapperFactory.ts:45*



Return a wrapper around the contract as deployed by the current version of Arc.js. Note this is usually not needed as the WrapperService provides these wrappers already hydrated.




**Returns:** `Promise`.<`TWrapper`>





___

<a id="new"></a>

###  new

► **new**(...rest: *`Array`.<`any`>*): `Promise`.<`TWrapper`>



*Defined in contractWrapperFactory.ts:25*



Deploy a new instance of the contract and return a wrapper around it.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| rest | `Array`.<`any`>   |  Optional arguments to the Arc contracts constructor. |





**Returns:** `Promise`.<`TWrapper`>





___


