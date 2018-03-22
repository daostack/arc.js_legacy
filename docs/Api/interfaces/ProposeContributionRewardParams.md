[API Reference](../README.md) > [ProposeContributionRewardParams](../interfaces/ProposeContributionRewardParams.md)



# Interface: ProposeContributionRewardParams


## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *[Address](../#Address)* 

*Defined in [wrappers/contributionreward.ts:619](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L619)*



avatar address




___

<a id="beneficiaryAddress"></a>

###  beneficiaryAddress

**●  beneficiaryAddress**:  *`string`* 

*Defined in [wrappers/contributionreward.ts:665](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L665)*



beneficiary address




___

<a id="description"></a>

###  description

**●  description**:  *`string`* 

*Defined in [wrappers/contributionreward.ts:623](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L623)*



description of the constraint




___

<a id="ethReward"></a>

### «Optional» ethReward

**●  ethReward**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [wrappers/contributionreward.ts:640](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L640)*



Reward per period, in ethers. Must be >= 0. In Wei. Default is 0;




___

<a id="externalToken"></a>

### «Optional» externalToken

**●  externalToken**:  *`string`* 

*Defined in [wrappers/contributionreward.ts:661](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L661)*



The address of the external token (for externalTokenReward) Only required when externalTokenReward is non-zero.




___

<a id="externalTokenReward"></a>

### «Optional» externalTokenReward

**●  externalTokenReward**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [wrappers/contributionreward.ts:646](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L646)*



Reward per period in the given external token. Must be >= 0. In Wei. Default is 0;




___

<a id="nativeTokenReward"></a>

### «Optional» nativeTokenReward

**●  nativeTokenReward**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [wrappers/contributionreward.ts:634](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L634)*



Reward in tokens per period, in the DAO's native token. Must be >= 0. In Wei. Default is 0;




___

<a id="numberOfPeriods"></a>

###  numberOfPeriods

**●  numberOfPeriods**:  *`number`* 

*Defined in [wrappers/contributionreward.ts:656](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L656)*



Maximum number of periods that can be paid out. Must be > 0.




___

<a id="periodLength"></a>

###  periodLength

**●  periodLength**:  *`number`* 

*Defined in [wrappers/contributionreward.ts:651](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L651)*



The number of blocks in a period. Must be > 0.




___

<a id="reputationChange"></a>

### «Optional» reputationChange

**●  reputationChange**:  *`BigNumber.BigNumber`⎮`string`* 

*Defined in [wrappers/contributionreward.ts:628](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L628)*



Amount of reputation change requested, per period. Can be negative. In Wei. Default is 0;




___


