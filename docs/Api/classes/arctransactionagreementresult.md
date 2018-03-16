[API Reference](../README.md) > [ArcTransactionAgreementResult](../classes/ArcTransactionAgreementResult.md)



# Class: ArcTransactionAgreementResult

## Hierarchy


 [ArcTransactionResult](ArcTransactionResult.md)

**↳ ArcTransactionAgreementResult**







## Index

### Constructors

* [constructor](ArcTransactionAgreementResult.md#constructor)


### Properties

* [agreementId](ArcTransactionAgreementResult.md#agreementId)
* [tx](ArcTransactionAgreementResult.md#tx)


### Methods

* [getValueFromTx](ArcTransactionAgreementResult.md#getValueFromTx)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ArcTransactionAgreementResult**(tx: *[TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)*): [ArcTransactionAgreementResult](ArcTransactionAgreementResult.md)


*Overrides [ArcTransactionResult](ArcTransactionResult.md).[constructor](ArcTransactionResult.md#constructor)*

*Defined in [contracts/vestingscheme.ts:319](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/vestingscheme.ts#L319)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tx | [TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)   |  - |





**Returns:** [ArcTransactionAgreementResult](ArcTransactionAgreementResult.md)

---


## Properties
<a id="agreementId"></a>

###  agreementId

**●  agreementId**:  *`number`* 

*Defined in [contracts/vestingscheme.ts:319](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/vestingscheme.ts#L319)*





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


