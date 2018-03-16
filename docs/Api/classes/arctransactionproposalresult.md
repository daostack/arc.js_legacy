[API Reference](../README.md) > [ArcTransactionProposalResult](../classes/ArcTransactionProposalResult.md)



# Class: ArcTransactionProposalResult


Base or actual type returned by all contract wrapper methods that generate a transaction and initiate a proposal.

## Hierarchy


 [ArcTransactionResult](ArcTransactionResult.md)

**↳ ArcTransactionProposalResult**







## Index

### Constructors

* [constructor](ArcTransactionProposalResult.md#constructor)


### Properties

* [proposalId](ArcTransactionProposalResult.md#proposalId)
* [tx](ArcTransactionProposalResult.md#tx)


### Methods

* [getValueFromTx](ArcTransactionProposalResult.md#getValueFromTx)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ArcTransactionProposalResult**(tx: *[TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)*): [ArcTransactionProposalResult](ArcTransactionProposalResult.md)


*Overrides [ArcTransactionResult](ArcTransactionResult.md).[constructor](ArcTransactionResult.md#constructor)*

*Defined in [ExtendTruffleContract.ts:283](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L283)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tx | [TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)   |  - |





**Returns:** [ArcTransactionProposalResult](ArcTransactionProposalResult.md)

---


## Properties
<a id="proposalId"></a>

###  proposalId

**●  proposalId**:  *`string`* 

*Defined in [ExtendTruffleContract.ts:283](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L283)*



unique hash identifying a proposal




___

<a id="tx"></a>

###  tx

**●  tx**:  *[TransactionReceiptTruffle](../interfaces/TransactionReceiptTruffle.md)* 

*Inherited from [ArcTransactionResult](ArcTransactionResult.md).[tx](ArcTransactionResult.md#tx)*

*Defined in [ExtendTruffleContract.ts:258](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L258)*



the transaction result to be returned




___


## Methods
<a id="getValueFromTx"></a>

###  getValueFromTx

► **getValueFromTx**(valueName: *`string`*, eventName?: *`string`*, index?: *`number`*): `any`⎮`undefined`



*Inherited from [ArcTransactionResult](ArcTransactionResult.md).[getValueFromTx](ArcTransactionResult.md#getValueFromTx)*

*Defined in [ExtendTruffleContract.ts:271](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L271)*



Return a value from the transaction logs.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| valueName | `string`  | - |   The name of the property whose value we wish to return |
| eventName | `string`  |  null |   Name of the event in whose log we are to look for the value |
| index | `number`  | 0 |   Index of the log in which to look for the value, when eventName is not given.Default is the index of the last log in the transaction. |





**Returns:** `any`⎮`undefined`





___


