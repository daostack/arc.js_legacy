[API Reference](../README.md) > [WrapperService](../classes/WrapperService.md)



# Class: WrapperService


Service that provides access to Arc.js contract wrapper classes and class factories.

## Index

### Properties

* [wrappers](WrapperService.md#wrappers)
* [wrappersByType](WrapperService.md#wrappersByType)


### Methods

* [getContractWrapper](WrapperService.md#getContractWrapper)
* [initialize](WrapperService.md#initialize)


### Object literals

* [factories](WrapperService.md#factories)



---
## Properties
<a id="wrappers"></a>

### «Static» wrappers

**●  wrappers**:  *[ArcWrappers](../interfaces/ArcWrappers.md)* 

*Defined in [wrapperService.ts:83](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L83)*



Wrappers by name, hydrated with contracts as deployed by this version of Arc.js.




___

<a id="wrappersByType"></a>

### «Static» wrappersByType

**●  wrappersByType**:  *[ArcWrappersByType](../interfaces/ArcWrappersByType.md)* 

*Defined in [wrapperService.ts:87](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L87)*



Contract wrapper factories grouped by type




___


## Methods
<a id="getContractWrapper"></a>

### «Static» getContractWrapper

► **getContractWrapper**(contractName: *`string`*, address?: *`string`*): `Promise`.<[ContractWrapperBase](ContractWrapperBase.md)⎮`undefined`>



*Defined in [wrapperService.ts:161](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L161)*



Returns the promise of an Arc.js contract wrapper or undefined if not found.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| contractName | `string`   |  name of an Arc contract, like "SchemeRegistrar" |
| address | `string`   |  optional |





**Returns:** `Promise`.<[ContractWrapperBase](ContractWrapperBase.md)⎮`undefined`>





___

<a id="initialize"></a>

### «Static» initialize

► **initialize**(): `Promise`.<`void`>



*Defined in [wrapperService.ts:111](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L111)*



initialize() must be called before any of the static properties will have values. It is currently called in ArcInitialize(), which in trun must be invoked by any applicaiton using Arc.js.




**Returns:** `Promise`.<`void`>





___


<a id="factories"></a>

## Object literal: factories


Wrapper factories by name. Use these when you want to do `.at()` or `.new()`. You can also use for `deployed()`, but the wrappers for deployed contracts are directly available from the `wrappers` and `wrappersByType` properties.


<a id="factories.AbsoluteVote"></a>

###  AbsoluteVote

**●  AbsoluteVote**:  *[ContractWrapperFactory](ContractWrapperFactory.md)[AbsoluteVoteWrapper](AbsoluteVoteWrapper.md)*  =  AbsoluteVote as ContractWrapperFactory<AbsoluteVoteWrapper>

*Defined in [wrapperService.ts:94](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L94)*





___
<a id="factories.ContributionReward"></a>

###  ContributionReward

**●  ContributionReward**:  *[ContractWrapperFactory](ContractWrapperFactory.md)[ContributionRewardWrapper](ContributionRewardWrapper.md)*  =  ContributionReward as ContractWrapperFactory<ContributionRewardWrapper>

*Defined in [wrapperService.ts:95](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L95)*





___
<a id="factories.DaoCreator"></a>

###  DaoCreator

**●  DaoCreator**:  *[ContractWrapperFactory](ContractWrapperFactory.md)[DaoCreatorWrapper](DaoCreatorWrapper.md)*  =  DaoCreator as ContractWrapperFactory<DaoCreatorWrapper>

*Defined in [wrapperService.ts:96](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L96)*





___
<a id="factories.GenesisProtocol"></a>

###  GenesisProtocol

**●  GenesisProtocol**:  *[ContractWrapperFactory](ContractWrapperFactory.md)[GenesisProtocolWrapper](GenesisProtocolWrapper.md)*  =  GenesisProtocol as ContractWrapperFactory<GenesisProtocolWrapper>

*Defined in [wrapperService.ts:97](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L97)*





___
<a id="factories.GlobalConstraintRegistrar"></a>

###  GlobalConstraintRegistrar

**●  GlobalConstraintRegistrar**:  *[ContractWrapperFactory](ContractWrapperFactory.md)[GlobalConstraintRegistrarWrapper](GlobalConstraintRegistrarWrapper.md)*  =  GlobalConstraintRegistrar as ContractWrapperFactory<GlobalConstraintRegistrarWrapper>

*Defined in [wrapperService.ts:98](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L98)*





___
<a id="factories.SchemeRegistrar"></a>

###  SchemeRegistrar

**●  SchemeRegistrar**:  *[ContractWrapperFactory](ContractWrapperFactory.md)[SchemeRegistrarWrapper](SchemeRegistrarWrapper.md)*  =  SchemeRegistrar as ContractWrapperFactory<SchemeRegistrarWrapper>

*Defined in [wrapperService.ts:99](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L99)*





___
<a id="factories.TokenCapGC"></a>

###  TokenCapGC

**●  TokenCapGC**:  *[ContractWrapperFactory](ContractWrapperFactory.md)[TokenCapGCWrapper](TokenCapGCWrapper.md)*  =  TokenCapGC as ContractWrapperFactory<TokenCapGCWrapper>

*Defined in [wrapperService.ts:100](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L100)*





___
<a id="factories.UpgradeScheme"></a>

###  UpgradeScheme

**●  UpgradeScheme**:  *[ContractWrapperFactory](ContractWrapperFactory.md)[UpgradeSchemeWrapper](UpgradeSchemeWrapper.md)*  =  UpgradeScheme as ContractWrapperFactory<UpgradeSchemeWrapper>

*Defined in [wrapperService.ts:101](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L101)*





___
<a id="factories.VestingScheme"></a>

###  VestingScheme

**●  VestingScheme**:  *[ContractWrapperFactory](ContractWrapperFactory.md)[VestingSchemeWrapper](VestingSchemeWrapper.md)*  =  VestingScheme as ContractWrapperFactory<VestingSchemeWrapper>

*Defined in [wrapperService.ts:102](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L102)*





___
<a id="factories.VoteInOrganizationScheme"></a>

###  VoteInOrganizationScheme

**●  VoteInOrganizationScheme**:  *[ContractWrapperFactory](ContractWrapperFactory.md)[VoteInOrganizationSchemeWrapper](VoteInOrganizationSchemeWrapper.md)*  =  VoteInOrganizationScheme as ContractWrapperFactory<VoteInOrganizationSchemeWrapper>

*Defined in [wrapperService.ts:103](https://github.com/daostack/arc.js/blob/42de6847/lib/wrapperService.ts#L103)*





___


