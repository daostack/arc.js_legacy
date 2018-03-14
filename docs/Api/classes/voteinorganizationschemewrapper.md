[@DAOstack/Arc.js API Reference](../README.md) > [VoteInOrganizationSchemeWrapper](../classes/voteinorganizationschemewrapper.md)



# Class: VoteInOrganizationSchemeWrapper

## Hierarchy


 [ExtendTruffleContract](extendtrufflecontract.md)

**↳ VoteInOrganizationSchemeWrapper**







## Index

### Constructors

* [constructor](voteinorganizationschemewrapper.md#constructor)


### Properties

* [ProposalDeleted](voteinorganizationschemewrapper.md#proposaldeleted)
* [ProposalExecuted](voteinorganizationschemewrapper.md#proposalexecuted)
* [VoteOnBehalf](voteinorganizationschemewrapper.md#voteonbehalf)
* [contract](voteinorganizationschemewrapper.md#contract)


### Accessors

* [address](voteinorganizationschemewrapper.md#address)


### Methods

* [getDefaultPermissions](voteinorganizationschemewrapper.md#getdefaultpermissions)
* [getParameters](voteinorganizationschemewrapper.md#getparameters)
* [getParametersArray](voteinorganizationschemewrapper.md#getparametersarray)
* [getSchemeParameters](voteinorganizationschemewrapper.md#getschemeparameters)
* [getSchemeParametersHash](voteinorganizationschemewrapper.md#getschemeparametershash)
* [hydrateFromAt](voteinorganizationschemewrapper.md#hydratefromat)
* [hydrateFromDeployed](voteinorganizationschemewrapper.md#hydratefromdeployed)
* [hydrateFromNew](voteinorganizationschemewrapper.md#hydratefromnew)
* [proposeVote](voteinorganizationschemewrapper.md#proposevote)
* [setParameters](voteinorganizationschemewrapper.md#setparameters)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new VoteInOrganizationSchemeWrapper**(solidityContract: *`any`*): [VoteInOrganizationSchemeWrapper](voteinorganizationschemewrapper.md)


*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[constructor](extendtrufflecontract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [VoteInOrganizationSchemeWrapper](voteinorganizationschemewrapper.md)

---


## Properties
<a id="proposaldeleted"></a>

###  ProposalDeleted

**●  ProposalDeleted**:  *[EventFetcherFactory](../#eventfetcherfactory)[ProposalDeletedEventResult](../interfaces/proposaldeletedeventresult.md)*  =  this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted")

*Defined in [contracts/voteInOrganizationScheme.ts:22](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/voteInOrganizationScheme.ts#L22)*





___

<a id="proposalexecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#eventfetcherfactory)[ProposalExecutedEventResult](../interfaces/proposalexecutedeventresult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [contracts/voteInOrganizationScheme.ts:21](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/voteInOrganizationScheme.ts#L21)*



Events




___

<a id="voteonbehalf"></a>

###  VoteOnBehalf

**●  VoteOnBehalf**:  *[EventFetcherFactory](../#eventfetcherfactory)[VoteOnBehalfEventResult](../interfaces/voteonbehalfeventresult.md)*  =  this.createEventFetcherFactory<VoteOnBehalfEventResult>("VoteOnBehalf")

*Defined in [contracts/voteInOrganizationScheme.ts:23](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/voteInOrganizationScheme.ts#L23)*





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

*Defined in [contracts/voteInOrganizationScheme.ts:68](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/voteInOrganizationScheme.ts#L68)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | `string`   |  - |





**Returns:** `string`





___

<a id="getparameters"></a>

###  getParameters

► **getParameters**(paramsHash: *[Hash](../#hash)*): `Promise`.<[StandardSchemeParams](../interfaces/standardschemeparams.md)>



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[getParameters](extendtrufflecontract.md#getparameters)*

*Defined in [contracts/voteInOrganizationScheme.ts:76](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/voteInOrganizationScheme.ts#L76)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#hash)   |  - |





**Returns:** `Promise`.<[StandardSchemeParams](../interfaces/standardschemeparams.md)>





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

► **getSchemeParameters**(avatarAddress: *[Address](../#address)*): `Promise`.<[StandardSchemeParams](../interfaces/standardschemeparams.md)>



*Defined in [contracts/voteInOrganizationScheme.ts:72](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/voteInOrganizationScheme.ts#L72)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#address)   |  - |





**Returns:** `Promise`.<[StandardSchemeParams](../interfaces/standardschemeparams.md)>





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

<a id="proposevote"></a>

###  proposeVote

► **proposeVote**(opts?: *[VoteInOrganizationProposeVoteConfig](../interfaces/voteinorganizationproposevoteconfig.md)*): `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>



*Defined in [contracts/voteInOrganizationScheme.ts:26](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/voteInOrganizationScheme.ts#L26)*



**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [VoteInOrganizationProposeVoteConfig](../interfaces/voteinorganizationproposevoteconfig.md)  |  {} as VoteInOrganizationProposeVoteConfig |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>





___

<a id="setparameters"></a>

###  setParameters

► **setParameters**(params: *[StandardSchemeParams](../interfaces/standardschemeparams.md)*): `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[setParameters](extendtrufflecontract.md#setparameters)*

*Defined in [contracts/voteInOrganizationScheme.ts:61](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/voteInOrganizationScheme.ts#L61)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [StandardSchemeParams](../interfaces/standardschemeparams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>





___


