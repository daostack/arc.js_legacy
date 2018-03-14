[@DAOstack/Arc.js API Reference](../README.md) > [ProposeContributionRewardParams](../interfaces/proposecontributionrewardparams.md)



# Interface: ProposeContributionRewardParams


## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *`string`* 

*Defined in [contracts/contributionreward.ts:606](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/contributionreward.ts#L606)*



avatar address




___

<a id="beneficiary"></a>

###  beneficiary

**●  beneficiary**:  *`string`* 

*Defined in [contracts/contributionreward.ts:652](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/contributionreward.ts#L652)*



beneficiary address




___

<a id="description"></a>

###  description

**●  description**:  *`string`* 

*Defined in [contracts/contributionreward.ts:610](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/contributionreward.ts#L610)*



description of the constraint




___

<a id="ethreward"></a>

### «Optional» ethReward

**●  ethReward**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [contracts/contributionreward.ts:627](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/contributionreward.ts#L627)*



Reward per period, in ethers. Must be >= 0. In Wei. Default is 0;




___

<a id="externaltoken"></a>

### «Optional» externalToken

**●  externalToken**:  *`string`* 

*Defined in [contracts/contributionreward.ts:648](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/contributionreward.ts#L648)*



The address of the external token (for externalTokenReward) Only required when externalTokenReward is non-zero.




___

<a id="externaltokenreward"></a>

### «Optional» externalTokenReward

**●  externalTokenReward**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [contracts/contributionreward.ts:633](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/contributionreward.ts#L633)*



Reward per period in the given external token. Must be >= 0. In Wei. Default is 0;




___

<a id="nativetokenreward"></a>

### «Optional» nativeTokenReward

**●  nativeTokenReward**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [contracts/contributionreward.ts:621](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/contributionreward.ts#L621)*



Reward in tokens per period, in the DAO's native token. Must be >= 0. In Wei. Default is 0;




___

<a id="numberofperiods"></a>

###  numberOfPeriods

**●  numberOfPeriods**:  *`number`* 

*Defined in [contracts/contributionreward.ts:643](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/contributionreward.ts#L643)*



Maximum number of periods that can be paid out. Must be > 0.




___

<a id="periodlength"></a>

###  periodLength

**●  periodLength**:  *`number`* 

*Defined in [contracts/contributionreward.ts:638](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/contributionreward.ts#L638)*



The number of blocks in a period. Must be > 0.




___

<a id="reputationchange"></a>

### «Optional» reputationChange

**●  reputationChange**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [contracts/contributionreward.ts:615](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/contributionreward.ts#L615)*



Amount of reputation change requested, per period. Can be negative. In Wei. Default is 0;




___


