[@DAOstack/Arc.js API Reference](../README.md) > [ContributionRewardWrapper](../classes/contributionrewardwrapper.md)



# Class: ContributionRewardWrapper

## Hierarchy


 [ExtendTruffleContract](extendtrufflecontract.md)

**↳ ContributionRewardWrapper**







## Index

### Constructors

* [constructor](contributionrewardwrapper.md#constructor)


### Properties

* [NewContributionProposal](contributionrewardwrapper.md#newcontributionproposal)
* [ProposalDeleted](contributionrewardwrapper.md#proposaldeleted)
* [ProposalExecuted](contributionrewardwrapper.md#proposalexecuted)
* [RedeemEther](contributionrewardwrapper.md#redeemether)
* [RedeemExternalToken](contributionrewardwrapper.md#redeemexternaltoken)
* [RedeemNativeToken](contributionrewardwrapper.md#redeemnativetoken)
* [RedeemReputation](contributionrewardwrapper.md#redeemreputation)
* [contract](contributionrewardwrapper.md#contract)


### Accessors

* [address](contributionrewardwrapper.md#address)


### Methods

* [getBeneficiaryRewards](contributionrewardwrapper.md#getbeneficiaryrewards)
* [getDaoProposals](contributionrewardwrapper.md#getdaoproposals)
* [getDefaultPermissions](contributionrewardwrapper.md#getdefaultpermissions)
* [getParameters](contributionrewardwrapper.md#getparameters)
* [getParametersArray](contributionrewardwrapper.md#getparametersarray)
* [getSchemeParameters](contributionrewardwrapper.md#getschemeparameters)
* [getSchemeParametersHash](contributionrewardwrapper.md#getschemeparametershash)
* [hydrateFromAt](contributionrewardwrapper.md#hydratefromat)
* [hydrateFromDeployed](contributionrewardwrapper.md#hydratefromdeployed)
* [hydrateFromNew](contributionrewardwrapper.md#hydratefromnew)
* [proposeContributionReward](contributionrewardwrapper.md#proposecontributionreward)
* [redeemContributionReward](contributionrewardwrapper.md#redeemcontributionreward)
* [redeemEther](contributionrewardwrapper.md#redeemether-1)
* [redeemExternalToken](contributionrewardwrapper.md#redeemexternaltoken-1)
* [redeemNativeToken](contributionrewardwrapper.md#redeemnativetoken-1)
* [redeemReputation](contributionrewardwrapper.md#redeemreputation-1)
* [setParameters](contributionrewardwrapper.md#setparameters)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ContributionRewardWrapper**(solidityContract: *`any`*): [ContributionRewardWrapper](contributionrewardwrapper.md)


*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[constructor](extendtrufflecontract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [ContributionRewardWrapper](contributionrewardwrapper.md)

---


## Properties
<a id="newcontributionproposal"></a>

###  NewContributionProposal

**●  NewContributionProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[NewContributionProposalEventResult](../interfaces/newcontributionproposaleventresult.md)*  =  this.createEventFetcherFactory<NewContributionProposalEventResult>("NewContributionProposal")

*Defined in [contracts/contributionreward.ts:32](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L32)*



Events




___

<a id="proposaldeleted"></a>

###  ProposalDeleted

**●  ProposalDeleted**:  *[EventFetcherFactory](../#eventfetcherfactory)[ProposalDeletedEventResult](../interfaces/proposaldeletedeventresult.md)*  =  this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted")

*Defined in [contracts/contributionreward.ts:34](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L34)*





___

<a id="proposalexecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#eventfetcherfactory)[ProposalExecutedEventResult](../interfaces/proposalexecutedeventresult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [contracts/contributionreward.ts:33](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L33)*





___

<a id="redeemether"></a>

###  RedeemEther

**●  RedeemEther**:  *[EventFetcherFactory](../#eventfetcherfactory)[RedeemEtherEventResult](../interfaces/redeemethereventresult.md)*  =  this.createEventFetcherFactory<RedeemEtherEventResult>("RedeemEther")

*Defined in [contracts/contributionreward.ts:36](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L36)*





___

<a id="redeemexternaltoken"></a>

###  RedeemExternalToken

**●  RedeemExternalToken**:  *[EventFetcherFactory](../#eventfetcherfactory)[RedeemExternalTokenEventResult](../interfaces/redeemexternaltokeneventresult.md)*  =  this.createEventFetcherFactory<RedeemExternalTokenEventResult>("RedeemExternalToken")

*Defined in [contracts/contributionreward.ts:38](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L38)*





___

<a id="redeemnativetoken"></a>

###  RedeemNativeToken

**●  RedeemNativeToken**:  *[EventFetcherFactory](../#eventfetcherfactory)[RedeemNativeTokenEventResult](../interfaces/redeemnativetokeneventresult.md)*  =  this.createEventFetcherFactory<RedeemNativeTokenEventResult>("RedeemNativeToken")

*Defined in [contracts/contributionreward.ts:37](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L37)*





___

<a id="redeemreputation"></a>

###  RedeemReputation

**●  RedeemReputation**:  *[EventFetcherFactory](../#eventfetcherfactory)[RedeemReputationEventResult](../interfaces/redeemreputationeventresult.md)*  =  this.createEventFetcherFactory<RedeemReputationEventResult>("RedeemReputation")

*Defined in [contracts/contributionreward.ts:35](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L35)*





___

<a id="contract"></a>

###  contract

**●  contract**:  *`any`* 

*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[contract](extendtrufflecontract.md#contract)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L26)*



The underlying truffle contract object. Use this to access parts of the contract that aren't accessible via the wrapper.




___


## Accessors
<a id="address"></a>

###  address


getaddress(): [Address](../#address)

*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[address](extendtrufflecontract.md#address)*

*Defined in [ExtendTruffleContract.ts:128](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L128)*





**Returns:** [Address](../#address)



___


## Methods
<a id="getbeneficiaryrewards"></a>

###  getBeneficiaryRewards

► **getBeneficiaryRewards**(opts?: *[GetBeneficiaryRewardsParams](../interfaces/getbeneficiaryrewardsparams.md)*): `Promise`.<`Array`.<[ProposalRewards](../interfaces/proposalrewards.md)>>



*Defined in [contracts/contributionreward.ts:352](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L352)*



Return a list of `ProposalRewards` for executed (passed by vote) proposals that have rewards waiting to be redeemed by the given beneficiary. `ProposalRewards` includes both the total amount redeemable and the amount yet-to-be redeemed.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetBeneficiaryRewardsParams](../interfaces/getbeneficiaryrewardsparams.md)  |  {} as GetBeneficiaryRewardsParams |   - |





**Returns:** `Promise`.<`Array`.<[ProposalRewards](../interfaces/proposalrewards.md)>>





___

<a id="getdaoproposals"></a>

###  getDaoProposals

► **getDaoProposals**(opts?: *[GetDaoProposalsConfig](../interfaces/getdaoproposalsconfig.md)*): `Promise`.<`Array`.<[ContributionProposal](../interfaces/contributionproposal.md)>>



*Defined in [contracts/contributionreward.ts:307](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L307)*



Return all ContributionReward proposals ever created under the given avatar. Filter by the optional proposalId.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetDaoProposalsConfig](../interfaces/getdaoproposalsconfig.md)  |  {} as GetDaoProposalsConfig |   - |





**Returns:** `Promise`.<`Array`.<[ContributionProposal](../interfaces/contributionproposal.md)>>





___

<a id="getdefaultpermissions"></a>

###  getDefaultPermissions

► **getDefaultPermissions**(overrideValue?: *`string`*): `string`



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[getDefaultPermissions](extendtrufflecontract.md#getdefaultpermissions)*

*Defined in [contracts/contributionreward.ts:415](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L415)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | `string`   |  - |





**Returns:** `string`





___

<a id="getparameters"></a>

###  getParameters

► **getParameters**(paramsHash: *[Hash](../#hash)*): `Promise`.<[ContributionRewardParamsReturn](../interfaces/contributionrewardparamsreturn.md)>



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[getParameters](extendtrufflecontract.md#getparameters)*

*Defined in [contracts/contributionreward.ts:423](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L423)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#hash)   |  - |





**Returns:** `Promise`.<[ContributionRewardParamsReturn](../interfaces/contributionrewardparamsreturn.md)>





___

<a id="getparametersarray"></a>

###  getParametersArray

► **getParametersArray**(paramsHash: *[Hash](../#hash)*): `Promise`.<`Array`.<`any`>>



*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[getParametersArray](extendtrufflecontract.md#getparametersarray)*

*Defined in [ExtendTruffleContract.ts:124](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L124)*



Given a hash, return the associated parameters as an array, ordered by the order in which the parameters appear in the contract's Parameters struct.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#hash)   |  - |





**Returns:** `Promise`.<`Array`.<`any`>>





___

<a id="getschemeparameters"></a>

###  getSchemeParameters

► **getSchemeParameters**(avatarAddress: *[Address](../#address)*): `Promise`.<[ContributionRewardParamsReturn](../interfaces/contributionrewardparamsreturn.md)>



*Defined in [contracts/contributionreward.ts:419](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L419)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#address)   |  - |





**Returns:** `Promise`.<[ContributionRewardParamsReturn](../interfaces/contributionrewardparamsreturn.md)>





___

<a id="getschemeparametershash"></a>

###  getSchemeParametersHash

► **getSchemeParametersHash**(avatarAddress: *[Address](../#address)*): `Promise`.<[Hash](../#hash)>



*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[getSchemeParametersHash](extendtrufflecontract.md#getschemeparametershash)*

*Defined in [ExtendTruffleContract.ts:114](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L114)*



Given an avatar address, return the schemes parameters hash


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#address)   |  - |





**Returns:** `Promise`.<[Hash](../#hash)>





___

<a id="hydratefromat"></a>

###  hydrateFromAt

► **hydrateFromAt**(address: *`string`*): `Promise`.<`any`>



*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[hydrateFromAt](extendtrufflecontract.md#hydratefromat)*

*Defined in [ExtendTruffleContract.ts:56](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L56)*



Initialize from a given address on the current network.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| address | `string`   |  of the deployed contract |





**Returns:** `Promise`.<`any`>
this






___

<a id="hydratefromdeployed"></a>

###  hydrateFromDeployed

► **hydrateFromDeployed**(): `Promise`.<`any`>



*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[hydrateFromDeployed](extendtrufflecontract.md#hydratefromdeployed)*

*Defined in [ExtendTruffleContract.ts:71](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L71)*



Initialize as it was migrated by Arc.js on the current network.




**Returns:** `Promise`.<`any`>
this






___

<a id="hydratefromnew"></a>

###  hydrateFromNew

► **hydrateFromNew**(...rest: *`Array`.<`any`>*): `Promise`.<`any`>



*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[hydrateFromNew](extendtrufflecontract.md#hydratefromnew)*

*Defined in [ExtendTruffleContract.ts:40](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L40)*



Initialize from a newly-migrated instance. This will migrate a new instance of the contract to the net.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| rest | `Array`.<`any`>   |  - |





**Returns:** `Promise`.<`any`>
this






___

<a id="proposecontributionreward"></a>

###  proposeContributionReward

► **proposeContributionReward**(opts?: *[ProposeContributionRewardParams](../interfaces/proposecontributionrewardparams.md)*): `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>



*Defined in [contracts/contributionreward.ts:45](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L45)*



Submit a proposal for a reward for a contribution


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeContributionRewardParams](../interfaces/proposecontributionrewardparams.md)  |  {} as ProposeContributionRewardParams |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>





___

<a id="redeemcontributionreward"></a>

###  redeemContributionReward

► **redeemContributionReward**(opts?: *[ContributionRewardRedeemParams](../interfaces/contributionrewardredeemparams.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/contributionreward.ts:148](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L148)*



Redeem the specified rewards for the beneficiary of the proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ContributionRewardRedeemParams](../interfaces/contributionrewardredeemparams.md)  |  {} as ContributionRewardRedeemParams |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>





___

<a id="redeemether-1"></a>

###  redeemEther

► **redeemEther**(opts?: *[ContributionRewardSpecifiedRedemptionParams](../interfaces/contributionrewardspecifiedredemptionparams.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/contributionreward.ts:276](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L276)*



Redeem ether reward for the beneficiary of the proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ContributionRewardSpecifiedRedemptionParams](../interfaces/contributionrewardspecifiedredemptionparams.md)  |  {} as ContributionRewardSpecifiedRedemptionParams |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>





___

<a id="redeemexternaltoken-1"></a>

###  redeemExternalToken

► **redeemExternalToken**(opts?: *[ContributionRewardSpecifiedRedemptionParams](../interfaces/contributionrewardspecifiedredemptionparams.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/contributionreward.ts:183](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L183)*



Redeem external token reward for the beneficiary of the proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ContributionRewardSpecifiedRedemptionParams](../interfaces/contributionrewardspecifiedredemptionparams.md)  |  {} as ContributionRewardSpecifiedRedemptionParams |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>





___

<a id="redeemnativetoken-1"></a>

###  redeemNativeToken

► **redeemNativeToken**(opts?: *[ContributionRewardSpecifiedRedemptionParams](../interfaces/contributionrewardspecifiedredemptionparams.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/contributionreward.ts:245](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L245)*



Redeem native token reward for the beneficiary of the proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ContributionRewardSpecifiedRedemptionParams](../interfaces/contributionrewardspecifiedredemptionparams.md)  |  {} as ContributionRewardSpecifiedRedemptionParams |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>





___

<a id="redeemreputation-1"></a>

###  redeemReputation

► **redeemReputation**(opts?: *[ContributionRewardSpecifiedRedemptionParams](../interfaces/contributionrewardspecifiedredemptionparams.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/contributionreward.ts:214](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L214)*



Redeem reputation reward for the beneficiary of the proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ContributionRewardSpecifiedRedemptionParams](../interfaces/contributionrewardspecifiedredemptionparams.md)  |  {} as ContributionRewardSpecifiedRedemptionParams |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>





___

<a id="setparameters"></a>

###  setParameters

► **setParameters**(params: *[ContributionRewardParams](../interfaces/contributionrewardparams.md)*): `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[setParameters](extendtrufflecontract.md#setparameters)*

*Defined in [contracts/contributionreward.ts:400](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/contributionreward.ts#L400)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [ContributionRewardParams](../interfaces/contributionrewardparams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>





___


