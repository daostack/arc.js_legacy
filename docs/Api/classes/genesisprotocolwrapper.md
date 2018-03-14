[@DAOstack/Arc.js API Reference](../README.md) > [GenesisProtocolWrapper](../classes/genesisprotocolwrapper.md)



# Class: GenesisProtocolWrapper

## Hierarchy


 [ExtendTruffleContract](extendtrufflecontract.md)

**↳ GenesisProtocolWrapper**







## Index

### Constructors

* [constructor](genesisprotocolwrapper.md#constructor)


### Properties

* [ExecuteProposal](genesisprotocolwrapper.md#executeproposal)
* [NewProposal](genesisprotocolwrapper.md#newproposal)
* [Redeem](genesisprotocolwrapper.md#redeem)
* [RedeemReputation](genesisprotocolwrapper.md#redeemreputation)
* [Stake](genesisprotocolwrapper.md#stake)
* [VoteProposal](genesisprotocolwrapper.md#voteproposal)
* [contract](genesisprotocolwrapper.md#contract)


### Accessors

* [address](genesisprotocolwrapper.md#address)


### Methods

* [getDefaultPermissions](genesisprotocolwrapper.md#getdefaultpermissions)
* [getExecutedDaoProposals](genesisprotocolwrapper.md#getexecuteddaoproposals)
* [getNumberOfChoices](genesisprotocolwrapper.md#getnumberofchoices)
* [getParameters](genesisprotocolwrapper.md#getparameters)
* [getParametersArray](genesisprotocolwrapper.md#getparametersarray)
* [getProposalAvatar](genesisprotocolwrapper.md#getproposalavatar)
* [getProposalStatus](genesisprotocolwrapper.md#getproposalstatus)
* [getRedeemableReputationProposer](genesisprotocolwrapper.md#getredeemablereputationproposer)
* [getRedeemableReputationStaker](genesisprotocolwrapper.md#getredeemablereputationstaker)
* [getRedeemableReputationVoter](genesisprotocolwrapper.md#getredeemablereputationvoter)
* [getRedeemableTokensStaker](genesisprotocolwrapper.md#getredeemabletokensstaker)
* [getRedeemableTokensVoter](genesisprotocolwrapper.md#getredeemabletokensvoter)
* [getSchemeParameters](genesisprotocolwrapper.md#getschemeparameters)
* [getSchemeParametersHash](genesisprotocolwrapper.md#getschemeparametershash)
* [getScore](genesisprotocolwrapper.md#getscore)
* [getScoreThresholdParams](genesisprotocolwrapper.md#getscorethresholdparams)
* [getStakerInfo](genesisprotocolwrapper.md#getstakerinfo)
* [getState](genesisprotocolwrapper.md#getstate)
* [getThreshold](genesisprotocolwrapper.md#getthreshold)
* [getTotalReputationSupply](genesisprotocolwrapper.md#gettotalreputationsupply)
* [getVoteStake](genesisprotocolwrapper.md#getvotestake)
* [getVoteStatus](genesisprotocolwrapper.md#getvotestatus)
* [getVoterInfo](genesisprotocolwrapper.md#getvoterinfo)
* [getWinningVote](genesisprotocolwrapper.md#getwinningvote)
* [hydrateFromAt](genesisprotocolwrapper.md#hydratefromat)
* [hydrateFromDeployed](genesisprotocolwrapper.md#hydratefromdeployed)
* [hydrateFromNew](genesisprotocolwrapper.md#hydratefromnew)
* [isVotable](genesisprotocolwrapper.md#isvotable)
* [propose](genesisprotocolwrapper.md#propose)
* [redeem](genesisprotocolwrapper.md#redeem-1)
* [setParameters](genesisprotocolwrapper.md#setparameters)
* [shouldBoost](genesisprotocolwrapper.md#shouldboost)
* [stake](genesisprotocolwrapper.md#stake-1)
* [vote](genesisprotocolwrapper.md#vote)
* [voteWithSpecifiedAmounts](genesisprotocolwrapper.md#votewithspecifiedamounts)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new GenesisProtocolWrapper**(solidityContract: *`any`*): [GenesisProtocolWrapper](genesisprotocolwrapper.md)


*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[constructor](extendtrufflecontract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [GenesisProtocolWrapper](genesisprotocolwrapper.md)

---


## Properties
<a id="executeproposal"></a>

###  ExecuteProposal

**●  ExecuteProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[GenesisProtocolExecuteProposalEventResult](../interfaces/genesisprotocolexecuteproposaleventresult.md)*  =  this.createEventFetcherFactory<GenesisProtocolExecuteProposalEventResult>("ExecuteProposal")

*Defined in [contracts/genesisProtocol.ts:31](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L31)*





___

<a id="newproposal"></a>

###  NewProposal

**●  NewProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[NewProposalEventResult](../interfaces/newproposaleventresult.md)*  =  this.createEventFetcherFactory<NewProposalEventResult>("NewProposal")

*Defined in [contracts/genesisProtocol.ts:30](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L30)*



Events




___

<a id="redeem"></a>

###  Redeem

**●  Redeem**:  *[EventFetcherFactory](../#eventfetcherfactory)[RedeemEventResult](../interfaces/redeemeventresult.md)*  =  this.createEventFetcherFactory<RedeemEventResult>("Redeem")

*Defined in [contracts/genesisProtocol.ts:34](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L34)*





___

<a id="redeemreputation"></a>

###  RedeemReputation

**●  RedeemReputation**:  *[EventFetcherFactory](../#eventfetcherfactory)[RedeemReputationEventResult](../interfaces/redeemreputationeventresult.md)*  =  this.createEventFetcherFactory<RedeemReputationEventResult>("RedeemReputation")

*Defined in [contracts/genesisProtocol.ts:35](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L35)*





___

<a id="stake"></a>

###  Stake

**●  Stake**:  *[EventFetcherFactory](../#eventfetcherfactory)[StakeEventResult](../interfaces/stakeeventresult.md)*  =  this.createEventFetcherFactory<StakeEventResult>("Stake")

*Defined in [contracts/genesisProtocol.ts:33](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L33)*





___

<a id="voteproposal"></a>

###  VoteProposal

**●  VoteProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[VoteProposalEventResult](../interfaces/voteproposaleventresult.md)*  =  this.createEventFetcherFactory<VoteProposalEventResult>("VoteProposal")

*Defined in [contracts/genesisProtocol.ts:32](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L32)*





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
<a id="getdefaultpermissions"></a>

###  getDefaultPermissions

► **getDefaultPermissions**(overrideValue?: *`string`*): `string`



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[getDefaultPermissions](extendtrufflecontract.md#getdefaultpermissions)*

*Defined in [contracts/genesisProtocol.ts:910](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L910)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | `string`   |  - |





**Returns:** `string`





___

<a id="getexecuteddaoproposals"></a>

###  getExecutedDaoProposals

► **getExecutedDaoProposals**(opts?: *[GetDaoProposalsConfig](../interfaces/getdaoproposalsconfig.md)*): `Promise`.<`Array`.<[ExecutedGenesisProposal](../interfaces/executedgenesisproposal.md)>>



*Defined in [contracts/genesisProtocol.ts:820](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L820)*



Return all executed GenesisProtocol proposals created under the given avatar. Filter by the optional proposalId.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetDaoProposalsConfig](../interfaces/getdaoproposalsconfig.md)  |  {} as GetDaoProposalsConfig |   - |





**Returns:** `Promise`.<`Array`.<[ExecutedGenesisProposal](../interfaces/executedgenesisproposal.md)>>





___

<a id="getnumberofchoices"></a>

###  getNumberOfChoices

► **getNumberOfChoices**(opts?: *[GetNumberOfChoicesConfig](../interfaces/getnumberofchoicesconfig.md)*): `Promise`.<`number`>



*Defined in [contracts/genesisProtocol.ts:474](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L474)*



Return the number of possible choices when voting for the proposal.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetNumberOfChoicesConfig](../interfaces/getnumberofchoicesconfig.md)  |  {} as GetNumberOfChoicesConfig |   - |





**Returns:** `Promise`.<`number`>
Promise<number>






___

<a id="getparameters"></a>

###  getParameters

► **getParameters**(paramsHash: *[Hash](../#hash)*): `Promise`.<[GenesisProtocolParams](../interfaces/genesisprotocolparams.md)>



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[getParameters](extendtrufflecontract.md#getparameters)*

*Defined in [contracts/genesisProtocol.ts:918](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L918)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#hash)   |  - |





**Returns:** `Promise`.<[GenesisProtocolParams](../interfaces/genesisprotocolparams.md)>





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

<a id="getproposalavatar"></a>

###  getProposalAvatar

► **getProposalAvatar**(opts?: *[GetProposalAvatarConfig](../interfaces/getproposalavatarconfig.md)*): `Promise`.<`string`>



*Defined in [contracts/genesisProtocol.ts:650](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L650)*



Return the DAO avatar address under which the proposal was made


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetProposalAvatarConfig](../interfaces/getproposalavatarconfig.md)  |  {} as GetProposalAvatarConfig |   - |





**Returns:** `Promise`.<`string`>
Promise<string>






___

<a id="getproposalstatus"></a>

###  getProposalStatus

► **getProposalStatus**(opts?: *[GetProposalStatusConfig](../interfaces/getproposalstatusconfig.md)*): `Promise`.<[GetProposalStatusResult](../interfaces/getproposalstatusresult.md)>



*Defined in [contracts/genesisProtocol.ts:594](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L594)*



Return the total votes, total stakes and voter stakes for a given proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetProposalStatusConfig](../interfaces/getproposalstatusconfig.md)  |  {} as GetProposalStatusConfig |   - |





**Returns:** `Promise`.<[GetProposalStatusResult](../interfaces/getproposalstatusresult.md)>
Promise<GetProposalStatusResult>






___

<a id="getredeemablereputationproposer"></a>

###  getRedeemableReputationProposer

► **getRedeemableReputationProposer**(opts?: *[GetRedeemableReputationProposerConfig](../interfaces/getredeemablereputationproposerconfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:352](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L352)*



Return the reputation amount to which the proposal proposer is entitled in the event that the proposal is approved.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetRedeemableReputationProposerConfig](../interfaces/getredeemablereputationproposerconfig.md)  |  {} as GetRedeemableReputationProposerConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getredeemablereputationstaker"></a>

###  getRedeemableReputationStaker

► **getRedeemableReputationStaker**(opts?: *[GetRedeemableReputationStakerConfig](../interfaces/getredeemablereputationstakerconfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:442](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L442)*



Return the reputation amount to which the staker is entitled in the event that the proposal is approved.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetRedeemableReputationStakerConfig](../interfaces/getredeemablereputationstakerconfig.md)  |  {} as GetRedeemableReputationStakerConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getredeemablereputationvoter"></a>

###  getRedeemableReputationVoter

► **getRedeemableReputationVoter**(opts?: *[GetRedeemableReputationVoterConfig](../interfaces/getredeemablereputationvoterconfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:410](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L410)*



Return the reputation amount to which the voter is entitled in the event that the proposal is approved.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetRedeemableReputationVoterConfig](../interfaces/getredeemablereputationvoterconfig.md)  |  {} as GetRedeemableReputationVoterConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getredeemabletokensstaker"></a>

###  getRedeemableTokensStaker

► **getRedeemableTokensStaker**(opts?: *[GetRedeemableTokensStakerConfig](../interfaces/getredeemabletokensstakerconfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:321](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L321)*



Return the token amount to which the given staker is entitled in the event that the proposal is approved.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetRedeemableTokensStakerConfig](../interfaces/getredeemabletokensstakerconfig.md)  |  {} as GetRedeemableTokensStakerConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getredeemabletokensvoter"></a>

###  getRedeemableTokensVoter

► **getRedeemableTokensVoter**(opts?: *[GetRedeemableTokensVoterConfig](../interfaces/getredeemabletokensvoterconfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:378](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L378)*



Return the token amount to which the voter is entitled in the event that the proposal is approved.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetRedeemableTokensVoterConfig](../interfaces/getredeemabletokensvoterconfig.md)  |  {} as GetRedeemableTokensVoterConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getschemeparameters"></a>

###  getSchemeParameters

► **getSchemeParameters**(avatarAddress: *[Address](../#address)*): `Promise`.<[GenesisProtocolParams](../interfaces/genesisprotocolparams.md)>



*Defined in [contracts/genesisProtocol.ts:914](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L914)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#address)   |  - |





**Returns:** `Promise`.<[GenesisProtocolParams](../interfaces/genesisprotocolparams.md)>





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

<a id="getscore"></a>

###  getScore

► **getScore**(opts?: *[GetScoreConfig](../interfaces/getscoreconfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:271](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L271)*



Return the current proposal score.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetScoreConfig](../interfaces/getscoreconfig.md)  |  {} as GetScoreConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getscorethresholdparams"></a>

###  getScoreThresholdParams

► **getScoreThresholdParams**(opts?: *[GetScoreThresholdParamsConfig](../interfaces/getscorethresholdparamsconfig.md)*): `Promise`.<[GetScoreThresholdParamsResult](../interfaces/getscorethresholdparamsresult.md)>



*Defined in [contracts/genesisProtocol.ts:676](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L676)*



Return the score threshold params for the given DAO.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetScoreThresholdParamsConfig](../interfaces/getscorethresholdparamsconfig.md)  |  {} as GetScoreThresholdParamsConfig |   - |





**Returns:** `Promise`.<[GetScoreThresholdParamsResult](../interfaces/getscorethresholdparamsresult.md)>
Promise<GetScoreThresholdParamsResult>






___

<a id="getstakerinfo"></a>

###  getStakerInfo

► **getStakerInfo**(opts?: *[GetStakerInfoConfig](../interfaces/getstakerinfoconfig.md)*): `Promise`.<[GetStakerInfoResult](../interfaces/getstakerinforesult.md)>



*Defined in [contracts/genesisProtocol.ts:706](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L706)*



Return the vote and stake amount for a given proposal and staker.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetStakerInfoConfig](../interfaces/getstakerinfoconfig.md)  |  {} as GetStakerInfoConfig |   - |





**Returns:** `Promise`.<[GetStakerInfoResult](../interfaces/getstakerinforesult.md)>
Promise<GetStakerInfoResult>






___

<a id="getstate"></a>

###  getState

► **getState**(opts?: *[GetStateConfig](../interfaces/getstateconfig.md)*): `Promise`.<`number`>



*Defined in [contracts/genesisProtocol.ts:797](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L797)*



Return the current state of a given proposal.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetStateConfig](../interfaces/getstateconfig.md)  |  {} as GetStateConfig |   - |





**Returns:** `Promise`.<`number`>
Promise<number>






___

<a id="getthreshold"></a>

###  getThreshold

► **getThreshold**(opts?: *[GetThresholdConfig](../interfaces/getthresholdconfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:296](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L296)*



Return the DAO's score threshold that is required by a proposal to it shift to boosted state.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetThresholdConfig](../interfaces/getthresholdconfig.md)  |  {} as GetThresholdConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="gettotalreputationsupply"></a>

###  getTotalReputationSupply

► **getTotalReputationSupply**(opts?: *[GetTotalReputationSupplyConfig](../interfaces/gettotalreputationsupplyconfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:624](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L624)*



Return the total reputation supply for a given proposal.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetTotalReputationSupplyConfig](../interfaces/gettotalreputationsupplyconfig.md)  |  {} as GetTotalReputationSupplyConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getvotestake"></a>

###  getVoteStake

► **getVoteStake**(opts?: *[GetVoteStakeConfig](../interfaces/getvotestakeconfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:741](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L741)*



Return the amount stakes behind a given proposal and vote.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetVoteStakeConfig](../interfaces/getvotestakeconfig.md)  |  {} as GetVoteStakeConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getvotestatus"></a>

###  getVoteStatus

► **getVoteStatus**(opts?: *[GetVoteStatusConfig](../interfaces/getvotestatusconfig.md)*): `Promise`.<`BigNumber.BigNumber`>



*Defined in [contracts/genesisProtocol.ts:535](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L535)*



Returns the reputation currently voted on the given choice.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetVoteStatusConfig](../interfaces/getvotestatusconfig.md)  |  {} as GetVoteStatusConfig |   - |





**Returns:** `Promise`.<`BigNumber.BigNumber`>
Promise<BigNumber.BigNumber>






___

<a id="getvoterinfo"></a>

###  getVoterInfo

► **getVoterInfo**(opts?: *[GetVoterInfoConfig](../interfaces/getvoterinfoconfig.md)*): `Promise`.<[GetVoterInfoResult](../interfaces/getvoterinforesult.md)>



*Defined in [contracts/genesisProtocol.ts:500](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L500)*



Return the vote and the amount of reputation of the voter committed to this proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetVoterInfoConfig](../interfaces/getvoterinfoconfig.md)  |  {} as GetVoterInfoConfig |   - |





**Returns:** `Promise`.<[GetVoterInfoResult](../interfaces/getvoterinforesult.md)>
Promise<GetVoterInfoResult>






___

<a id="getwinningvote"></a>

###  getWinningVote

► **getWinningVote**(opts?: *[GetWinningVoteConfig](../interfaces/getwinningvoteconfig.md)*): `Promise`.<`number`>



*Defined in [contracts/genesisProtocol.ts:771](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L771)*



Return the winningVote for a given proposal.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetWinningVoteConfig](../interfaces/getwinningvoteconfig.md)  |  {} as GetWinningVoteConfig |   - |





**Returns:** `Promise`.<`number`>
Promise<number>






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

<a id="isvotable"></a>

###  isVotable

► **isVotable**(opts?: *[IsVotableConfig](../interfaces/isvotableconfig.md)*): `Promise`.<`boolean`>



*Defined in [contracts/genesisProtocol.ts:568](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L568)*



Return whether the proposal is in a votable state.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [IsVotableConfig](../interfaces/isvotableconfig.md)  |  {} as IsVotableConfig |   - |





**Returns:** `Promise`.<`boolean`>
Promise<boolean>






___

<a id="propose"></a>

###  propose

► **propose**(opts?: *[ProposeVoteConfig](../interfaces/proposevoteconfig.md)*): `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>



*Defined in [contracts/genesisProtocol.ts:43](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L43)*



Create a proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeVoteConfig](../interfaces/proposevoteconfig.md)  |  {} as ProposeVoteConfig |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>
Promise<ArcTransactionProposalResult>






___

<a id="redeem-1"></a>

###  redeem

► **redeem**(opts?: *[RedeemConfig](../interfaces/redeemconfig.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/genesisProtocol.ts:217](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L217)*



Redeem any tokens and reputation that are due the beneficiary from the outcome of the proposal.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [RedeemConfig](../interfaces/redeemconfig.md)  |  {} as RedeemConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>
Promise<ArcTransactionResult>






___

<a id="setparameters"></a>

###  setParameters

► **setParameters**(params: *[GenesisProtocolParams](../interfaces/genesisprotocolparams.md)*): `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[setParameters](extendtrufflecontract.md#setparameters)*

*Defined in [contracts/genesisProtocol.ts:863](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L863)*



Set the contract parameters.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [GenesisProtocolParams](../interfaces/genesisprotocolparams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>
parameters hash






___

<a id="shouldboost"></a>

###  shouldBoost

► **shouldBoost**(opts?: *[ShouldBoostConfig](../interfaces/shouldboostconfig.md)*): `Promise`.<`boolean`>



*Defined in [contracts/genesisProtocol.ts:247](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L247)*



Return whether a proposal should be shifted to the boosted phase.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ShouldBoostConfig](../interfaces/shouldboostconfig.md)  |  {} as ShouldBoostConfig |   - |





**Returns:** `Promise`.<`boolean`>
Promise<boolean>






___

<a id="stake-1"></a>

###  stake

► **stake**(opts?: *[StakeConfig](../interfaces/stakeconfig.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/genesisProtocol.ts:98](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L98)*



Stake some tokens on the final outcome matching this vote.

A transfer of tokens from the staker to this GenesisProtocol scheme is automatically approved and executed on the token with which this GenesisProtocol scheme was deployed.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [StakeConfig](../interfaces/stakeconfig.md)  |  {} as StakeConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>
Promise<ArcTransactionResult>






___

<a id="vote"></a>

###  vote

► **vote**(opts?: *[VoteConfig](../interfaces/voteconfig.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/genesisProtocol.ts:150](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L150)*



Vote on a proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [VoteConfig](../interfaces/voteconfig.md)  |  {} as VoteConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>
Promise<ArcTransactionResult>






___

<a id="votewithspecifiedamounts"></a>

###  voteWithSpecifiedAmounts

► **voteWithSpecifiedAmounts**(opts?: *[VoteWithSpecifiedAmountsConfig](../interfaces/votewithspecifiedamountsconfig.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/genesisProtocol.ts:181](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L181)*



Vote on a proposal, staking some reputation that the final outcome will match this vote. Reputation of 0 will stake all the voter's reputation.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [VoteWithSpecifiedAmountsConfig](../interfaces/votewithspecifiedamountsconfig.md)  |  {} as VoteWithSpecifiedAmountsConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>
Promise<ArcTransactionResult>






___


