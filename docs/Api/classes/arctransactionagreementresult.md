[@DAOstack/Arc.js API Reference](../README.md) > [ArcTransactionAgreementResult](../classes/arctransactionagreementresult.md)



# Class: ArcTransactionAgreementResult

## Hierarchy


 [ArcTransactionResult](arctransactionresult.md)

**↳ ArcTransactionAgreementResult**







## Index

### Constructors

* [constructor](arctransactionagreementresult.md#constructor)


### Properties

* [agreementId](arctransactionagreementresult.md#agreementid)
* [tx](arctransactionagreementresult.md#tx)


### Methods

* [getValueFromTx](arctransactionagreementresult.md#getvaluefromtx)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ArcTransactionAgreementResult**(tx: *[TransactionReceiptTruffle](../interfaces/transactionreceipttruffle.md)*): [ArcTransactionAgreementResult](arctransactionagreementresult.md)


*Overrides [ArcTransactionResult](arctransactionresult.md).[constructor](arctransactionresult.md#constructor)*

*Defined in [contracts/vestingscheme.ts:322](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/vestingscheme.ts#L322)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tx | [TransactionReceiptTruffle](../interfaces/transactionreceipttruffle.md)   |  - |





**Returns:** [ArcTransactionAgreementResult](arctransactionagreementresult.md)

---


## Properties
<a id="agreementid"></a>

###  agreementId

**●  agreementId**:  *`number`* 

*Defined in [contracts/vestingscheme.ts:322](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/vestingscheme.ts#L322)*





___

<a id="tx"></a>

###  tx

**●  tx**:  *[TransactionReceiptTruffle](../interfaces/transactionreceipttruffle.md)* 

*Inherited from [ArcTransactionResult](arctransactionresult.md).[tx](arctransactionresult.md#tx)*

*Defined in [ExtendTruffleContract.ts:247](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L247)*



the transaction result to be returned




___


## Methods
<a id="getvaluefromtx"></a>

###  getValueFromTx

► **getValueFromTx**(valueName: *`string`*, eventName?: *`string`*, index?: *`number`*): `any`⎮`undefined`



*Inherited from [ArcTransactionResult](arctransactionresult.md).[getValueFromTx](arctransactionresult.md#getvaluefromtx)*

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


