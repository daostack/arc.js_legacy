[@DAOstack/Arc.js API Reference](../README.md) > [AbsoluteVoteWrapper](../classes/absolutevotewrapper.md)



# Class: AbsoluteVoteWrapper

## Hierarchy


 [ExtendTruffleContract](extendtrufflecontract.md)

**↳ AbsoluteVoteWrapper**







## Index

### Constructors

* [constructor](absolutevotewrapper.md#constructor)


### Properties

* [CancelProposal](absolutevotewrapper.md#cancelproposal)
* [CancelVoting](absolutevotewrapper.md#cancelvoting)
* [ExecuteProposal](absolutevotewrapper.md#executeproposal)
* [NewProposal](absolutevotewrapper.md#newproposal)
* [VoteProposal](absolutevotewrapper.md#voteproposal)
* [contract](absolutevotewrapper.md#contract)


### Accessors

* [address](absolutevotewrapper.md#address)


### Methods

* [getDefaultPermissions](absolutevotewrapper.md#getdefaultpermissions)
* [getParameters](absolutevotewrapper.md#getparameters)
* [getParametersArray](absolutevotewrapper.md#getparametersarray)
* [getSchemeParametersHash](absolutevotewrapper.md#getschemeparametershash)
* [hydrateFromAt](absolutevotewrapper.md#hydratefromat)
* [hydrateFromDeployed](absolutevotewrapper.md#hydratefromdeployed)
* [hydrateFromNew](absolutevotewrapper.md#hydratefromnew)
* [setParameters](absolutevotewrapper.md#setparameters)
* [vote](absolutevotewrapper.md#vote)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new AbsoluteVoteWrapper**(solidityContract: *`any`*): [AbsoluteVoteWrapper](absolutevotewrapper.md)


*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[constructor](extendtrufflecontract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [AbsoluteVoteWrapper](absolutevotewrapper.md)

---


## Properties
<a id="cancelproposal"></a>

###  CancelProposal

**●  CancelProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[CancelProposalEventResult](../interfaces/cancelproposaleventresult.md)*  =  this.createEventFetcherFactory<CancelProposalEventResult>("CancelProposal")

*Defined in [contracts/absoluteVote.ts:22](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/absoluteVote.ts#L22)*





___

<a id="cancelvoting"></a>

###  CancelVoting

**●  CancelVoting**:  *[EventFetcherFactory](../#eventfetcherfactory)[CancelVotingEventResult](../interfaces/cancelvotingeventresult.md)*  =  this.createEventFetcherFactory<CancelVotingEventResult>("CancelVoting")

*Defined in [contracts/absoluteVote.ts:25](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/absoluteVote.ts#L25)*





___

<a id="executeproposal"></a>

###  ExecuteProposal

**●  ExecuteProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[ExecuteProposalEventResult](../interfaces/executeproposaleventresult.md)*  =  this.createEventFetcherFactory<ExecuteProposalEventResult>("ExecuteProposal")

*Defined in [contracts/absoluteVote.ts:23](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/absoluteVote.ts#L23)*





___

<a id="newproposal"></a>

###  NewProposal

**●  NewProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[NewProposalEventResult](../interfaces/newproposaleventresult.md)*  =  this.createEventFetcherFactory<NewProposalEventResult>("NewProposal")

*Defined in [contracts/absoluteVote.ts:21](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/absoluteVote.ts#L21)*



Events




___

<a id="voteproposal"></a>

###  VoteProposal

**●  VoteProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[VoteProposalEventResult](../interfaces/voteproposaleventresult.md)*  =  this.createEventFetcherFactory<VoteProposalEventResult>("VoteProposal")

*Defined in [contracts/absoluteVote.ts:24](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/absoluteVote.ts#L24)*





___

<a id="contract"></a>

###  contract

**●  contract**:  *`any`* 

*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[contract](extendtrufflecontract.md#contract)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L26)*



The underlying truffle contract object. Use this to access parts of the contract that aren't accessible via the wrapper.




___


## Accessors
<a id="address"></a>

###  address


getaddress(): [Address](../#address)

*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[address](extendtrufflecontract.md#address)*

*Defined in [ExtendTruffleContract.ts:128](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L128)*





**Returns:** [Address](../#address)



___


## Methods
<a id="getdefaultpermissions"></a>

###  getDefaultPermissions

► **getDefaultPermissions**(overrideValue?: *`string`*): `string`



*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[getDefaultPermissions](extendtrufflecontract.md#getdefaultpermissions)*

*Defined in [ExtendTruffleContract.ts:98](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L98)*



The subclass must override this for there to be any permissions at all, unless caller provides a value.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | `string`   |  - |





**Returns:** `string`





___

<a id="getparameters"></a>

###  getParameters

► **getParameters**(paramsHash: *[Hash](../#hash)*): `Promise`.<`any`>



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[getParameters](extendtrufflecontract.md#getparameters)*

*Defined in [contracts/absoluteVote.ts:80](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/absoluteVote.ts#L80)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#hash)   |  - |





**Returns:** `Promise`.<`any`>





___

<a id="getparametersarray"></a>

###  getParametersArray

► **getParametersArray**(paramsHash: *[Hash](../#hash)*): `Promise`.<`Array`.<`any`>>



*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[getParametersArray](extendtrufflecontract.md#getparametersarray)*

*Defined in [ExtendTruffleContract.ts:124](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L124)*



Given a hash, return the associated parameters as an array, ordered by the order in which the parameters appear in the contract's Parameters struct.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#hash)   |  - |





**Returns:** `Promise`.<`Array`.<`any`>>





___

<a id="getschemeparametershash"></a>

###  getSchemeParametersHash

► **getSchemeParametersHash**(avatarAddress: *[Address](../#address)*): `Promise`.<[Hash](../#hash)>



*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[getSchemeParametersHash](extendtrufflecontract.md#getschemeparametershash)*

*Defined in [ExtendTruffleContract.ts:114](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L114)*



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

*Defined in [ExtendTruffleContract.ts:56](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L56)*



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

*Defined in [ExtendTruffleContract.ts:71](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L71)*



Initialize as it was migrated by Arc.js on the current network.




**Returns:** `Promise`.<`any`>
this






___

<a id="hydratefromnew"></a>

###  hydrateFromNew

► **hydrateFromNew**(...rest: *`Array`.<`any`>*): `Promise`.<`any`>



*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[hydrateFromNew](extendtrufflecontract.md#hydratefromnew)*

*Defined in [ExtendTruffleContract.ts:40](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L40)*



Initialize from a newly-migrated instance. This will migrate a new instance of the contract to the net.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| rest | `Array`.<`any`>   |  - |





**Returns:** `Promise`.<`any`>
this






___

<a id="setparameters"></a>

###  setParameters

► **setParameters**(params: *[AbsoluteVoteParams](../interfaces/absolutevoteparams.md)*): `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[setParameters](extendtrufflecontract.md#setparameters)*

*Defined in [contracts/absoluteVote.ts:60](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/absoluteVote.ts#L60)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [AbsoluteVoteParams](../interfaces/absolutevoteparams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>





___

<a id="vote"></a>

###  vote

► **vote**(opts?: *[VoteConfig](../interfaces/voteconfig.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/absoluteVote.ts:33](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/absoluteVote.ts#L33)*



Vote on a proposal


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [VoteConfig](../interfaces/voteconfig.md)  |  {} as VoteConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>
Promise<ArcTransactionResult>






___


