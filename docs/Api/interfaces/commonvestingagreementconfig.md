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

*Defined in [contracts/vestingscheme.ts:402](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/vestingscheme.ts#L402)*



The number of tokens to pay per period. Period is calculated as (number of blocks / periodLength). Should be expressed in Wei. Must be greater than zero.




___

<a id="beneficiary"></a>

###  beneficiary

**●  beneficiary**:  *`string`* 

*Defined in [contracts/vestingscheme.ts:385](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/vestingscheme.ts#L385)*



Address of the recipient of the proposed agreement.




___

<a id="cliffInPeriods"></a>

###  cliffInPeriods

**●  cliffInPeriods**:  *`number`* 

*Defined in [contracts/vestingscheme.ts:418](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/vestingscheme.ts#L418)*



The minimum number of periods that must pass before the beneficiary may collect tokens under the agreement. Must be greater than or equal to zero.




___

<a id="numOfAgreedPeriods"></a>

###  numOfAgreedPeriods

**●  numOfAgreedPeriods**:  *`number`* 

*Defined in [contracts/vestingscheme.ts:412](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/vestingscheme.ts#L412)*



maximum number of periods that can be paid out. Must be greater than zero.




___

<a id="periodLength"></a>

###  periodLength

**●  periodLength**:  *`number`* 

*Defined in [contracts/vestingscheme.ts:407](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/vestingscheme.ts#L407)*



number of blocks in a period. Must be greater than zero.




___

<a id="returnOnCancelAddress"></a>

###  returnOnCancelAddress

**●  returnOnCancelAddress**:  *`string`* 

*Defined in [contracts/vestingscheme.ts:389](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/vestingscheme.ts#L389)*



Where to send the tokens in case of cancellation




___

<a id="signaturesReqToCancel"></a>

###  signaturesReqToCancel

**●  signaturesReqToCancel**:  *`number`* 

*Defined in [contracts/vestingscheme.ts:423](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/vestingscheme.ts#L423)*



The number of signatures required to cancel agreement. See signToCancel.




___

<a id="signers"></a>

###  signers

**●  signers**:  *`Array`.<`string`>* 

*Defined in [contracts/vestingscheme.ts:428](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/vestingscheme.ts#L428)*



An array of addresses of those who will be allowed to sign to cancel an agreement. The length of this array must be greater than or equal to signaturesReqToCancel.




___

<a id="startingBlock"></a>

###  startingBlock

**●  startingBlock**:  *`number`* 

*Defined in [contracts/vestingscheme.ts:395](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/vestingscheme.ts#L395)*



Optional ethereum block number at which the agreement starts. Default is the current block number. Must be greater than or equal to zero.




___


