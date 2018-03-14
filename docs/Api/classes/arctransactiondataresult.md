[@DAOstack/Arc.js API Reference](../README.md) > [ArcTransactionDataResult](../classes/arctransactiondataresult.md)



# Class: ArcTransactionDataResult


Base or actual type returned by all contract wrapper methods that generate a transaction and any other result.

## Type parameters
#### TData 
## Hierarchy


 [ArcTransactionResult](arctransactionresult.md)

**↳ ArcTransactionDataResult**







## Index

### Constructors

* [constructor](arctransactiondataresult.md#constructor)


### Properties

* [result](arctransactiondataresult.md#result)
* [tx](arctransactiondataresult.md#tx)


### Methods

* [getValueFromTx](arctransactiondataresult.md#getvaluefromtx)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ArcTransactionDataResult**(tx: *[TransactionReceiptTruffle](../interfaces/transactionreceipttruffle.md)*, result: *`TData`*): [ArcTransactionDataResult](arctransactiondataresult.md)


*Overrides [ArcTransactionResult](arctransactionresult.md).[constructor](arctransactionresult.md#constructor)*

*Defined in [ExtendTruffleContract.ts:286](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L286)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tx | [TransactionReceiptTruffle](../interfaces/transactionreceipttruffle.md)   |  - |
| result | `TData`   |  - |





**Returns:** [ArcTransactionDataResult](arctransactiondataresult.md)

---


## Properties
<a id="result"></a>

###  result

**●  result**:  *`TData`* 

*Defined in [ExtendTruffleContract.ts:286](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L286)*



The data result to be returned




___

<a id="tx"></a>

###  tx

**●  tx**:  *[TransactionReceiptTruffle](../interfaces/transactionreceipttruffle.md)* 

*Inherited from [ArcTransactionResult](arctransactionresult.md).[tx](arctransactionresult.md#tx)*

*Defined in [ExtendTruffleContract.ts:247](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L247)*



the transaction result to be returned




___


## Methods
<a id="getvaluefromtx"></a>

###  getValueFromTx

► **getValueFromTx**(valueName: *`string`*, eventName?: *`string`*, index?: *`number`*): `any`⎮`undefined`



*Inherited from [ArcTransactionResult](arctransactionresult.md).[getValueFromTx](arctransactionresult.md#getvaluefromtx)*

*Defined in [ExtendTruffleContract.ts:260](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L260)*



Return a value from the transaction logs.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| valueName | `string`  | - |   The name of the property whose value we wish to return |
| eventName | `string`  |  null |   Name of the event in whose log we are to look for the value |
| index | `number`  | 0 |   Index of the log in which to look for the value, when eventName is not given.Default is the index of the last log in the transaction. |





**Returns:** `any`⎮`undefined`





___


