[API Reference](../README.md) > [AbsoluteVoteWrapper](../classes/AbsoluteVoteWrapper.md)



# Class: AbsoluteVoteWrapper

## Hierarchy


 [ExtendTruffleContract](ExtendTruffleContract.md)

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


### Accessors

* [address](AbsoluteVoteWrapper.md#address)


### Methods

* [getController](AbsoluteVoteWrapper.md#getController)
* [getDefaultPermissions](AbsoluteVoteWrapper.md#getDefaultPermissions)
* [getParameters](AbsoluteVoteWrapper.md#getParameters)
* [getParametersArray](AbsoluteVoteWrapper.md#getParametersArray)
* [getPermissions](AbsoluteVoteWrapper.md#getPermissions)
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


*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[constructor](ExtendTruffleContract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L26)*



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

*Defined in [contracts/absoluteVote.ts:22](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/absoluteVote.ts#L22)*





___

<a id="CancelVoting"></a>

###  CancelVoting

**●  CancelVoting**:  *[EventFetcherFactory](../#EventFetcherFactory)[CancelVotingEventResult](../interfaces/CancelVotingEventResult.md)*  =  this.createEventFetcherFactory<CancelVotingEventResult>("CancelVoting")

*Defined in [contracts/absoluteVote.ts:25](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/absoluteVote.ts#L25)*





___

<a id="ExecuteProposal"></a>

###  ExecuteProposal

**●  ExecuteProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[ExecuteProposalEventResult](../interfaces/ExecuteProposalEventResult.md)*  =  this.createEventFetcherFactory<ExecuteProposalEventResult>("ExecuteProposal")

*Defined in [contracts/absoluteVote.ts:23](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/absoluteVote.ts#L23)*





___

<a id="NewProposal"></a>

###  NewProposal

**●  NewProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[NewProposalEventResult](../interfaces/NewProposalEventResult.md)*  =  this.createEventFetcherFactory<NewProposalEventResult>("NewProposal")

*Defined in [contracts/absoluteVote.ts:21](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/absoluteVote.ts#L21)*



Events




___

<a id="VoteProposal"></a>

###  VoteProposal

**●  VoteProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[VoteProposalEventResult](../interfaces/VoteProposalEventResult.md)*  =  this.createEventFetcherFactory<VoteProposalEventResult>("VoteProposal")

*Defined in [contracts/absoluteVote.ts:24](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/absoluteVote.ts#L24)*





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



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[getDefaultPermissions](ExtendTruffleContract.md#getDefaultPermissions)*

*Defined in [ExtendTruffleContract.ts:98](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L98)*



The subclass must override this for there to be any permissions at all, unless caller provides a value.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | [SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)   |  - |





**Returns:** [SchemePermissions](../enums/SchemePermissions.md)





___

<a id="getParameters"></a>

###  getParameters

► **getParameters**(paramsHash: *[Hash](../#Hash)*): `Promise`.<`any`>



*Overrides [ExtendTruffleContract](ExtendTruffleContract.md).[getParameters](ExtendTruffleContract.md#getParameters)*

*Defined in [contracts/absoluteVote.ts:80](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/absoluteVote.ts#L80)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#Hash)   |  - |





**Returns:** `Promise`.<`any`>





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

<a id="setParameters"></a>

###  setParameters

► **setParameters**(params: *[AbsoluteVoteParams](../interfaces/AbsoluteVoteParams.md)*): `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>



*Overrides [ExtendTruffleContract](ExtendTruffleContract.md).[setParameters](ExtendTruffleContract.md#setParameters)*

*Defined in [contracts/absoluteVote.ts:60](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/absoluteVote.ts#L60)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [AbsoluteVoteParams](../interfaces/AbsoluteVoteParams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___

<a id="vote"></a>

###  vote

► **vote**(opts?: *[VoteConfig](../interfaces/VoteConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [contracts/absoluteVote.ts:33](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/absoluteVote.ts#L33)*



Vote on a proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [VoteConfig](../interfaces/VoteConfig.md)  |  {} as VoteConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>
Promise<ArcTransactionResult>






___


