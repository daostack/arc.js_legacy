[API Reference](../README.md) > [CommonVestingAgreementConfig](../interfaces/CommonVestingAgreementConfig.md)



# Interface: CommonVestingAgreementConfig

## Hierarchy

**CommonVestingAgreementConfig**

↳  [CreateVestingAgreementConfig](CreateVestingAgreementConfig.md)




↳  [ProposeVestingAgreementConfig](ProposeVestingAgreementConfig.md)









## Properties
<a id="amountPerPeriod"></a>

###  amountPerPeriod

**●  amountPerPeriod**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [wrappers/vestingscheme.ts:407](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L407)*



The number of tokens to pay per period. Period is calculated as (number of blocks / periodLength). Should be expressed in Wei. Must be greater than zero.




___

<a id="beneficiaryAddress"></a>

###  beneficiaryAddress

**●  beneficiaryAddress**:  *[Address](../#Address)* 

*Defined in [wrappers/vestingscheme.ts:390](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L390)*



Address of the recipient of the proposed agreement.




___

<a id="cliffInPeriods"></a>

###  cliffInPeriods

**●  cliffInPeriods**:  *`number`* 

*Defined in [wrappers/vestingscheme.ts:423](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L423)*



The minimum number of periods that must pass before the beneficiary may collect tokens under the agreement. Must be greater than or equal to zero.




___

<a id="numOfAgreedPeriods"></a>

###  numOfAgreedPeriods

**●  numOfAgreedPeriods**:  *`number`* 

*Defined in [wrappers/vestingscheme.ts:417](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L417)*



maximum number of periods that can be paid out. Must be greater than zero.




___

<a id="periodLength"></a>

###  periodLength

**●  periodLength**:  *`number`* 

*Defined in [wrappers/vestingscheme.ts:412](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L412)*



number of blocks in a period. Must be greater than zero.




___

<a id="returnOnCancelAddress"></a>

###  returnOnCancelAddress

**●  returnOnCancelAddress**:  *`string`* 

*Defined in [wrappers/vestingscheme.ts:394](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L394)*



Where to send the tokens in case of cancellation




___

<a id="signaturesReqToCancel"></a>

###  signaturesReqToCancel

**●  signaturesReqToCancel**:  *`number`* 

*Defined in [wrappers/vestingscheme.ts:428](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L428)*



The number of signatures required to cancel agreement. See signToCancel.




___

<a id="signers"></a>

###  signers

**●  signers**:  *`Array`.<`string`>* 

*Defined in [wrappers/vestingscheme.ts:433](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L433)*



An array of addresses of those who will be allowed to sign to cancel an agreement. The length of this array must be greater than or equal to signaturesReqToCancel.




___

<a id="startingBlock"></a>

###  startingBlock

**●  startingBlock**:  *`number`* 

*Defined in [wrappers/vestingscheme.ts:400](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L400)*



Optional ethereum block number at which the agreement starts. Default is the current block number. Must be greater than or equal to zero.




___


