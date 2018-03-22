[API Reference](../README.md) > [ContributionRewardWrapper](../classes/ContributionRewardWrapper.md)



# Class: ContributionRewardWrapper

## Hierarchy


 [ContractWrapperBase](ContractWrapperBase.md)

**↳ ContributionRewardWrapper**







## Index

### Constructors

* [constructor](ContributionRewardWrapper.md#constructor)


### Properties

* [NewContributionProposal](ContributionRewardWrapper.md#NewContributionProposal)
* [ProposalDeleted](ContributionRewardWrapper.md#ProposalDeleted)
* [ProposalExecuted](ContributionRewardWrapper.md#ProposalExecuted)
* [RedeemEther](ContributionRewardWrapper.md#RedeemEther)
* [RedeemExternalToken](ContributionRewardWrapper.md#RedeemExternalToken)
* [RedeemNativeToken](ContributionRewardWrapper.md#RedeemNativeToken)
* [RedeemReputation](ContributionRewardWrapper.md#RedeemReputation)
* [contract](ContributionRewardWrapper.md#contract)
* [frendlyName](ContributionRewardWrapper.md#frendlyName)
* [name](ContributionRewardWrapper.md#name)


### Accessors

* [address](ContributionRewardWrapper.md#address)


### Methods

* [getBeneficiaryRewards](ContributionRewardWrapper.md#getBeneficiaryRewards)
* [getController](ContributionRewardWrapper.md#getController)
* [getDaoProposals](ContributionRewardWrapper.md#getDaoProposals)
* [getDefaultPermissions](ContributionRewardWrapper.md#getDefaultPermissions)
* [getParameters](ContributionRewardWrapper.md#getParameters)
* [getParametersArray](ContributionRewardWrapper.md#getParametersArray)
* [getSchemeParameters](ContributionRewardWrapper.md#getSchemeParameters)
* [getSchemeParametersHash](ContributionRewardWrapper.md#getSchemeParametersHash)
* [getSchemePermissions](ContributionRewardWrapper.md#getSchemePermissions)
* [hydrateFromAt](ContributionRewardWrapper.md#hydrateFromAt)
* [hydrateFromDeployed](ContributionRewardWrapper.md#hydrateFromDeployed)
* [hydrateFromNew](ContributionRewardWrapper.md#hydrateFromNew)
* [proposeContributionReward](ContributionRewardWrapper.md#proposeContributionReward)
* [redeemContributionReward](ContributionRewardWrapper.md#redeemContributionReward)
* [redeemEther](ContributionRewardWrapper.md#redeemEther)
* [redeemExternalToken](ContributionRewardWrapper.md#redeemExternalToken)
* [redeemNativeToken](ContributionRewardWrapper.md#redeemNativeToken)
* [redeemReputation](ContributionRewardWrapper.md#redeemReputation)
* [setParameters](ContributionRewardWrapper.md#setParameters)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ContributionRewardWrapper**(solidityContract: *`any`*): [ContributionRewardWrapper](ContributionRewardWrapper.md)


*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[constructor](ContractWrapperBase.md#constructor)*

*Defined in [contractWrapperBase.ts:37](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L37)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [ContributionRewardWrapper](ContributionRewardWrapper.md)

---


## Properties
<a id="NewContributionProposal"></a>

###  NewContributionProposal

**●  NewContributionProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[NewContributionProposalEventResult](../interfaces/NewContributionProposalEventResult.md)*  =  this.createEventFetcherFactory<NewContributionProposalEventResult>("NewContributionProposal")

*Defined in [wrappers/contributionreward.ts:41](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L41)*



Events




___

<a id="ProposalDeleted"></a>

###  ProposalDeleted

**●  ProposalDeleted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalDeletedEventResult](../interfaces/ProposalDeletedEventResult.md)*  =  this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted")

*Defined in [wrappers/contributionreward.ts:43](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L43)*





___

<a id="ProposalExecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalExecutedEventResult](../interfaces/ProposalExecutedEventResult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [wrappers/contributionreward.ts:42](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L42)*





___

<a id="RedeemEther"></a>

###  RedeemEther

**●  RedeemEther**:  *[EventFetcherFactory](../#EventFetcherFactory)[RedeemEtherEventResult](../interfaces/RedeemEtherEventResult.md)*  =  this.createEventFetcherFactory<RedeemEtherEventResult>("RedeemEther")

*Defined in [wrappers/contributionreward.ts:45](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L45)*





___

<a id="RedeemExternalToken"></a>

###  RedeemExternalToken

**●  RedeemExternalToken**:  *[EventFetcherFactory](../#EventFetcherFactory)[RedeemExternalTokenEventResult](../interfaces/RedeemExternalTokenEventResult.md)*  =  this.createEventFetcherFactory<RedeemExternalTokenEventResult>("RedeemExternalToken")

*Defined in [wrappers/contributionreward.ts:47](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L47)*





___

<a id="RedeemNativeToken"></a>

###  RedeemNativeToken

**●  RedeemNativeToken**:  *[EventFetcherFactory](../#EventFetcherFactory)[RedeemNativeTokenEventResult](../interfaces/RedeemNativeTokenEventResult.md)*  =  this.createEventFetcherFactory<RedeemNativeTokenEventResult>("RedeemNativeToken")

*Defined in [wrappers/contributionreward.ts:46](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L46)*





___

<a id="RedeemReputation"></a>

###  RedeemReputation

**●  RedeemReputation**:  *[EventFetcherFactory](../#EventFetcherFactory)[RedeemReputationEventResult](../interfaces/RedeemReputationEventResult.md)*  =  this.createEventFetcherFactory<RedeemReputationEventResult>("RedeemReputation")

*Defined in [wrappers/contributionreward.ts:44](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L44)*





___

<a id="contract"></a>

###  contract

**●  contract**:  *`any`* 

*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[contract](ContractWrapperBase.md#contract)*

*Defined in [contractWrapperBase.ts:37](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L37)*



The underlying truffle contract object. Use this to access parts of the contract that aren't accessible via the wrapper.




___

<a id="frendlyName"></a>

###  frendlyName

**●  frendlyName**:  *`string`*  = "Contribution Reward"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[frendlyName](ContractWrapperBase.md#frendlyName)*

*Defined in [wrappers/contributionreward.ts:35](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L35)*





___

<a id="name"></a>

###  name

**●  name**:  *`string`*  = "ContributionReward"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[name](ContractWrapperBase.md#name)*

*Defined in [wrappers/contributionreward.ts:34](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L34)*





___


## Accessors
<a id="address"></a>

###  address


getaddress(): [Address](../#Address)

*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[address](ContractWrapperBase.md#address)*

*Defined in [contractWrapperBase.ts:32](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L32)*



The address of the contract




**Returns:** [Address](../#Address)



___


## Methods
<a id="getBeneficiaryRewards"></a>

###  getBeneficiaryRewards

► **getBeneficiaryRewards**(opts?: *[GetBeneficiaryRewardsParams](../interfaces/GetBeneficiaryRewardsParams.md)*): `Promise`.<`Array`.<[ProposalRewards](../interfaces/ProposalRewards.md)>>



*Defined in [wrappers/contributionreward.ts:361](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L361)*



Return a list of `ProposalRewards` for executed (passed by vote) proposals that have rewards waiting to be redeemed by the given beneficiary. `ProposalRewards` includes both the total amount redeemable and the amount yet-to-be redeemed.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetBeneficiaryRewardsParams](../interfaces/GetBeneficiaryRewardsParams.md)  |  {} as GetBeneficiaryRewardsParams |   - |





**Returns:** `Promise`.<`Array`.<[ProposalRewards](../interfaces/ProposalRewards.md)>>





___

<a id="getController"></a>

###  getController

► **getController**(avatarAddress: *[Address](../#Address)*): `Promise`.<`any`>



*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[getController](ContractWrapperBase.md#getController)*

*Defined in [contractWrapperBase.ts:136](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L136)*



return the controller associated with the given avatar


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<`any`>





___

<a id="getDaoProposals"></a>

###  getDaoProposals

► **getDaoProposals**(opts?: *[GetDaoProposalsConfig](../interfaces/GetDaoProposalsConfig.md)*): `Promise`.<`Array`.<[ContributionProposal](../interfaces/ContributionProposal.md)>>



*Defined in [wrappers/contributionreward.ts:316](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L316)*



Return all ContributionReward proposals ever created under the given avatar. Filter by the optional proposalId.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetDaoProposalsConfig](../interfaces/GetDaoProposalsConfig.md)  |  {} as GetDaoProposalsConfig |   - |





**Returns:** `Promise`.<`Array`.<[ContributionProposal](../interfaces/ContributionProposal.md)>>





___

<a id="getDefaultPermissions"></a>

###  getDefaultPermissions

► **getDefaultPermissions**(overrideValue?: *[SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)*): [SchemePermissions](../enums/SchemePermissions.md)



*Defined in [wrappers/contributionreward.ts:424](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L424)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | [SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)   |  - |





**Returns:** [SchemePermissions](../enums/SchemePermissions.md)





___

<a id="getParameters"></a>

###  getParameters

► **getParameters**(paramsHash: *[Hash](../#Hash)*): `Promise`.<[ContributionRewardParamsReturn](../interfaces/ContributionRewardParamsReturn.md)>



*Overrides [ContractWrapperBase](ContractWrapperBase.md).[getParameters](ContractWrapperBase.md#getParameters)*

*Defined in [wrappers/contributionreward.ts:437](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L437)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#Hash)   |  - |





**Returns:** `Promise`.<[ContributionRewardParamsReturn](../interfaces/ContributionRewardParamsReturn.md)>





___

<a id="getParametersArray"></a>

###  getParametersArray

► **getParametersArray**(paramsHash: *[Hash](../#Hash)*): `Promise`.<`Array`.<`any`>>



*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[getParametersArray](ContractWrapperBase.md#getParametersArray)*

*Defined in [contractWrapperBase.ts:128](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L128)*



Given a hash, return the associated parameters as an array, ordered by the order in which the parameters appear in the contract's Parameters struct.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#Hash)   |  - |





**Returns:** `Promise`.<`Array`.<`any`>>





___

<a id="getSchemeParameters"></a>

###  getSchemeParameters

► **getSchemeParameters**(avatarAddress: *[Address](../#Address)*): `Promise`.<[ContributionRewardParamsReturn](../interfaces/ContributionRewardParamsReturn.md)>



*Defined in [wrappers/contributionreward.ts:433](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L433)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[ContributionRewardParamsReturn](../interfaces/ContributionRewardParamsReturn.md)>





___

<a id="getSchemeParametersHash"></a>

###  getSchemeParametersHash

► **getSchemeParametersHash**(avatarAddress: *[Address](../#Address)*): `Promise`.<[Hash](../#Hash)>



*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[getSchemeParametersHash](ContractWrapperBase.md#getSchemeParametersHash)*

*Defined in [contractWrapperBase.ts:118](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L118)*



Given an avatar address, return the schemes parameters hash


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[Hash](../#Hash)>





___

<a id="getSchemePermissions"></a>

###  getSchemePermissions

► **getSchemePermissions**(avatarAddress: *[Address](../#Address)*): `Promise`.<[SchemePermissions](../enums/SchemePermissions.md)>



*Defined in [wrappers/contributionreward.ts:429](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L429)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[SchemePermissions](../enums/SchemePermissions.md)>





___

<a id="hydrateFromAt"></a>

###  hydrateFromAt

► **hydrateFromAt**(address: *`string`*): `Promise`.<`any`>



*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[hydrateFromAt](ContractWrapperBase.md#hydrateFromAt)*

*Defined in [contractWrapperBase.ts:67](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L67)*



Initialize from a given address on the current network.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| address | `string`   |  of the deployed contract |





**Returns:** `Promise`.<`any`>
this






___

<a id="hydrateFromDeployed"></a>

###  hydrateFromDeployed

► **hydrateFromDeployed**(): `Promise`.<`any`>



*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[hydrateFromDeployed](ContractWrapperBase.md#hydrateFromDeployed)*

*Defined in [contractWrapperBase.ts:82](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L82)*



Initialize as it was migrated by Arc.js on the current network.




**Returns:** `Promise`.<`any`>
this






___

<a id="hydrateFromNew"></a>

###  hydrateFromNew

► **hydrateFromNew**(...rest: *`Array`.<`any`>*): `Promise`.<`any`>



*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[hydrateFromNew](ContractWrapperBase.md#hydrateFromNew)*

*Defined in [contractWrapperBase.ts:51](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L51)*



Initialize from a newly-migrated instance. This will migrate a new instance of the contract to the net.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| rest | `Array`.<`any`>   |  - |





**Returns:** `Promise`.<`any`>
this






___

<a id="proposeContributionReward"></a>

###  proposeContributionReward

► **proposeContributionReward**(opts?: *[ProposeContributionRewardParams](../interfaces/ProposeContributionRewardParams.md)*): `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>



*Defined in [wrappers/contributionreward.ts:54](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L54)*



Submit a proposal for a reward for a contribution


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeContributionRewardParams](../interfaces/ProposeContributionRewardParams.md)  |  {} as ProposeContributionRewardParams |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>





___

<a id="redeemContributionReward"></a>

###  redeemContributionReward

► **redeemContributionReward**(opts?: *[ContributionRewardRedeemParams](../interfaces/ContributionRewardRedeemParams.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/contributionreward.ts:157](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L157)*



Redeem the specified rewards for the beneficiary of the proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ContributionRewardRedeemParams](../interfaces/ContributionRewardRedeemParams.md)  |  {} as ContributionRewardRedeemParams |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>





___

<a id="redeemEther"></a>

###  redeemEther

► **redeemEther**(opts?: *[ContributionRewardSpecifiedRedemptionParams](../interfaces/ContributionRewardSpecifiedRedemptionParams.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/contributionreward.ts:285](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L285)*



Redeem ether reward for the beneficiary of the proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ContributionRewardSpecifiedRedemptionParams](../interfaces/ContributionRewardSpecifiedRedemptionParams.md)  |  {} as ContributionRewardSpecifiedRedemptionParams |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>





___

<a id="redeemExternalToken"></a>

###  redeemExternalToken

► **redeemExternalToken**(opts?: *[ContributionRewardSpecifiedRedemptionParams](../interfaces/ContributionRewardSpecifiedRedemptionParams.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/contributionreward.ts:192](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L192)*



Redeem external token reward for the beneficiary of the proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ContributionRewardSpecifiedRedemptionParams](../interfaces/ContributionRewardSpecifiedRedemptionParams.md)  |  {} as ContributionRewardSpecifiedRedemptionParams |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>





___

<a id="redeemNativeToken"></a>

###  redeemNativeToken

► **redeemNativeToken**(opts?: *[ContributionRewardSpecifiedRedemptionParams](../interfaces/ContributionRewardSpecifiedRedemptionParams.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/contributionreward.ts:254](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L254)*



Redeem native token reward for the beneficiary of the proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ContributionRewardSpecifiedRedemptionParams](../interfaces/ContributionRewardSpecifiedRedemptionParams.md)  |  {} as ContributionRewardSpecifiedRedemptionParams |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>





___

<a id="redeemReputation"></a>

###  redeemReputation

► **redeemReputation**(opts?: *[ContributionRewardSpecifiedRedemptionParams](../interfaces/ContributionRewardSpecifiedRedemptionParams.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/contributionreward.ts:223](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L223)*



Redeem reputation reward for the beneficiary of the proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ContributionRewardSpecifiedRedemptionParams](../interfaces/ContributionRewardSpecifiedRedemptionParams.md)  |  {} as ContributionRewardSpecifiedRedemptionParams |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>





___

<a id="setParameters"></a>

###  setParameters

► **setParameters**(params: *[ContributionRewardParams](../interfaces/ContributionRewardParams.md)*): `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>



*Overrides [ContractWrapperBase](ContractWrapperBase.md).[setParameters](ContractWrapperBase.md#setParameters)*

*Defined in [wrappers/contributionreward.ts:409](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/contributionreward.ts#L409)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [ContributionRewardParams](../interfaces/ContributionRewardParams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___


