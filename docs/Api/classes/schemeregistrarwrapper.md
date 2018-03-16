[API Reference](../README.md) > [SchemeRegistrarWrapper](../classes/SchemeRegistrarWrapper.md)



# Class: SchemeRegistrarWrapper

## Hierarchy


 [ExtendTruffleContract](ExtendTruffleContract.md)

**↳ SchemeRegistrarWrapper**







## Index

### Constructors

* [constructor](SchemeRegistrarWrapper.md#constructor)


### Properties

* [NewSchemeProposal](SchemeRegistrarWrapper.md#NewSchemeProposal)
* [ProposalDeleted](SchemeRegistrarWrapper.md#ProposalDeleted)
* [ProposalExecuted](SchemeRegistrarWrapper.md#ProposalExecuted)
* [RemoveSchemeProposal](SchemeRegistrarWrapper.md#RemoveSchemeProposal)
* [contract](SchemeRegistrarWrapper.md#contract)


### Accessors

* [address](SchemeRegistrarWrapper.md#address)


### Methods

* [getController](SchemeRegistrarWrapper.md#getController)
* [getDefaultPermissions](SchemeRegistrarWrapper.md#getDefaultPermissions)
* [getParameters](SchemeRegistrarWrapper.md#getParameters)
* [getParametersArray](SchemeRegistrarWrapper.md#getParametersArray)
* [getPermissions](SchemeRegistrarWrapper.md#getPermissions)
* [getSchemeParameters](SchemeRegistrarWrapper.md#getSchemeParameters)
* [getSchemeParametersHash](SchemeRegistrarWrapper.md#getSchemeParametersHash)
* [hydrateFromAt](SchemeRegistrarWrapper.md#hydrateFromAt)
* [hydrateFromDeployed](SchemeRegistrarWrapper.md#hydrateFromDeployed)
* [hydrateFromNew](SchemeRegistrarWrapper.md#hydrateFromNew)
* [proposeToAddModifyScheme](SchemeRegistrarWrapper.md#proposeToAddModifyScheme)
* [proposeToRemoveScheme](SchemeRegistrarWrapper.md#proposeToRemoveScheme)
* [setParameters](SchemeRegistrarWrapper.md#setParameters)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new SchemeRegistrarWrapper**(solidityContract: *`any`*): [SchemeRegistrarWrapper](SchemeRegistrarWrapper.md)


*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[constructor](ExtendTruffleContract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [SchemeRegistrarWrapper](SchemeRegistrarWrapper.md)

---


## Properties
<a id="NewSchemeProposal"></a>

###  NewSchemeProposal

**●  NewSchemeProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[NewSchemeProposalEventResult](../interfaces/NewSchemeProposalEventResult.md)*  =  this.createEventFetcherFactory<NewSchemeProposalEventResult>("NewSchemeProposal")

*Defined in [contracts/schemeregistrar.ts:22](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/schemeregistrar.ts#L22)*



Events




___

<a id="ProposalDeleted"></a>

###  ProposalDeleted

**●  ProposalDeleted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalDeletedEventResult](../interfaces/ProposalDeletedEventResult.md)*  =  this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted")

*Defined in [contracts/schemeregistrar.ts:25](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/schemeregistrar.ts#L25)*





___

<a id="ProposalExecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalExecutedEventResult](../interfaces/ProposalExecutedEventResult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [contracts/schemeregistrar.ts:24](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/schemeregistrar.ts#L24)*





___

<a id="RemoveSchemeProposal"></a>

###  RemoveSchemeProposal

**●  RemoveSchemeProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[RemoveSchemeProposalEventResult](../interfaces/RemoveSchemeProposalEventResult.md)*  =  this.createEventFetcherFactory<RemoveSchemeProposalEventResult>("RemoveSchemeProposal")

*Defined in [contracts/schemeregistrar.ts:23](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/schemeregistrar.ts#L23)*





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

*Defined in [contracts/schemeregistrar.ts:144](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/schemeregistrar.ts#L144)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | [SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)   |  - |





**Returns:** [SchemePermissions](../enums/SchemePermissions.md)





___

<a id="getParameters"></a>

###  getParameters

► **getParameters**(paramsHash: *[Hash](../#Hash)*): `Promise`.<[StandardSchemeParams](../interfaces/StandardSchemeParams.md)>



*Overrides [ExtendTruffleContract](ExtendTruffleContract.md).[getParameters](ExtendTruffleContract.md#getParameters)*

*Defined in [contracts/schemeregistrar.ts:153](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/schemeregistrar.ts#L153)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#Hash)   |  - |





**Returns:** `Promise`.<[StandardSchemeParams](../interfaces/StandardSchemeParams.md)>





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

<a id="getSchemeParameters"></a>

###  getSchemeParameters

► **getSchemeParameters**(avatarAddress: *[Address](../#Address)*): `Promise`.<[StandardSchemeParams](../interfaces/StandardSchemeParams.md)>



*Defined in [contracts/schemeregistrar.ts:149](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/schemeregistrar.ts#L149)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[StandardSchemeParams](../interfaces/StandardSchemeParams.md)>





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

<a id="proposeToAddModifyScheme"></a>

###  proposeToAddModifyScheme

► **proposeToAddModifyScheme**(opts?: *[ProposeToAddModifySchemeParams](../interfaces/ProposeToAddModifySchemeParams.md)*): `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>



*Defined in [contracts/schemeregistrar.ts:38](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/schemeregistrar.ts#L38)*



Note relating to permissions: According rules defined in the Controller, this SchemeRegistrar is only capable of registering schemes that have either no permissions or have the permission to register other schemes. Therefore Arc's SchemeRegistrar is not capable of registering schemes that have permissions greater than its own, thus excluding schemes having the permission to add/remove global constraints or upgrade the controller. The Controller will throw an exception when an attempt is made to add or remove schemes having greater permissions than the scheme attempting the change.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeToAddModifySchemeParams](../interfaces/ProposeToAddModifySchemeParams.md)  |  {} as ProposeToAddModifySchemeParams |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>





___

<a id="proposeToRemoveScheme"></a>

###  proposeToRemoveScheme

► **proposeToRemoveScheme**(opts?: *[ProposeToRemoveSchemeParams](../interfaces/ProposeToRemoveSchemeParams.md)*): `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>



*Defined in [contracts/schemeregistrar.ts:104](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/schemeregistrar.ts#L104)*



**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeToRemoveSchemeParams](../interfaces/ProposeToRemoveSchemeParams.md)  |  {} as ProposeToRemoveSchemeParams |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>





___

<a id="setParameters"></a>

###  setParameters

► **setParameters**(params: *[StandardSchemeParams](../interfaces/StandardSchemeParams.md)*): `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>



*Overrides [ExtendTruffleContract](ExtendTruffleContract.md).[setParameters](ExtendTruffleContract.md#setParameters)*

*Defined in [contracts/schemeregistrar.ts:136](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/schemeregistrar.ts#L136)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [StandardSchemeParams](../interfaces/StandardSchemeParams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___


