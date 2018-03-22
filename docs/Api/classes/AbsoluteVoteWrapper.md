[API Reference](../README.md) > [AbsoluteVoteWrapper](../classes/AbsoluteVoteWrapper.md)



# Class: AbsoluteVoteWrapper

## Hierarchy


 [ContractWrapperBase](ContractWrapperBase.md)

**↳ AbsoluteVoteWrapper**







## Index

### Constructors

* [constructor](AbsoluteVoteWrapper.md#constructor)


### Properties

* [CancelProposal](AbsoluteVoteWrapper.md#CancelProposal)
* [CancelVoting](AbsoluteVoteWrapper.md#CancelVoting)
* [ExecuteProposal](AbsoluteVoteWrapper.md#ExecuteProposal)
* [NewProposal](AbsoluteVoteWrapper.md#NewProposal)
* [VoteProposal](AbsoluteVoteWrapper.md#VoteProposal)
* [contract](AbsoluteVoteWrapper.md#contract)
* [frendlyName](AbsoluteVoteWrapper.md#frendlyName)
* [name](AbsoluteVoteWrapper.md#name)


### Accessors

* [address](AbsoluteVoteWrapper.md#address)


### Methods

* [getController](AbsoluteVoteWrapper.md#getController)
* [getParameters](AbsoluteVoteWrapper.md#getParameters)
* [getParametersArray](AbsoluteVoteWrapper.md#getParametersArray)
* [getSchemeParametersHash](AbsoluteVoteWrapper.md#getSchemeParametersHash)
* [hydrateFromAt](AbsoluteVoteWrapper.md#hydrateFromAt)
* [hydrateFromDeployed](AbsoluteVoteWrapper.md#hydrateFromDeployed)
* [hydrateFromNew](AbsoluteVoteWrapper.md#hydrateFromNew)
* [setParameters](AbsoluteVoteWrapper.md#setParameters)
* [vote](AbsoluteVoteWrapper.md#vote)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new AbsoluteVoteWrapper**(solidityContract: *`any`*): [AbsoluteVoteWrapper](AbsoluteVoteWrapper.md)


*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[constructor](ContractWrapperBase.md#constructor)*

*Defined in [contractWrapperBase.ts:37](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L37)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [AbsoluteVoteWrapper](AbsoluteVoteWrapper.md)

---


## Properties
<a id="CancelProposal"></a>

###  CancelProposal

**●  CancelProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[CancelProposalEventResult](../interfaces/CancelProposalEventResult.md)*  =  this.createEventFetcherFactory<CancelProposalEventResult>("CancelProposal")

*Defined in [wrappers/absoluteVote.ts:25](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/absoluteVote.ts#L25)*





___

<a id="CancelVoting"></a>

###  CancelVoting

**●  CancelVoting**:  *[EventFetcherFactory](../#EventFetcherFactory)[CancelVotingEventResult](../interfaces/CancelVotingEventResult.md)*  =  this.createEventFetcherFactory<CancelVotingEventResult>("CancelVoting")

*Defined in [wrappers/absoluteVote.ts:28](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/absoluteVote.ts#L28)*





___

<a id="ExecuteProposal"></a>

###  ExecuteProposal

**●  ExecuteProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[ExecuteProposalEventResult](../interfaces/ExecuteProposalEventResult.md)*  =  this.createEventFetcherFactory<ExecuteProposalEventResult>("ExecuteProposal")

*Defined in [wrappers/absoluteVote.ts:26](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/absoluteVote.ts#L26)*





___

<a id="NewProposal"></a>

###  NewProposal

**●  NewProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[NewProposalEventResult](../interfaces/NewProposalEventResult.md)*  =  this.createEventFetcherFactory<NewProposalEventResult>("NewProposal")

*Defined in [wrappers/absoluteVote.ts:24](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/absoluteVote.ts#L24)*



Events




___

<a id="VoteProposal"></a>

###  VoteProposal

**●  VoteProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[VoteProposalEventResult](../interfaces/VoteProposalEventResult.md)*  =  this.createEventFetcherFactory<VoteProposalEventResult>("VoteProposal")

*Defined in [wrappers/absoluteVote.ts:27](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/absoluteVote.ts#L27)*





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

**●  frendlyName**:  *`string`*  = "Absolute Vote"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[frendlyName](ContractWrapperBase.md#frendlyName)*

*Defined in [wrappers/absoluteVote.ts:17](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/absoluteVote.ts#L17)*





___

<a id="name"></a>

###  name

**●  name**:  *`string`*  = "AbsoluteVote"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[name](ContractWrapperBase.md#name)*

*Defined in [wrappers/absoluteVote.ts:16](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/absoluteVote.ts#L16)*





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

<a id="getParameters"></a>

###  getParameters

► **getParameters**(paramsHash: *[Hash](../#Hash)*): `Promise`.<`any`>



*Overrides [ContractWrapperBase](ContractWrapperBase.md).[getParameters](ContractWrapperBase.md#getParameters)*

*Defined in [wrappers/absoluteVote.ts:83](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/absoluteVote.ts#L83)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#Hash)   |  - |





**Returns:** `Promise`.<`any`>





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

<a id="setParameters"></a>

###  setParameters

► **setParameters**(params: *[AbsoluteVoteParams](../interfaces/AbsoluteVoteParams.md)*): `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>



*Overrides [ContractWrapperBase](ContractWrapperBase.md).[setParameters](ContractWrapperBase.md#setParameters)*

*Defined in [wrappers/absoluteVote.ts:63](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/absoluteVote.ts#L63)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [AbsoluteVoteParams](../interfaces/AbsoluteVoteParams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___

<a id="vote"></a>

###  vote

► **vote**(opts?: *[VoteConfig](../interfaces/VoteConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/absoluteVote.ts:36](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/absoluteVote.ts#L36)*



Vote on a proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [VoteConfig](../interfaces/VoteConfig.md)  |  {} as VoteConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>
Promise<ArcTransactionResult>






___


