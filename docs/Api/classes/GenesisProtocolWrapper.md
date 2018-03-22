[API Reference](../README.md) > [GenesisProtocolWrapper](../classes/GenesisProtocolWrapper.md)



# Class: GenesisProtocolWrapper

## Hierarchy


 [ContractWrapperBase](ContractWrapperBase.md)

**↳ GenesisProtocolWrapper**







## Implements

* [SchemeWrapper](../interfaces/SchemeWrapper.md)

## Index

### Constructors

* [constructor](GenesisProtocolWrapper.md#constructor)


### Properties

* [ExecuteProposal](GenesisProtocolWrapper.md#ExecuteProposal)
* [NewProposal](GenesisProtocolWrapper.md#NewProposal)
* [Redeem](GenesisProtocolWrapper.md#Redeem)
* [RedeemReputation](GenesisProtocolWrapper.md#RedeemReputation)
* [Stake](GenesisProtocolWrapper.md#Stake)
* [VoteProposal](GenesisProtocolWrapper.md#VoteProposal)
* [contract](GenesisProtocolWrapper.md#contract)
* [frendlyName](GenesisProtocolWrapper.md#frendlyName)
* [name](GenesisProtocolWrapper.md#name)


### Accessors

* [address](GenesisProtocolWrapper.md#address)


### Methods

* [getController](GenesisProtocolWrapper.md#getController)
* [getDefaultPermissions](GenesisProtocolWrapper.md#getDefaultPermissions)
* [getExecutedDaoProposals](GenesisProtocolWrapper.md#getExecutedDaoProposals)
* [getNumberOfChoices](GenesisProtocolWrapper.md#getNumberOfChoices)
* [getParameters](GenesisProtocolWrapper.md#getParameters)
* [getParametersArray](GenesisProtocolWrapper.md#getParametersArray)
* [getProposalAvatar](GenesisProtocolWrapper.md#getProposalAvatar)
* [getProposalStatus](GenesisProtocolWrapper.md#getProposalStatus)
* [getRedeemableReputationProposer](GenesisProtocolWrapper.md#getRedeemableReputationProposer)
* [getRedeemableReputationStaker](GenesisProtocolWrapper.md#getRedeemableReputationStaker)
* [getRedeemableReputationVoter](GenesisProtocolWrapper.md#getRedeemableReputationVoter)
* [getRedeemableTokensStaker](GenesisProtocolWrapper.md#getRedeemableTokensStaker)
* [getRedeemableTokensVoter](GenesisProtocolWrapper.md#getRedeemableTokensVoter)
* [getSchemeParameters](GenesisProtocolWrapper.md#getSchemeParameters)
* [getSchemeParametersHash](GenesisProtocolWrapper.md#getSchemeParametersHash)
* [getSchemePermissions](GenesisProtocolWrapper.md#getSchemePermissions)
* [getScore](GenesisProtocolWrapper.md#getScore)
* [getScoreThresholdParams](GenesisProtocolWrapper.md#getScoreThresholdParams)
* [getStakerInfo](GenesisProtocolWrapper.md#getStakerInfo)
* [getState](GenesisProtocolWrapper.md#getState)
* [getThreshold](GenesisProtocolWrapper.md#getThreshold)
* [getVoteStake](GenesisProtocolWrapper.md#getVoteStake)
* [getVoteStatus](GenesisProtocolWrapper.md#getVoteStatus)
* [getVoterInfo](GenesisProtocolWrapper.md#getVoterInfo)
* [getWinningVote](GenesisProtocolWrapper.md#getWinningVote)
* [hydrateFromAt](GenesisProtocolWrapper.md#hydrateFromAt)
* [hydrateFromDeployed](GenesisProtocolWrapper.md#hydrateFromDeployed)
* [hydrateFromNew](GenesisProtocolWrapper.md#hydrateFromNew)
* [isVotable](GenesisProtocolWrapper.md#isVotable)
* [propose](GenesisProtocolWrapper.md#propose)
* [redeem](GenesisProtocolWrapper.md#redeem)
* [setParameters](GenesisProtocolWrapper.md#setParameters)
* [shouldBoost](GenesisProtocolWrapper.md#shouldBoost)
* [stake](GenesisProtocolWrapper.md#stake)
* [vote](GenesisProtocolWrapper.md#vote)
* [voteWithSpecifiedAmounts](GenesisProtocolWrapper.md#voteWithSpecifiedAmounts)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new GenesisProtocolWrapper**(solidityContract: *`any`*): [GenesisProtocolWrapper](GenesisProtocolWrapper.md)


*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[constructor](ContractWrapperBase.md#constructor)*

*Defined in [contractWrapperBase.ts:37](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L37)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [GenesisProtocolWrapper](GenesisProtocolWrapper.md)

---


## Properties
<a id="ExecuteProposal"></a>

###  ExecuteProposal

**●  ExecuteProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[GenesisProtocolExecuteProposalEventResult](../interfaces/GenesisProtocolExecuteProposalEventResult.md)*  =  this.createEventFetcherFactory<GenesisProtocolExecuteProposalEventResult>("ExecuteProposal")

*Defined in [wrappers/genesisProtocol.ts:43](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L43)*





___

<a id="NewProposal"></a>

###  NewProposal

**●  NewProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[NewProposalEventResult](../interfaces/NewProposalEventResult.md)*  =  this.createEventFetcherFactory<NewProposalEventResult>("NewProposal")

*Defined in [wrappers/genesisProtocol.ts:42](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L42)*



Events




___

<a id="Redeem"></a>

###  Redeem

**●  Redeem**:  *[EventFetcherFactory](../#EventFetcherFactory)[RedeemEventResult](../interfaces/RedeemEventResult.md)*  =  this.createEventFetcherFactory<RedeemEventResult>("Redeem")

*Defined in [wrappers/genesisProtocol.ts:46](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L46)*





___

<a id="RedeemReputation"></a>

###  RedeemReputation

**●  RedeemReputation**:  *[EventFetcherFactory](../#EventFetcherFactory)[RedeemReputationEventResult](../interfaces/RedeemReputationEventResult.md)*  =  this.createEventFetcherFactory<RedeemReputationEventResult>("RedeemReputation")

*Defined in [wrappers/genesisProtocol.ts:47](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L47)*





___

<a id="Stake"></a>

###  Stake

**●  Stake**:  *[EventFetcherFactory](../#EventFetcherFactory)[StakeEventResult](../interfaces/StakeEventResult.md)*  =  this.createEventFetcherFactory<StakeEventResult>("Stake")

*Defined in [wrappers/genesisProtocol.ts:45](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L45)*





___

<a id="VoteProposal"></a>

###  VoteProposal

**●  VoteProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[VoteProposalEventResult](../interfaces/VoteProposalEventResult.md)*  =  this.createEventFetcherFactory<VoteProposalEventResult>("VoteProposal")

*Defined in [wrappers/genesisProtocol.ts:44](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L44)*





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

**●  frendlyName**:  *`string`*  = "Genesis Protocol"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[frendlyName](ContractWrapperBase.md#frendlyName)*

*Defined in [wrappers/genesisProtocol.ts:36](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L36)*





___

<a id="name"></a>

###  name

**●  name**:  *`string`*  = "GenesisProtocol"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[name](ContractWrapperBase.md#name)*

*Defined in [wrappers/genesisProtocol.ts:35](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L35)*





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

<a id="getDefaultPermissions"></a>

###  getDefaultPermissions

► **getDefaultPermissions**(overrideValue?: *[SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)*): [SchemePermissions](../enums/SchemePermissions.md)



*Implementation of [SchemeWrapper](../interfaces/SchemeWrapper.md).[getDefaultPermissions](../interfaces/SchemeWrapper.md#getDefaultPermissions)*

*Defined in [wrappers/genesisProtocol.ts:896](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L896)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | [SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)   |  - |





**Returns:** [SchemePermissions](../enums/SchemePermissions.md)





___

<a id="getExecutedDaoProposals"></a>

###  getExecutedDaoProposals

► **getExecutedDaoProposals**(opts?: *[GetDaoProposalsConfig](../interfaces/GetDaoProposalsConfig.md)*): `Promise`.<`Array`.<[ExecutedGenesisProposal](../interfaces/ExecutedGenesisProposal.md)>>



*Defined in [wrappers/genesisProtocol.ts:808](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L808)*



Return all executed GenesisProtocol proposals created under the given avatar. Filter by the optional proposalId.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetDaoProposalsConfig](../interfaces/GetDaoProposalsConfig.md)  |  {} as GetDaoProposalsConfig |   - |





**Returns:** `Promise`.<`Array`.<[ExecutedGenesisProposal](../interfaces/ExecutedGenesisProposal.md)>>





___

<a id="getNumberOfChoices"></a>

###  getNumberOfChoices

► **getNumberOfChoices**(opts?: *[GetNumberOfChoicesConfig](../interfaces/GetNumberOfChoicesConfig.md)*): `Promise`.<`number`>



*Defined in [wrappers/genesisProtocol.ts:487](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L487)*



Return the number of possible choices when voting for the proposal.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetNumberOfChoicesConfig](../interfaces/GetNumberOfChoicesConfig.md)  |  {} as GetNumberOfChoicesConfig |   - |





**Returns:** `Promise`.<`number`>
Promise<number>






___

<a id="getParameters"></a>

###  getParameters

► **getParameters**(paramsHash: *[Hash](../#Hash)*): `Promise`.<[GenesisProtocolParams](../interfaces/GenesisProtocolParams.md)>



*Overrides [ContractWrapperBase](ContractWrapperBase.md).[getParameters](ContractWrapperBase.md#getParameters)*

*Defined in [wrappers/genesisProtocol.ts:909](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L909)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#Hash)   |  - |





**Returns:** `Promise`.<[GenesisProtocolParams](../interfaces/GenesisProtocolParams.md)>





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

<a id="getProposalAvatar"></a>

###  getProposalAvatar

► **getProposalAvatar**(opts?: *[GetProposalAvatarConfig](../interfaces/GetProposalAvatarConfig.md)*): `Promise`.<`string`>



*Defined in [wrappers/genesisProtocol.ts:638](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L638)*



Return the DAO avatar address under which the proposal was made


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetProposalAvatarConfig](../interfaces/GetProposalAvatarConfig.md)  |  {} as GetProposalAvatarConfig |   - |





**Returns:** `Promise`.<`string`>
Promise<string>






___

<a id="getProposalStatus"></a>

###  getProposalStatus

► **getProposalStatus**(opts?: *[GetProposalStatusConfig](../interfaces/GetProposalStatusConfig.md)*): `Promise`.<[GetProposalStatusResult](../interfaces/GetProposalStatusResult.md)>



*Defined in [wrappers/genesisProtocol.ts:607](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L607)*



Return the total votes, total stakes and voter stakes for a given proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetProposalStatusConfig](../interfaces/GetProposalStatusConfig.md)  |  {} as GetProposalStatusConfig |   - |





**Returns:** `Promise`.<[GetProposalStatusResult](../interfaces/GetProposalStatusResult.md)>
Promise<GetProposalStatusResult>






___

<a id="getRedeemableReputationProposer"></a>

###  getRedeemableReputationProposer

► **getRedeemableReputationProposer**(opts?: *[GetRedeemableReputationProposerConfig](../interfaces/GetRedeemableReputationProposerConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [wrappers/genesisProtocol.ts:365](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L365)*



Return the reputation amount to which the proposal proposer is entitled in the event that the proposal is approved.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetRedeemableReputationProposerConfig](../interfaces/GetRedeemableReputationProposerConfig.md)  |  {} as GetRedeemableReputationProposerConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getRedeemableReputationStaker"></a>

###  getRedeemableReputationStaker

► **getRedeemableReputationStaker**(opts?: *[GetRedeemableReputationStakerConfig](../interfaces/GetRedeemableReputationStakerConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [wrappers/genesisProtocol.ts:455](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L455)*



Return the reputation amount to which the staker is entitled in the event that the proposal is approved.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetRedeemableReputationStakerConfig](../interfaces/GetRedeemableReputationStakerConfig.md)  |  {} as GetRedeemableReputationStakerConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getRedeemableReputationVoter"></a>

###  getRedeemableReputationVoter

► **getRedeemableReputationVoter**(opts?: *[GetRedeemableReputationVoterConfig](../interfaces/GetRedeemableReputationVoterConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [wrappers/genesisProtocol.ts:423](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L423)*



Return the reputation amount to which the voter is entitled in the event that the proposal is approved.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetRedeemableReputationVoterConfig](../interfaces/GetRedeemableReputationVoterConfig.md)  |  {} as GetRedeemableReputationVoterConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getRedeemableTokensStaker"></a>

###  getRedeemableTokensStaker

► **getRedeemableTokensStaker**(opts?: *[GetRedeemableTokensStakerConfig](../interfaces/GetRedeemableTokensStakerConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [wrappers/genesisProtocol.ts:334](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L334)*



Return the token amount to which the given staker is entitled in the event that the proposal is approved.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetRedeemableTokensStakerConfig](../interfaces/GetRedeemableTokensStakerConfig.md)  |  {} as GetRedeemableTokensStakerConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getRedeemableTokensVoter"></a>

###  getRedeemableTokensVoter

► **getRedeemableTokensVoter**(opts?: *[GetRedeemableTokensVoterConfig](../interfaces/GetRedeemableTokensVoterConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [wrappers/genesisProtocol.ts:391](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L391)*



Return the token amount to which the voter is entitled in the event that the proposal is approved.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetRedeemableTokensVoterConfig](../interfaces/GetRedeemableTokensVoterConfig.md)  |  {} as GetRedeemableTokensVoterConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getSchemeParameters"></a>

###  getSchemeParameters

► **getSchemeParameters**(avatarAddress: *[Address](../#Address)*): `Promise`.<[GenesisProtocolParams](../interfaces/GenesisProtocolParams.md)>



*Implementation of [SchemeWrapper](../interfaces/SchemeWrapper.md).[getSchemeParameters](../interfaces/SchemeWrapper.md#getSchemeParameters)*

*Defined in [wrappers/genesisProtocol.ts:905](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L905)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[GenesisProtocolParams](../interfaces/GenesisProtocolParams.md)>





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



*Implementation of [SchemeWrapper](../interfaces/SchemeWrapper.md).[getSchemePermissions](../interfaces/SchemeWrapper.md#getSchemePermissions)*

*Defined in [wrappers/genesisProtocol.ts:901](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L901)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[SchemePermissions](../enums/SchemePermissions.md)>





___

<a id="getScore"></a>

###  getScore

► **getScore**(opts?: *[GetScoreConfig](../interfaces/GetScoreConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [wrappers/genesisProtocol.ts:278](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L278)*



Return the current proposal score.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetScoreConfig](../interfaces/GetScoreConfig.md)  |  {} as GetScoreConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getScoreThresholdParams"></a>

###  getScoreThresholdParams

► **getScoreThresholdParams**(opts?: *[GetScoreThresholdParamsConfig](../interfaces/GetScoreThresholdParamsConfig.md)*): `Promise`.<[GetScoreThresholdParamsResult](../interfaces/GetScoreThresholdParamsResult.md)>



*Defined in [wrappers/genesisProtocol.ts:664](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L664)*



Return the score threshold params for the given DAO.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetScoreThresholdParamsConfig](../interfaces/GetScoreThresholdParamsConfig.md)  |  {} as GetScoreThresholdParamsConfig |   - |





**Returns:** `Promise`.<[GetScoreThresholdParamsResult](../interfaces/GetScoreThresholdParamsResult.md)>
Promise<GetScoreThresholdParamsResult>






___

<a id="getStakerInfo"></a>

###  getStakerInfo

► **getStakerInfo**(opts?: *[GetStakerInfoConfig](../interfaces/GetStakerInfoConfig.md)*): `Promise`.<[GetStakerInfoResult](../interfaces/GetStakerInfoResult.md)>



*Defined in [wrappers/genesisProtocol.ts:694](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L694)*



Return the vote and stake amount for a given proposal and staker.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetStakerInfoConfig](../interfaces/GetStakerInfoConfig.md)  |  {} as GetStakerInfoConfig |   - |





**Returns:** `Promise`.<[GetStakerInfoResult](../interfaces/GetStakerInfoResult.md)>
Promise<GetStakerInfoResult>






___

<a id="getState"></a>

###  getState

► **getState**(opts?: *[GetStateConfig](../interfaces/GetStateConfig.md)*): `Promise`.<[ProposalState](../enums/ProposalState.md)>



*Defined in [wrappers/genesisProtocol.ts:785](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L785)*



Return the current state of a given proposal.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetStateConfig](../interfaces/GetStateConfig.md)  |  {} as GetStateConfig |   - |





**Returns:** `Promise`.<[ProposalState](../enums/ProposalState.md)>
Promise<number>






___

<a id="getThreshold"></a>

###  getThreshold

► **getThreshold**(opts?: *[GetThresholdConfig](../interfaces/GetThresholdConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [wrappers/genesisProtocol.ts:303](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L303)*



Return the DAO's score threshold that is required by a proposal to it shift to boosted state.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetThresholdConfig](../interfaces/GetThresholdConfig.md)  |  {} as GetThresholdConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getVoteStake"></a>

###  getVoteStake

► **getVoteStake**(opts?: *[GetVoteStakeConfig](../interfaces/GetVoteStakeConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [wrappers/genesisProtocol.ts:729](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L729)*



Return the amount stakes behind a given proposal and vote.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetVoteStakeConfig](../interfaces/GetVoteStakeConfig.md)  |  {} as GetVoteStakeConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getVoteStatus"></a>

###  getVoteStatus

► **getVoteStatus**(opts?: *[GetVoteStatusConfig](../interfaces/GetVoteStatusConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [wrappers/genesisProtocol.ts:548](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L548)*



Returns the reputation currently voted on the given choice.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetVoteStatusConfig](../interfaces/GetVoteStatusConfig.md)  |  {} as GetVoteStatusConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getVoterInfo"></a>

###  getVoterInfo

► **getVoterInfo**(opts?: *[GetVoterInfoConfig](../interfaces/GetVoterInfoConfig.md)*): `Promise`.<[GetVoterInfoResult](../interfaces/GetVoterInfoResult.md)>



*Defined in [wrappers/genesisProtocol.ts:513](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L513)*



Return the vote and the amount of reputation of the voter committed to this proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetVoterInfoConfig](../interfaces/GetVoterInfoConfig.md)  |  {} as GetVoterInfoConfig |   - |





**Returns:** `Promise`.<[GetVoterInfoResult](../interfaces/GetVoterInfoResult.md)>
Promise<GetVoterInfoResult>






___

<a id="getWinningVote"></a>

###  getWinningVote

► **getWinningVote**(opts?: *[GetWinningVoteConfig](../interfaces/GetWinningVoteConfig.md)*): `Promise`.<`number`>



*Defined in [wrappers/genesisProtocol.ts:759](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L759)*



Return the winningVote for a given proposal.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetWinningVoteConfig](../interfaces/GetWinningVoteConfig.md)  |  {} as GetWinningVoteConfig |   - |





**Returns:** `Promise`.<`number`>
Promise<number>






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

<a id="isVotable"></a>

###  isVotable

► **isVotable**(opts?: *[IsVotableConfig](../interfaces/IsVotableConfig.md)*): `Promise`.<`boolean`>



*Defined in [wrappers/genesisProtocol.ts:581](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L581)*



Return whether the proposal is in a votable state.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [IsVotableConfig](../interfaces/IsVotableConfig.md)  |  {} as IsVotableConfig |   - |





**Returns:** `Promise`.<`boolean`>
Promise<boolean>






___

<a id="propose"></a>

###  propose

► **propose**(opts?: *[ProposeVoteConfig](../interfaces/ProposeVoteConfig.md)*): `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>



*Defined in [wrappers/genesisProtocol.ts:55](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L55)*



Create a proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeVoteConfig](../interfaces/ProposeVoteConfig.md)  |  {} as ProposeVoteConfig |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>
Promise<ArcTransactionProposalResult>






___

<a id="redeem"></a>

###  redeem

► **redeem**(opts?: *[RedeemConfig](../interfaces/RedeemConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/genesisProtocol.ts:224](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L224)*



Redeem any tokens and reputation that are due the beneficiary from the outcome of the proposal.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [RedeemConfig](../interfaces/RedeemConfig.md)  |  {} as RedeemConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>
Promise<ArcTransactionResult>






___

<a id="setParameters"></a>

###  setParameters

► **setParameters**(params: *[GenesisProtocolParams](../interfaces/GenesisProtocolParams.md)*): `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>



*Overrides [ContractWrapperBase](ContractWrapperBase.md).[setParameters](ContractWrapperBase.md#setParameters)*

*Defined in [wrappers/genesisProtocol.ts:851](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L851)*



Set the contract parameters.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [GenesisProtocolParams](../interfaces/GenesisProtocolParams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>
parameters hash






___

<a id="shouldBoost"></a>

###  shouldBoost

► **shouldBoost**(opts?: *[ShouldBoostConfig](../interfaces/ShouldBoostConfig.md)*): `Promise`.<`boolean`>



*Defined in [wrappers/genesisProtocol.ts:254](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L254)*



Return whether a proposal should be shifted to the boosted phase.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ShouldBoostConfig](../interfaces/ShouldBoostConfig.md)  |  {} as ShouldBoostConfig |   - |





**Returns:** `Promise`.<`boolean`>
Promise<boolean>






___

<a id="stake"></a>

###  stake

► **stake**(opts?: *[StakeConfig](../interfaces/StakeConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/genesisProtocol.ts:105](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L105)*



Stake some tokens on the final outcome matching this vote.

A transfer of tokens from the staker to this GenesisProtocol scheme is automatically approved and executed on the token with which this GenesisProtocol scheme was deployed.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [StakeConfig](../interfaces/StakeConfig.md)  |  {} as StakeConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>
Promise<ArcTransactionResult>






___

<a id="vote"></a>

###  vote

► **vote**(opts?: *[VoteConfig](../interfaces/VoteConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/genesisProtocol.ts:157](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L157)*



Vote on a proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [VoteConfig](../interfaces/VoteConfig.md)  |  {} as VoteConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>
Promise<ArcTransactionResult>






___

<a id="voteWithSpecifiedAmounts"></a>

###  voteWithSpecifiedAmounts

► **voteWithSpecifiedAmounts**(opts?: *[VoteWithSpecifiedAmountsConfig](../interfaces/VoteWithSpecifiedAmountsConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/genesisProtocol.ts:188](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L188)*



Vote on a proposal, staking some reputation that the final outcome will match this vote. Reputation of 0 will stake all the voter's reputation.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [VoteWithSpecifiedAmountsConfig](../interfaces/VoteWithSpecifiedAmountsConfig.md)  |  {} as VoteWithSpecifiedAmountsConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>
Promise<ArcTransactionResult>






___


