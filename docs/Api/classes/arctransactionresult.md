[@DAOstack/Arc.js API Reference](../README.md) > [ArcTransactionResult](../classes/arctransactionresult.md)



# Class: ArcTransactionResult

## Hierarchy

**ArcTransactionResult**

↳  [ArcTransactionProposalResult](arctransactionproposalresult.md)




↳  [ArcTransactionDataResult](arctransactiondataresult.md)




↳  [ArcTransactionAgreementResult](arctransactionagreementresult.md)








## Index

### Constructors

* [constructor](arctransactionresult.md#constructor)


### Properties

* [tx](arctransactionresult.md#tx)


### Methods

* [getValueFromTx](arctransactionresult.md#getvaluefromtx)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ArcTransactionResult**(tx: *[TransactionReceiptTruffle](../interfaces/transactionreceipttruffle.md)*): [ArcTransactionResult](arctransactionresult.md)


*Defined in [ExtendTruffleContract.ts:247](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L247)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tx | [TransactionReceiptTruffle](../interfaces/transactionreceipttruffle.md)   |  - |





**Returns:** [ArcTransactionResult](arctransactionresult.md)

---


## Properties
<a id="tx"></a>

###  tx

**●  tx**:  *[TransactionReceiptTruffle](../interfaces/transactionreceipttruffle.md)* 

*Defined in [ExtendTruffleContract.ts:247](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L247)*



the transaction result to be returned




___


## Methods
<a id="getvaluefromtx"></a>

###  getValueFromTx

► **getValueFromTx**(valueName: *`string`*, eventName?: *`string`*, index?: *`number`*): `any`⎮`undefined`



*Defined in [ExtendTruffleContract.ts:260](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L260)*



Return a value from the transaction logs.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| valueName | `string`  | - |   The name of the property whose value we wish to return |
| eventName | `string`  |  null |   Name of the event in whose log we are to look for the value |
| index | `number`  | 0 |   Index of the log in which to look for the value, when eventName is not given.Default is the index of the last log in the transaction. |





**Returns:** `any`⎮`undefined`





___


