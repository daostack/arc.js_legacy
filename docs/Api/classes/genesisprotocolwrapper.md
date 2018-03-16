[API Reference](../README.md) > [GenesisProtocolWrapper](../classes/GenesisProtocolWrapper.md)



# Class: GenesisProtocolWrapper

## Hierarchy


 [ExtendTruffleContract](ExtendTruffleContract.md)

**↳ GenesisProtocolWrapper**







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


### Accessors

* [address](GenesisProtocolWrapper.md#address)


### Methods

* [getController](GenesisProtocolWrapper.md#getController)
* [getDefaultPermissions](GenesisProtocolWrapper.md#getDefaultPermissions)
* [getExecutedDaoProposals](GenesisProtocolWrapper.md#getExecutedDaoProposals)
* [getNumberOfChoices](GenesisProtocolWrapper.md#getNumberOfChoices)
* [getParameters](GenesisProtocolWrapper.md#getParameters)
* [getParametersArray](GenesisProtocolWrapper.md#getParametersArray)
* [getPermissions](GenesisProtocolWrapper.md#getPermissions)
* [getProposalAvatar](GenesisProtocolWrapper.md#getProposalAvatar)
* [getProposalStatus](GenesisProtocolWrapper.md#getProposalStatus)
* [getRedeemableReputationProposer](GenesisProtocolWrapper.md#getRedeemableReputationProposer)
* [getRedeemableReputationStaker](GenesisProtocolWrapper.md#getRedeemableReputationStaker)
* [getRedeemableReputationVoter](GenesisProtocolWrapper.md#getRedeemableReputationVoter)
* [getRedeemableTokensStaker](GenesisProtocolWrapper.md#getRedeemableTokensStaker)
* [getRedeemableTokensVoter](GenesisProtocolWrapper.md#getRedeemableTokensVoter)
* [getSchemeParameters](GenesisProtocolWrapper.md#getSchemeParameters)
* [getSchemeParametersHash](GenesisProtocolWrapper.md#getSchemeParametersHash)
* [getScore](GenesisProtocolWrapper.md#getScore)
* [getScoreThresholdParams](GenesisProtocolWrapper.md#getScoreThresholdParams)
* [getStakerInfo](GenesisProtocolWrapper.md#getStakerInfo)
* [getState](GenesisProtocolWrapper.md#getState)
* [getThreshold](GenesisProtocolWrapper.md#getThreshold)
* [getTotalReputationSupply](GenesisProtocolWrapper.md#getTotalReputationSupply)
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


*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[constructor](ExtendTruffleContract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L26)*



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

*Defined in [contracts/genesisProtocol.ts:40](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L40)*





___

<a id="NewProposal"></a>

###  NewProposal

**●  NewProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[NewProposalEventResult](../interfaces/NewProposalEventResult.md)*  =  this.createEventFetcherFactory<NewProposalEventResult>("NewProposal")

*Defined in [contracts/genesisProtocol.ts:39](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L39)*



Events




___

<a id="Redeem"></a>

###  Redeem

**●  Redeem**:  *[EventFetcherFactory](../#EventFetcherFactory)[RedeemEventResult](../interfaces/RedeemEventResult.md)*  =  this.createEventFetcherFactory<RedeemEventResult>("Redeem")

*Defined in [contracts/genesisProtocol.ts:43](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L43)*





___

<a id="RedeemReputation"></a>

###  RedeemReputation

**●  RedeemReputation**:  *[EventFetcherFactory](../#EventFetcherFactory)[RedeemReputationEventResult](../interfaces/RedeemReputationEventResult.md)*  =  this.createEventFetcherFactory<RedeemReputationEventResult>("RedeemReputation")

*Defined in [contracts/genesisProtocol.ts:44](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L44)*





___

<a id="Stake"></a>

###  Stake

**●  Stake**:  *[EventFetcherFactory](../#EventFetcherFactory)[StakeEventResult](../interfaces/StakeEventResult.md)*  =  this.createEventFetcherFactory<StakeEventResult>("Stake")

*Defined in [contracts/genesisProtocol.ts:42](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L42)*





___

<a id="VoteProposal"></a>

###  VoteProposal

**●  VoteProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[VoteProposalEventResult](../interfaces/VoteProposalEventResult.md)*  =  this.createEventFetcherFactory<VoteProposalEventResult>("VoteProposal")

*Defined in [contracts/genesisProtocol.ts:41](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L41)*





___

<a id="contract"></a>

###  contract

**●  contract**:  *`any`* 

*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[contract](ExtendTruffleContract.md#contract)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L26)*



The underlying truffle contract object. Use this to access parts of the contract that aren't accessible via the wrapper.




___


## Accessors
<a id="address"></a>

###  address


getaddress(): [Address](../#Address)

*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[address](ExtendTruffleContract.md#address)*

*Defined in [ExtendTruffleContract.ts:148](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L148)*





**Returns:** [Address](../#Address)



___


## Methods
<a id="getController"></a>

###  getController

► **getController**(avatarAddress: *[Address](../#Address)*): `Promise`.<`any`>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[getController](ExtendTruffleContract.md#getController)*

*Defined in [ExtendTruffleContract.ts:143](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L143)*



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



*Overrides [ExtendTruffleContract](ExtendTruffleContract.md).[getDefaultPermissions](ExtendTruffleContract.md#getDefaultPermissions)*

*Defined in [contracts/genesisProtocol.ts:919](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L919)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | [SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)   |  - |





**Returns:** [SchemePermissions](../enums/SchemePermissions.md)





___

<a id="getExecutedDaoProposals"></a>

###  getExecutedDaoProposals

► **getExecutedDaoProposals**(opts?: *[GetDaoProposalsConfig](../interfaces/GetDaoProposalsConfig.md)*): `Promise`.<`Array`.<[ExecutedGenesisProposal](../interfaces/ExecutedGenesisProposal.md)>>



*Defined in [contracts/genesisProtocol.ts:829](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L829)*



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



*Defined in [contracts/genesisProtocol.ts:483](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L483)*



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



*Overrides [ExtendTruffleContract](ExtendTruffleContract.md).[getParameters](ExtendTruffleContract.md#getParameters)*

*Defined in [contracts/genesisProtocol.ts:928](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L928)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#Hash)   |  - |





**Returns:** `Promise`.<[GenesisProtocolParams](../interfaces/GenesisProtocolParams.md)>





___

<a id="getParametersArray"></a>

###  getParametersArray

► **getParametersArray**(paramsHash: *[Hash](../#Hash)*): `Promise`.<`Array`.<`any`>>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[getParametersArray](ExtendTruffleContract.md#getParametersArray)*

*Defined in [ExtendTruffleContract.ts:135](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L135)*



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

*Defined in [ExtendTruffleContract.ts:106](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L106)*



Return this scheme's permissions.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[SchemePermissions](../enums/SchemePermissions.md)>





___

<a id="getProposalAvatar"></a>

###  getProposalAvatar

► **getProposalAvatar**(opts?: *[GetProposalAvatarConfig](../interfaces/GetProposalAvatarConfig.md)*): `Promise`.<`string`>



*Defined in [contracts/genesisProtocol.ts:659](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L659)*



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



*Defined in [contracts/genesisProtocol.ts:603](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L603)*



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



*Defined in [contracts/genesisProtocol.ts:361](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L361)*



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



*Defined in [contracts/genesisProtocol.ts:451](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L451)*



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



*Defined in [contracts/genesisProtocol.ts:419](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L419)*



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



*Defined in [contracts/genesisProtocol.ts:330](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L330)*



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



*Defined in [contracts/genesisProtocol.ts:387](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L387)*



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



*Defined in [contracts/genesisProtocol.ts:924](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L924)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[GenesisProtocolParams](../interfaces/GenesisProtocolParams.md)>





___

<a id="getSchemeParametersHash"></a>

###  getSchemeParametersHash

► **getSchemeParametersHash**(avatarAddress: *[Address](../#Address)*): `Promise`.<[Hash](../#Hash)>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[getSchemeParametersHash](ExtendTruffleContract.md#getSchemeParametersHash)*

*Defined in [ExtendTruffleContract.ts:125](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L125)*



Given an avatar address, return the schemes parameters hash


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[Hash](../#Hash)>





___

<a id="getScore"></a>

###  getScore

► **getScore**(opts?: *[GetScoreConfig](../interfaces/GetScoreConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:280](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L280)*



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



*Defined in [contracts/genesisProtocol.ts:685](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L685)*



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



*Defined in [contracts/genesisProtocol.ts:715](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L715)*



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

► **getState**(opts?: *[GetStateConfig](../interfaces/GetStateConfig.md)*): `Promise`.<`number`>



*Defined in [contracts/genesisProtocol.ts:806](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L806)*



Return the current state of a given proposal.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetStateConfig](../interfaces/GetStateConfig.md)  |  {} as GetStateConfig |   - |





**Returns:** `Promise`.<`number`>
Promise<number>






___

<a id="getThreshold"></a>

###  getThreshold

► **getThreshold**(opts?: *[GetThresholdConfig](../interfaces/GetThresholdConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:305](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L305)*



Return the DAO's score threshold that is required by a proposal to it shift to boosted state.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetThresholdConfig](../interfaces/GetThresholdConfig.md)  |  {} as GetThresholdConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getTotalReputationSupply"></a>

###  getTotalReputationSupply

► **getTotalReputationSupply**(opts?: *[GetTotalReputationSupplyConfig](../interfaces/GetTotalReputationSupplyConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:633](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L633)*



Return the total reputation supply for a given proposal.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetTotalReputationSupplyConfig](../interfaces/GetTotalReputationSupplyConfig.md)  |  {} as GetTotalReputationSupplyConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getVoteStake"></a>

###  getVoteStake

► **getVoteStake**(opts?: *[GetVoteStakeConfig](../interfaces/GetVoteStakeConfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:750](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L750)*



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



*Defined in [contracts/genesisProtocol.ts:544](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L544)*



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



*Defined in [contracts/genesisProtocol.ts:509](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L509)*



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



*Defined in [contracts/genesisProtocol.ts:780](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L780)*



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



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[hydrateFromAt](ExtendTruffleContract.md#hydrateFromAt)*

*Defined in [ExtendTruffleContract.ts:56](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L56)*



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

*Defined in [ExtendTruffleContract.ts:71](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L71)*



Initialize as it was migrated by Arc.js on the current network.




**Returns:** `Promise`.<`any`>
this






___

<a id="hydrateFromNew"></a>

###  hydrateFromNew

► **hydrateFromNew**(...rest: *`Array`.<`any`>*): `Promise`.<`any`>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[hydrateFromNew](ExtendTruffleContract.md#hydrateFromNew)*

*Defined in [ExtendTruffleContract.ts:40](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L40)*



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



*Defined in [contracts/genesisProtocol.ts:577](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L577)*



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



*Defined in [contracts/genesisProtocol.ts:52](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L52)*



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



*Defined in [contracts/genesisProtocol.ts:226](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L226)*



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



*Overrides [ExtendTruffleContract](ExtendTruffleContract.md).[setParameters](ExtendTruffleContract.md#setParameters)*

*Defined in [contracts/genesisProtocol.ts:872](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L872)*



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



*Defined in [contracts/genesisProtocol.ts:256](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L256)*



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



*Defined in [contracts/genesisProtocol.ts:107](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L107)*



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



*Defined in [contracts/genesisProtocol.ts:159](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L159)*



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



*Defined in [contracts/genesisProtocol.ts:190](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L190)*



Vote on a proposal, staking some reputation that the final outcome will match this vote. Reputation of 0 will stake all the voter's reputation.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [VoteWithSpecifiedAmountsConfig](../interfaces/VoteWithSpecifiedAmountsConfig.md)  |  {} as VoteWithSpecifiedAmountsConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>
Promise<ArcTransactionResult>






___


