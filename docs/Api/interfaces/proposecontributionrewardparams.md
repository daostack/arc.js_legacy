[API Reference](../README.md) > [ProposeContributionRewardParams](../interfaces/ProposeContributionRewardParams.md)



# Interface: ProposeContributionRewardParams


## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *`string`* 

*Defined in [contracts/contributionreward.ts:614](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/contributionreward.ts#L614)*



avatar address




___

<a id="beneficiary"></a>

###  beneficiary

**●  beneficiary**:  *`string`* 

*Defined in [contracts/contributionreward.ts:660](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/contributionreward.ts#L660)*



beneficiary address




___

<a id="description"></a>

###  description

**●  description**:  *`string`* 

*Defined in [contracts/contributionreward.ts:618](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/contributionreward.ts#L618)*



description of the constraint




___

<a id="ethReward"></a>

### «Optional» ethReward

**●  ethReward**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [contracts/contributionreward.ts:635](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/contributionreward.ts#L635)*



Reward per period, in ethers. Must be >= 0. In Wei. Default is 0;




___

<a id="externalToken"></a>

### «Optional» externalToken

**●  externalToken**:  *`string`* 

*Defined in [contracts/contributionreward.ts:656](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/contributionreward.ts#L656)*



The address of the external token (for externalTokenReward) Only required when externalTokenReward is non-zero.




___

<a id="externalTokenReward"></a>

### «Optional» externalTokenReward

**●  externalTokenReward**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [contracts/contributionreward.ts:641](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/contributionreward.ts#L641)*



Reward per period in the given external token. Must be >= 0. In Wei. Default is 0;




___

<a id="nativeTokenReward"></a>

### «Optional» nativeTokenReward

**●  nativeTokenReward**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [contracts/contributionreward.ts:629](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/contributionreward.ts#L629)*



Reward in tokens per period, in the DAO's native token. Must be >= 0. In Wei. Default is 0;




___

<a id="numberOfPeriods"></a>

###  numberOfPeriods

**●  numberOfPeriods**:  *`number`* 

*Defined in [contracts/contributionreward.ts:651](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/contributionreward.ts#L651)*



Maximum number of periods that can be paid out. Must be > 0.




___

<a id="periodLength"></a>

###  periodLength

**●  periodLength**:  *`number`* 

*Defined in [contracts/contributionreward.ts:646](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/contributionreward.ts#L646)*



The number of blocks in a period. Must be > 0.




___

<a id="reputationChange"></a>

### «Optional» reputationChange

**●  reputationChange**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [contracts/contributionreward.ts:623](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/contributionreward.ts#L623)*



Amount of reputation change requested, per period. Can be negative. In Wei. Default is 0;




___


