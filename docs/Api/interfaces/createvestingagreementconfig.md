[API Reference](../README.md) > [CreateVestingAgreementConfig](../interfaces/CreateVestingAgreementConfig.md)



# Interface: CreateVestingAgreementConfig

## Hierarchy


 [CommonVestingAgreementConfig](CommonVestingAgreementConfig.md)

**↳ CreateVestingAgreementConfig**








## Properties
<a id="amountPerPeriod"></a>

###  amountPerPeriod

**●  amountPerPeriod**:  *`BigNumber.BigNumber`⎮`string`* 

*Inherited from [CommonVestingAgreementConfig](CommonVestingAgreementConfig.md).[amountPerPeriod](CommonVestingAgreementConfig.md#amountPerPeriod)*

*Defined in [contracts/vestingscheme.ts:402](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L402)*



The number of tokens to pay per period. Period is calculated as (number of blocks / periodLength). Should be expressed in Wei. Must be greater than zero.




___

<a id="beneficiary"></a>

###  beneficiary

**●  beneficiary**:  *`string`* 

*Inherited from [CommonVestingAgreementConfig](CommonVestingAgreementConfig.md).[beneficiary](CommonVestingAgreementConfig.md#beneficiary)*

*Defined in [contracts/vestingscheme.ts:385](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L385)*



Address of the recipient of the proposed agreement.




___

<a id="cliffInPeriods"></a>

###  cliffInPeriods

**●  cliffInPeriods**:  *`number`* 

*Inherited from [CommonVestingAgreementConfig](CommonVestingAgreementConfig.md).[cliffInPeriods](CommonVestingAgreementConfig.md#cliffInPeriods)*

*Defined in [contracts/vestingscheme.ts:418](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L418)*



The minimum number of periods that must pass before the beneficiary may collect tokens under the agreement. Must be greater than or equal to zero.




___

<a id="numOfAgreedPeriods"></a>

###  numOfAgreedPeriods

**●  numOfAgreedPeriods**:  *`number`* 

*Inherited from [CommonVestingAgreementConfig](CommonVestingAgreementConfig.md).[numOfAgreedPeriods](CommonVestingAgreementConfig.md#numOfAgreedPeriods)*

*Defined in [contracts/vestingscheme.ts:412](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L412)*



maximum number of periods that can be paid out. Must be greater than zero.




___

<a id="periodLength"></a>

###  periodLength

**●  periodLength**:  *`number`* 

*Inherited from [CommonVestingAgreementConfig](CommonVestingAgreementConfig.md).[periodLength](CommonVestingAgreementConfig.md#periodLength)*

*Defined in [contracts/vestingscheme.ts:407](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L407)*



number of blocks in a period. Must be greater than zero.




___

<a id="returnOnCancelAddress"></a>

###  returnOnCancelAddress

**●  returnOnCancelAddress**:  *`string`* 

*Inherited from [CommonVestingAgreementConfig](CommonVestingAgreementConfig.md).[returnOnCancelAddress](CommonVestingAgreementConfig.md#returnOnCancelAddress)*

*Defined in [contracts/vestingscheme.ts:389](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L389)*



Where to send the tokens in case of cancellation




___

<a id="signaturesReqToCancel"></a>

###  signaturesReqToCancel

**●  signaturesReqToCancel**:  *`number`* 

*Inherited from [CommonVestingAgreementConfig](CommonVestingAgreementConfig.md).[signaturesReqToCancel](CommonVestingAgreementConfig.md#signaturesReqToCancel)*

*Defined in [contracts/vestingscheme.ts:423](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L423)*



The number of signatures required to cancel agreement. See signToCancel.




___

<a id="signers"></a>

###  signers

**●  signers**:  *`Array`.<`string`>* 

*Inherited from [CommonVestingAgreementConfig](CommonVestingAgreementConfig.md).[signers](CommonVestingAgreementConfig.md#signers)*

*Defined in [contracts/vestingscheme.ts:428](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L428)*



An array of addresses of those who will be allowed to sign to cancel an agreement. The length of this array must be greater than or equal to signaturesReqToCancel.




___

<a id="startingBlock"></a>

###  startingBlock

**●  startingBlock**:  *`number`* 

*Inherited from [CommonVestingAgreementConfig](CommonVestingAgreementConfig.md).[startingBlock](CommonVestingAgreementConfig.md#startingBlock)*

*Defined in [contracts/vestingscheme.ts:395](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L395)*



Optional ethereum block number at which the agreement starts. Default is the current block number. Must be greater than or equal to zero.




___

<a id="token"></a>

###  token

**●  token**:  *`string`* 

*Defined in [contracts/vestingscheme.ts:436](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L436)*



The address of the token that will be used to pay for the creation of the agreement. The caller (msg.Sender) must have the funds to pay in that token.




___


