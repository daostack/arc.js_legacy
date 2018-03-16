[API Reference](../README.md) > [ArcTransactionDataResult](../classes/ArcTransactionDataResult.md)



# Class: ArcTransactionDataResult


Base or actual type returned by all contract wrapper methods that generate a transaction and any other result.

## Type parameters
#### TData 
## Hierarchy


 [ArcTransactionResult](ArcTransactionResult.md)

**↳ ArcTransactionDataResult**







## Index

### Constructors

* [constructor](ArcTransactionDataResult.md#constructor)


### Properties

* [result](ArcTransactionDataResult.md#result)
* [tx](ArcTransactionDataResult.md#tx)


### Methods

* [getValueFromTx](ArcTransactionDataResult.md#getValueFromTx)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ArcTransactionDataResult**(tx: *[TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)*, result: *`TData`*): [ArcTransactionDataResult](ArcTransactionDataResult.md)


*Overrides [ArcTransactionResult](ArcTransactionResult.md).[constructor](ArcTransactionResult.md#constructor)*

*Defined in [ExtendTruffleContract.ts:297](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L297)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tx | [TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)   |  - |
| result | `TData`   |  - |





**Returns:** [ArcTransactionDataResult](ArcTransactionDataResult.md)

---


## Properties
<a id="result"></a>

###  result

**●  result**:  *`TData`* 

*Defined in [ExtendTruffleContract.ts:297](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L297)*



The data result to be returned




___

<a id="tx"></a>

###  tx

**●  tx**:  *[TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)* 

*Inherited from [ArcTransactionResult](ArcTransactionResult.md).[tx](ArcTransactionResult.md#tx)*

*Defined in [ExtendTruffleContract.ts:258](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L258)*



the transaction result to be returned




___


## Methods
<a id="getValueFromTx"></a>

###  getValueFromTx

► **getValueFromTx**(valueName: *`string`*, eventName?: *`string`*, index?: *`number`*): `any`⎮`undefined`



*Inherited from [ArcTransactionResult](ArcTransactionResult.md).[getValueFromTx](ArcTransactionResult.md#getValueFromTx)*

*Defined in [ExtendTruffleContract.ts:271](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L271)*



Return a value from the transaction logs.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| valueName | `string`  | - |   The name of the property whose value we wish to return |
| eventName | `string`  |  null |   Name of the event in whose log we are to look for the value |
| index | `number`  | 0 |   Index of the log in which to look for the value, when eventName is not given.Default is the index of the last log in the transaction. |





**Returns:** `any`⎮`undefined`





___


