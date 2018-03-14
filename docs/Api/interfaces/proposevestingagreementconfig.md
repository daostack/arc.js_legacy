[@DAOstack/Arc.js API Reference](../README.md) > [ProposeVestingAgreementConfig](../interfaces/proposevestingagreementconfig.md)



# Interface: ProposeVestingAgreementConfig

## Hierarchy


 [CommonVestingAgreementConfig](commonvestingagreementconfig.md)

**↳ ProposeVestingAgreementConfig**








## Properties
<a id="amountperperiod"></a>

###  amountPerPeriod

**●  amountPerPeriod**:  *`BigNumber.BigNumber`⎮`string`* 

*Inherited from [CommonVestingAgreementConfig](commonvestingagreementconfig.md).[amountPerPeriod](commonvestingagreementconfig.md#amountperperiod)*

*Defined in [contracts/vestingscheme.ts:405](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L405)*



The number of tokens to pay per period. Period is calculated as (number of blocks / periodLength). Should be expressed in Wei. Must be greater than zero.




___

<a id="avatar"></a>

###  avatar

**●  avatar**:  *`string`* 

*Defined in [contracts/vestingscheme.ts:446](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L446)*



The address of the avatar in which the proposal is being be made.




___

<a id="beneficiary"></a>

###  beneficiary

**●  beneficiary**:  *`string`* 

*Inherited from [CommonVestingAgreementConfig](commonvestingagreementconfig.md).[beneficiary](commonvestingagreementconfig.md#beneficiary)*

*Defined in [contracts/vestingscheme.ts:388](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L388)*



Address of the recipient of the proposed agreement.




___

<a id="cliffinperiods"></a>

###  cliffInPeriods

**●  cliffInPeriods**:  *`number`* 

*Inherited from [CommonVestingAgreementConfig](commonvestingagreementconfig.md).[cliffInPeriods](commonvestingagreementconfig.md#cliffinperiods)*

*Defined in [contracts/vestingscheme.ts:421](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L421)*



The minimum number of periods that must pass before the beneficiary may collect tokens under the agreement. Must be greater than or equal to zero.




___

<a id="numofagreedperiods"></a>

###  numOfAgreedPeriods

**●  numOfAgreedPeriods**:  *`number`* 

*Inherited from [CommonVestingAgreementConfig](commonvestingagreementconfig.md).[numOfAgreedPeriods](commonvestingagreementconfig.md#numofagreedperiods)*

*Defined in [contracts/vestingscheme.ts:415](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L415)*



maximum number of periods that can be paid out. Must be greater than zero.




___

<a id="periodlength"></a>

###  periodLength

**●  periodLength**:  *`number`* 

*Inherited from [CommonVestingAgreementConfig](commonvestingagreementconfig.md).[periodLength](commonvestingagreementconfig.md#periodlength)*

*Defined in [contracts/vestingscheme.ts:410](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L410)*



number of blocks in a period. Must be greater than zero.




___

<a id="returnoncanceladdress"></a>

###  returnOnCancelAddress

**●  returnOnCancelAddress**:  *`string`* 

*Inherited from [CommonVestingAgreementConfig](commonvestingagreementconfig.md).[returnOnCancelAddress](commonvestingagreementconfig.md#returnoncanceladdress)*

*Defined in [contracts/vestingscheme.ts:392](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L392)*



Where to send the tokens in case of cancellation




___

<a id="signaturesreqtocancel"></a>

###  signaturesReqToCancel

**●  signaturesReqToCancel**:  *`number`* 

*Inherited from [CommonVestingAgreementConfig](commonvestingagreementconfig.md).[signaturesReqToCancel](commonvestingagreementconfig.md#signaturesreqtocancel)*

*Defined in [contracts/vestingscheme.ts:426](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L426)*



The number of signatures required to cancel agreement. See signToCancel.




___

<a id="signers"></a>

###  signers

**●  signers**:  *`Array`.<`string`>* 

*Inherited from [CommonVestingAgreementConfig](commonvestingagreementconfig.md).[signers](commonvestingagreementconfig.md#signers)*

*Defined in [contracts/vestingscheme.ts:431](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L431)*



An array of addresses of those who will be allowed to sign to cancel an agreement. The length of this array must be greater than or equal to signaturesReqToCancel.




___

<a id="startingblock"></a>

###  startingBlock

**●  startingBlock**:  *`number`* 

*Inherited from [CommonVestingAgreementConfig](commonvestingagreementconfig.md).[startingBlock](commonvestingagreementconfig.md#startingblock)*

*Defined in [contracts/vestingscheme.ts:398](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L398)*



Optional ethereum block number at which the agreement starts. Default is the current block number. Must be greater than or equal to zero.




___


