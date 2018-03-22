[API Reference](../README.md) > [SchemeRegistrarWrapper](../classes/SchemeRegistrarWrapper.md)



# Class: SchemeRegistrarWrapper

## Hierarchy


 [ContractWrapperBase](ContractWrapperBase.md)

**↳ SchemeRegistrarWrapper**







## Implements

* [SchemeWrapper](../interfaces/SchemeWrapper.md)

## Index

### Constructors

* [constructor](SchemeRegistrarWrapper.md#constructor)


### Properties

* [NewSchemeProposal](SchemeRegistrarWrapper.md#NewSchemeProposal)
* [ProposalDeleted](SchemeRegistrarWrapper.md#ProposalDeleted)
* [ProposalExecuted](SchemeRegistrarWrapper.md#ProposalExecuted)
* [RemoveSchemeProposal](SchemeRegistrarWrapper.md#RemoveSchemeProposal)
* [contract](SchemeRegistrarWrapper.md#contract)
* [frendlyName](SchemeRegistrarWrapper.md#frendlyName)
* [name](SchemeRegistrarWrapper.md#name)


### Accessors

* [address](SchemeRegistrarWrapper.md#address)


### Methods

* [getController](SchemeRegistrarWrapper.md#getController)
* [getDefaultPermissions](SchemeRegistrarWrapper.md#getDefaultPermissions)
* [getParameters](SchemeRegistrarWrapper.md#getParameters)
* [getParametersArray](SchemeRegistrarWrapper.md#getParametersArray)
* [getSchemeParameters](SchemeRegistrarWrapper.md#getSchemeParameters)
* [getSchemeParametersHash](SchemeRegistrarWrapper.md#getSchemeParametersHash)
* [getSchemePermissions](SchemeRegistrarWrapper.md#getSchemePermissions)
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


*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[constructor](ContractWrapperBase.md#constructor)*

*Defined in [contractWrapperBase.ts:37](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L37)*



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

*Defined in [wrappers/schemeregistrar.ts:23](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L23)*



Events




___

<a id="ProposalDeleted"></a>

###  ProposalDeleted

**●  ProposalDeleted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalDeletedEventResult](../interfaces/ProposalDeletedEventResult.md)*  =  this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted")

*Defined in [wrappers/schemeregistrar.ts:26](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L26)*





___

<a id="ProposalExecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalExecutedEventResult](../interfaces/ProposalExecutedEventResult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [wrappers/schemeregistrar.ts:25](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L25)*





___

<a id="RemoveSchemeProposal"></a>

###  RemoveSchemeProposal

**●  RemoveSchemeProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[RemoveSchemeProposalEventResult](../interfaces/RemoveSchemeProposalEventResult.md)*  =  this.createEventFetcherFactory<RemoveSchemeProposalEventResult>("RemoveSchemeProposal")

*Defined in [wrappers/schemeregistrar.ts:24](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L24)*





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

**●  frendlyName**:  *`string`*  = "Scheme Registrar"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[frendlyName](ContractWrapperBase.md#frendlyName)*

*Defined in [wrappers/schemeregistrar.ts:17](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L17)*





___

<a id="name"></a>

###  name

**●  name**:  *`string`*  = "SchemeRegistrar"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[name](ContractWrapperBase.md#name)*

*Defined in [wrappers/schemeregistrar.ts:16](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L16)*





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

*Defined in [wrappers/schemeregistrar.ts:145](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L145)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | [SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)   |  - |





**Returns:** [SchemePermissions](../enums/SchemePermissions.md)





___

<a id="getParameters"></a>

###  getParameters

► **getParameters**(paramsHash: *[Hash](../#Hash)*): `Promise`.<[StandardSchemeParams](../interfaces/StandardSchemeParams.md)>



*Overrides [ContractWrapperBase](ContractWrapperBase.md).[getParameters](ContractWrapperBase.md#getParameters)*

*Defined in [wrappers/schemeregistrar.ts:158](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L158)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#Hash)   |  - |





**Returns:** `Promise`.<[StandardSchemeParams](../interfaces/StandardSchemeParams.md)>





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

<a id="getSchemeParameters"></a>

###  getSchemeParameters

► **getSchemeParameters**(avatarAddress: *[Address](../#Address)*): `Promise`.<[StandardSchemeParams](../interfaces/StandardSchemeParams.md)>



*Implementation of [SchemeWrapper](../interfaces/SchemeWrapper.md).[getSchemeParameters](../interfaces/SchemeWrapper.md#getSchemeParameters)*

*Defined in [wrappers/schemeregistrar.ts:154](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L154)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[StandardSchemeParams](../interfaces/StandardSchemeParams.md)>





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

*Defined in [wrappers/schemeregistrar.ts:150](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L150)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[SchemePermissions](../enums/SchemePermissions.md)>





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

<a id="proposeToAddModifyScheme"></a>

###  proposeToAddModifyScheme

► **proposeToAddModifyScheme**(opts?: *[ProposeToAddModifySchemeParams](../interfaces/ProposeToAddModifySchemeParams.md)*): `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>



*Defined in [wrappers/schemeregistrar.ts:39](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L39)*



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



*Defined in [wrappers/schemeregistrar.ts:105](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L105)*



**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeToRemoveSchemeParams](../interfaces/ProposeToRemoveSchemeParams.md)  |  {} as ProposeToRemoveSchemeParams |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>





___

<a id="setParameters"></a>

###  setParameters

► **setParameters**(params: *[StandardSchemeParams](../interfaces/StandardSchemeParams.md)*): `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>



*Overrides [ContractWrapperBase](ContractWrapperBase.md).[setParameters](ContractWrapperBase.md#setParameters)*

*Defined in [wrappers/schemeregistrar.ts:137](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/schemeregistrar.ts#L137)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [StandardSchemeParams](../interfaces/StandardSchemeParams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___


