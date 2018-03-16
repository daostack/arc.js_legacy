[API Reference](../README.md) > [ArcTransactionResult](../classes/ArcTransactionResult.md)



# Class: ArcTransactionResult

## Hierarchy

**ArcTransactionResult**

↳  [ArcTransactionProposalResult](ArcTransactionProposalResult.md)




↳  [ArcTransactionDataResult](ArcTransactionDataResult.md)




↳  [ArcTransactionAgreementResult](ArcTransactionAgreementResult.md)








## Index

### Constructors

* [constructor](ArcTransactionResult.md#constructor)


### Properties

* [tx](ArcTransactionResult.md#tx)


### Methods

* [getValueFromTx](ArcTransactionResult.md#getValueFromTx)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ArcTransactionResult**(tx: *[TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)*): [ArcTransactionResult](ArcTransactionResult.md)


*Defined in [ExtendTruffleContract.ts:258](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L258)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tx | [TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)   |  - |





**Returns:** [ArcTransactionResult](ArcTransactionResult.md)

---


## Properties
<a id="tx"></a>

###  tx

**●  tx**:  *[TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)* 

*Defined in [ExtendTruffleContract.ts:258](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L258)*



the transaction result to be returned




___


## Methods
<a id="getValueFromTx"></a>

###  getValueFromTx

► **getValueFromTx**(valueName: *`string`*, eventName?: *`string`*, index?: *`number`*): `any`⎮`undefined`



*Defined in [ExtendTruffleContract.ts:271](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L271)*



Return a value from the transaction logs.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| valueName | `string`  | - |   The name of the property whose value we wish to return |
| eventName | `string`  |  null |   Name of the event in whose log we are to look for the value |
| index | `number`  | 0 |   Index of the log in which to look for the value, when eventName is not given.Default is the index of the last log in the transaction. |





**Returns:** `any`⎮`undefined`





___


