[API Reference](../README.md) > [DaoCreatorWrapper](../classes/DaoCreatorWrapper.md)



# Class: DaoCreatorWrapper

## Hierarchy


 [ExtendTruffleContract](ExtendTruffleContract.md)

**↳ DaoCreatorWrapper**







## Index

### Constructors

* [constructor](DaoCreatorWrapper.md#constructor)


### Properties

* [InitialSchemesSet](DaoCreatorWrapper.md#InitialSchemesSet)
* [NewOrg](DaoCreatorWrapper.md#NewOrg)
* [contract](DaoCreatorWrapper.md#contract)


### Accessors

* [address](DaoCreatorWrapper.md#address)


### Methods

* [forgeOrg](DaoCreatorWrapper.md#forgeOrg)
* [getController](DaoCreatorWrapper.md#getController)
* [getDefaultPermissions](DaoCreatorWrapper.md#getDefaultPermissions)
* [getParameters](DaoCreatorWrapper.md#getParameters)
* [getParametersArray](DaoCreatorWrapper.md#getParametersArray)
* [getPermissions](DaoCreatorWrapper.md#getPermissions)
* [getSchemeParametersHash](DaoCreatorWrapper.md#getSchemeParametersHash)
* [hydrateFromAt](DaoCreatorWrapper.md#hydrateFromAt)
* [hydrateFromDeployed](DaoCreatorWrapper.md#hydrateFromDeployed)
* [hydrateFromNew](DaoCreatorWrapper.md#hydrateFromNew)
* [setParameters](DaoCreatorWrapper.md#setParameters)
* [setSchemes](DaoCreatorWrapper.md#setSchemes)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new DaoCreatorWrapper**(solidityContract: *`any`*): [DaoCreatorWrapper](DaoCreatorWrapper.md)


*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[constructor](ExtendTruffleContract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [DaoCreatorWrapper](DaoCreatorWrapper.md)

---


## Properties
<a id="InitialSchemesSet"></a>

###  InitialSchemesSet

**●  InitialSchemesSet**:  *[EventFetcherFactory](../#EventFetcherFactory)[InitialSchemesSetEventResult](../interfaces/InitialSchemesSetEventResult.md)*  =  this.createEventFetcherFactory<InitialSchemesSetEventResult>("InitialSchemesSet")

*Defined in [contracts/daocreator.ts:25](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/daocreator.ts#L25)*





___

<a id="NewOrg"></a>

###  NewOrg

**●  NewOrg**:  *[EventFetcherFactory](../#EventFetcherFactory)[NewOrgEventResult](../interfaces/NewOrgEventResult.md)*  =  this.createEventFetcherFactory<NewOrgEventResult>("NewOrg")

*Defined in [contracts/daocreator.ts:24](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/daocreator.ts#L24)*



Events




___

<a id="contract"></a>

###  contract

**●  contract**:  *`any`* 

*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[contract](ExtendTruffleContract.md#contract)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L26)*



The underlying truffle contract object. Use this to access parts of the contract that aren't accessible via the wrapper.




___


## Accessors
<a id="address"></a>

###  address


getaddress(): [Address](../#Address)

*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[address](ExtendTruffleContract.md#address)*

*Defined in [ExtendTruffleContract.ts:148](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L148)*





**Returns:** [Address](../#Address)



___


## Methods
<a id="forgeOrg"></a>

###  forgeOrg

► **forgeOrg**(opts?: *[ForgeOrgConfig](../interfaces/ForgeOrgConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [contracts/daocreator.ts:32](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/daocreator.ts#L32)*



Create a new DAO


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ForgeOrgConfig](../interfaces/ForgeOrgConfig.md)  |  {} as ForgeOrgConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>





___

<a id="getController"></a>

###  getController

► **getController**(avatarAddress: *[Address](../#Address)*): `Promise`.<`any`>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[getController](ExtendTruffleContract.md#getController)*

*Defined in [ExtendTruffleContract.ts:143](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L143)*



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

*Defined in [ExtendTruffleContract.ts:98](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L98)*



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



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[getParameters](ExtendTruffleContract.md#getParameters)*

*Defined in [ExtendTruffleContract.ts:117](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L117)*



Given a hash, return the associated parameters as an object.


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

*Defined in [ExtendTruffleContract.ts:135](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L135)*



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

*Defined in [ExtendTruffleContract.ts:106](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L106)*



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

*Defined in [ExtendTruffleContract.ts:125](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L125)*



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

*Defined in [ExtendTruffleContract.ts:56](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L56)*



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

*Defined in [ExtendTruffleContract.ts:71](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L71)*



Initialize as it was migrated by Arc.js on the current network.




**Returns:** `Promise`.<`any`>
this






___

<a id="hydrateFromNew"></a>

###  hydrateFromNew

► **hydrateFromNew**(...rest: *`Array`.<`any`>*): `Promise`.<`any`>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[hydrateFromNew](ExtendTruffleContract.md#hydrateFromNew)*

*Defined in [ExtendTruffleContract.ts:40](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L40)*



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

► **setParameters**(...args: *`Array`.<`any`>*): `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[setParameters](ExtendTruffleContract.md#setParameters)*

*Defined in [ExtendTruffleContract.ts:89](https://github.com/daostack/arc.js/blob/61e5f90/lib/ExtendTruffleContract.ts#L89)*



Call setParameters on this contract. Returns promise of ArcTransactionDataResult <hash>where Result is the parameters hash.</hash>


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| args | `Array`.<`any`>   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___

<a id="setSchemes"></a>

###  setSchemes

► **setSchemes**(opts?: *[SetSchemesConfig](../interfaces/SetSchemesConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [contracts/daocreator.ts:99](https://github.com/daostack/arc.js/blob/61e5f90/lib/contracts/daocreator.ts#L99)*



Register schemes with newly-created DAO. Can only be invoked by the agent that created the DAO via forgeOrg, and at that, can only be called one time.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [SetSchemesConfig](../interfaces/SetSchemesConfig.md)  |  {} as SetSchemesConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>





___


