[@DAOstack/Arc.js API Reference](../README.md) > [SchemeRegistrarWrapper](../classes/schemeregistrarwrapper.md)



# Class: SchemeRegistrarWrapper

## Hierarchy


 [ExtendTruffleContract](extendtrufflecontract.md)

**↳ SchemeRegistrarWrapper**







## Index

### Constructors

* [constructor](schemeregistrarwrapper.md#constructor)


### Properties

* [NewSchemeProposal](schemeregistrarwrapper.md#newschemeproposal)
* [ProposalDeleted](schemeregistrarwrapper.md#proposaldeleted)
* [ProposalExecuted](schemeregistrarwrapper.md#proposalexecuted)
* [RemoveSchemeProposal](schemeregistrarwrapper.md#removeschemeproposal)
* [contract](schemeregistrarwrapper.md#contract)


### Accessors

* [address](schemeregistrarwrapper.md#address)


### Methods

* [getDefaultPermissions](schemeregistrarwrapper.md#getdefaultpermissions)
* [getParameters](schemeregistrarwrapper.md#getparameters)
* [getParametersArray](schemeregistrarwrapper.md#getparametersarray)
* [getSchemeParameters](schemeregistrarwrapper.md#getschemeparameters)
* [getSchemeParametersHash](schemeregistrarwrapper.md#getschemeparametershash)
* [hydrateFromAt](schemeregistrarwrapper.md#hydratefromat)
* [hydrateFromDeployed](schemeregistrarwrapper.md#hydratefromdeployed)
* [hydrateFromNew](schemeregistrarwrapper.md#hydratefromnew)
* [proposeToAddModifyScheme](schemeregistrarwrapper.md#proposetoaddmodifyscheme)
* [proposeToRemoveScheme](schemeregistrarwrapper.md#proposetoremovescheme)
* [setParameters](schemeregistrarwrapper.md#setparameters)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new SchemeRegistrarWrapper**(solidityContract: *`any`*): [SchemeRegistrarWrapper](schemeregistrarwrapper.md)


*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[constructor](extendtrufflecontract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [SchemeRegistrarWrapper](schemeregistrarwrapper.md)

---


## Properties
<a id="newschemeproposal"></a>

###  NewSchemeProposal

**●  NewSchemeProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[NewSchemeProposalEventResult](../interfaces/newschemeproposaleventresult.md)*  =  this.createEventFetcherFactory<NewSchemeProposalEventResult>("NewSchemeProposal")

*Defined in [contracts/schemeregistrar.ts:23](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/schemeregistrar.ts#L23)*



Events




___

<a id="proposaldeleted"></a>

###  ProposalDeleted

**●  ProposalDeleted**:  *[EventFetcherFactory](../#eventfetcherfactory)[ProposalDeletedEventResult](../interfaces/proposaldeletedeventresult.md)*  =  this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted")

*Defined in [contracts/schemeregistrar.ts:26](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/schemeregistrar.ts#L26)*





___

<a id="proposalexecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#eventfetcherfactory)[ProposalExecutedEventResult](../interfaces/proposalexecutedeventresult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [contracts/schemeregistrar.ts:25](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/schemeregistrar.ts#L25)*





___

<a id="removeschemeproposal"></a>

###  RemoveSchemeProposal

**●  RemoveSchemeProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[RemoveSchemeProposalEventResult](../interfaces/removeschemeproposaleventresult.md)*  =  this.createEventFetcherFactory<RemoveSchemeProposalEventResult>("RemoveSchemeProposal")

*Defined in [contracts/schemeregistrar.ts:24](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/schemeregistrar.ts#L24)*





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



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[getDefaultPermissions](extendtrufflecontract.md#getdefaultpermissions)*

*Defined in [contracts/schemeregistrar.ts:180](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/schemeregistrar.ts#L180)*



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

*Defined in [contracts/schemeregistrar.ts:188](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/schemeregistrar.ts#L188)*



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

*Defined in [ExtendTruffleContract.ts:124](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L124)*



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



*Defined in [contracts/schemeregistrar.ts:184](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/schemeregistrar.ts#L184)*



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

<a id="proposetoaddmodifyscheme"></a>

###  proposeToAddModifyScheme

► **proposeToAddModifyScheme**(opts?: *[ProposeToAddModifySchemeParams](../interfaces/proposetoaddmodifyschemeparams.md)*): `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>



*Defined in [contracts/schemeregistrar.ts:39](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/schemeregistrar.ts#L39)*



Note relating to permissions: According rules defined in the Controller, this SchemeRegistrar is only capable of registering schemes that have either no permissions or have the permission to register other schemes. Therefore Arc's SchemeRegistrar is not capable of registering schemes that have permissions greater than its own, thus excluding schemes having the permission to add/remove global constraints or upgrade the controller. The Controller will throw an exception when an attempt is made to add or remove schemes having greater permissions than the scheme attempting the change.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeToAddModifySchemeParams](../interfaces/proposetoaddmodifyschemeparams.md)  |  {} as ProposeToAddModifySchemeParams |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>





___

<a id="proposetoremovescheme"></a>

###  proposeToRemoveScheme

► **proposeToRemoveScheme**(opts?: *[ProposeToRemoveSchemeParams](../interfaces/proposetoremoveschemeparams.md)*): `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>



*Defined in [contracts/schemeregistrar.ts:140](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/schemeregistrar.ts#L140)*



**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeToRemoveSchemeParams](../interfaces/proposetoremoveschemeparams.md)  |  {} as ProposeToRemoveSchemeParams |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>





___

<a id="setparameters"></a>

###  setParameters

► **setParameters**(params: *[StandardSchemeParams](../interfaces/standardschemeparams.md)*): `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[setParameters](extendtrufflecontract.md#setparameters)*

*Defined in [contracts/schemeregistrar.ts:172](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts/schemeregistrar.ts#L172)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [StandardSchemeParams](../interfaces/standardschemeparams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>





___


