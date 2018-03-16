[API Reference](../README.md) > [ContributionRewardWrapper](../classes/ContributionRewardWrapper.md)



# Class: ContributionRewardWrapper

## Hierarchy


 [ExtendTruffleContract](ExtendTruffleContract.md)

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


### Accessors

* [address](ContributionRewardWrapper.md#address)


### Methods

* [getBeneficiaryRewards](ContributionRewardWrapper.md#getBeneficiaryRewards)
* [getController](ContributionRewardWrapper.md#getController)
* [getDaoProposals](ContributionRewardWrapper.md#getDaoProposals)
* [getDefaultPermissions](ContributionRewardWrapper.md#getDefaultPermissions)
* [getParameters](ContributionRewardWrapper.md#getParameters)
* [getParametersArray](ContributionRewardWrapper.md#getParametersArray)
* [getPermissions](ContributionRewardWrapper.md#getPermissions)
* [getSchemeParameters](ContributionRewardWrapper.md#getSchemeParameters)
* [getSchemeParametersHash](ContributionRewardWrapper.md#getSchemeParametersHash)
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


*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[constructor](ExtendTruffleContract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L26)*



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

*Defined in [contracts/contributionreward.ts:39](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L39)*



Events




___

<a id="ProposalDeleted"></a>

###  ProposalDeleted

**●  ProposalDeleted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalDeletedEventResult](../interfaces/ProposalDeletedEventResult.md)*  =  this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted")

*Defined in [contracts/contributionreward.ts:41](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L41)*





___

<a id="ProposalExecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalExecutedEventResult](../interfaces/ProposalExecutedEventResult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [contracts/contributionreward.ts:40](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L40)*





___

<a id="RedeemEther"></a>

###  RedeemEther

**●  RedeemEther**:  *[EventFetcherFactory](../#EventFetcherFactory)[RedeemEtherEventResult](../interfaces/RedeemEtherEventResult.md)*  =  this.createEventFetcherFactory<RedeemEtherEventResult>("RedeemEther")

*Defined in [contracts/contributionreward.ts:43](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L43)*





___

<a id="RedeemExternalToken"></a>

###  RedeemExternalToken

**●  RedeemExternalToken**:  *[EventFetcherFactory](../#EventFetcherFactory)[RedeemExternalTokenEventResult](../interfaces/RedeemExternalTokenEventResult.md)*  =  this.createEventFetcherFactory<RedeemExternalTokenEventResult>("RedeemExternalToken")

*Defined in [contracts/contributionreward.ts:45](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L45)*





___

<a id="RedeemNativeToken"></a>

###  RedeemNativeToken

**●  RedeemNativeToken**:  *[EventFetcherFactory](../#EventFetcherFactory)[RedeemNativeTokenEventResult](../interfaces/RedeemNativeTokenEventResult.md)*  =  this.createEventFetcherFactory<RedeemNativeTokenEventResult>("RedeemNativeToken")

*Defined in [contracts/contributionreward.ts:44](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L44)*





___

<a id="RedeemReputation"></a>

###  RedeemReputation

**●  RedeemReputation**:  *[EventFetcherFactory](../#EventFetcherFactory)[RedeemReputationEventResult](../interfaces/RedeemReputationEventResult.md)*  =  this.createEventFetcherFactory<RedeemReputationEventResult>("RedeemReputation")

*Defined in [contracts/contributionreward.ts:42](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L42)*





___

<a id="contract"></a>

###  contract

**●  contract**:  *`any`* 

*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[contract](ExtendTruffleContract.md#contract)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L26)*



The underlying truffle contract object. Use this to access parts of the contract that aren't accessible via the wrapper.




___


## Accessors
<a id="address"></a>

###  address


getaddress(): [Address](../#Address)

*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[address](ExtendTruffleContract.md#address)*

*Defined in [ExtendTruffleContract.ts:148](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L148)*





**Returns:** [Address](../#Address)



___


## Methods
<a id="getBeneficiaryRewards"></a>

###  getBeneficiaryRewards

► **getBeneficiaryRewards**(opts?: *[GetBeneficiaryRewardsParams](../interfaces/GetBeneficiaryRewardsParams.md)*): `Promise`.<`Array`.<[ProposalRewards](../interfaces/ProposalRewards.md)>>



*Defined in [contracts/contributionreward.ts:359](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L359)*



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



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[getController](ExtendTruffleContract.md#getController)*

*Defined in [ExtendTruffleContract.ts:143](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L143)*



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



*Defined in [contracts/contributionreward.ts:314](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L314)*



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



*Overrides [ExtendTruffleContract](ExtendTruffleContract.md).[getDefaultPermissions](ExtendTruffleContract.md#getDefaultPermissions)*

*Defined in [contracts/contributionreward.ts:422](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L422)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | [SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)   |  - |





**Returns:** [SchemePermissions](../enums/SchemePermissions.md)





___

<a id="getParameters"></a>

###  getParameters

► **getParameters**(paramsHash: *[Hash](../#Hash)*): `Promise`.<[ContributionRewardParamsReturn](../interfaces/ContributionRewardParamsReturn.md)>



*Overrides [ExtendTruffleContract](ExtendTruffleContract.md).[getParameters](ExtendTruffleContract.md#getParameters)*

*Defined in [contracts/contributionreward.ts:431](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L431)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#Hash)   |  - |





**Returns:** `Promise`.<[ContributionRewardParamsReturn](../interfaces/ContributionRewardParamsReturn.md)>





___

<a id="getParametersArray"></a>

###  getParametersArray

► **getParametersArray**(paramsHash: *[Hash](../#Hash)*): `Promise`.<`Array`.<`any`>>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[getParametersArray](ExtendTruffleContract.md#getParametersArray)*

*Defined in [ExtendTruffleContract.ts:135](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L135)*



Given a hash, return the associated parameters as an array, ordered by the order in which the parameters appear in the contract's Parameters struct.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#Hash)   |  - |





**Returns:** `Promise`.<`Array`.<`any`>>





___

<a id="getPermissions"></a>

###  getPermissions

► **getPermissions**(avatarAddress: *[Address](../#Address)*): `Promise`.<[SchemePermissions](../enums/SchemePermissions.md)>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[getPermissions](ExtendTruffleContract.md#getPermissions)*

*Defined in [ExtendTruffleContract.ts:106](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L106)*



Return this scheme's permissions.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[SchemePermissions](../enums/SchemePermissions.md)>





___

<a id="getSchemeParameters"></a>

###  getSchemeParameters

► **getSchemeParameters**(avatarAddress: *[Address](../#Address)*): `Promise`.<[ContributionRewardParamsReturn](../interfaces/ContributionRewardParamsReturn.md)>



*Defined in [contracts/contributionreward.ts:427](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L427)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[ContributionRewardParamsReturn](../interfaces/ContributionRewardParamsReturn.md)>





___

<a id="getSchemeParametersHash"></a>

###  getSchemeParametersHash

► **getSchemeParametersHash**(avatarAddress: *[Address](../#Address)*): `Promise`.<[Hash](../#Hash)>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[getSchemeParametersHash](ExtendTruffleContract.md#getSchemeParametersHash)*

*Defined in [ExtendTruffleContract.ts:125](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L125)*



Given an avatar address, return the schemes parameters hash


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[Hash](../#Hash)>





___

<a id="hydrateFromAt"></a>

###  hydrateFromAt

► **hydrateFromAt**(address: *`string`*): `Promise`.<`any`>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[hydrateFromAt](ExtendTruffleContract.md#hydrateFromAt)*

*Defined in [ExtendTruffleContract.ts:56](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L56)*



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



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[hydrateFromDeployed](ExtendTruffleContract.md#hydrateFromDeployed)*

*Defined in [ExtendTruffleContract.ts:71](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L71)*



Initialize as it was migrated by Arc.js on the current network.




**Returns:** `Promise`.<`any`>
this






___

<a id="hydrateFromNew"></a>

###  hydrateFromNew

► **hydrateFromNew**(...rest: *`Array`.<`any`>*): `Promise`.<`any`>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[hydrateFromNew](ExtendTruffleContract.md#hydrateFromNew)*

*Defined in [ExtendTruffleContract.ts:40](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L40)*



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



*Defined in [contracts/contributionreward.ts:52](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L52)*



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



*Defined in [contracts/contributionreward.ts:155](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L155)*



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



*Defined in [contracts/contributionreward.ts:283](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L283)*



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



*Defined in [contracts/contributionreward.ts:190](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L190)*



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



*Defined in [contracts/contributionreward.ts:252](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L252)*



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



*Defined in [contracts/contributionreward.ts:221](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L221)*



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



*Overrides [ExtendTruffleContract](ExtendTruffleContract.md).[setParameters](ExtendTruffleContract.md#setParameters)*

*Defined in [contracts/contributionreward.ts:407](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/contributionreward.ts#L407)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [ContributionRewardParams](../interfaces/ContributionRewardParams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___


