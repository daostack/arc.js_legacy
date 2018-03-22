[API Reference](../README.md) > [DaoCreatorWrapper](../classes/DaoCreatorWrapper.md)



# Class: DaoCreatorWrapper

## Hierarchy


 [ContractWrapperBase](ContractWrapperBase.md)

**↳ DaoCreatorWrapper**







## Index

### Constructors

* [constructor](DaoCreatorWrapper.md#constructor)


### Properties

* [InitialSchemesSet](DaoCreatorWrapper.md#InitialSchemesSet)
* [NewOrg](DaoCreatorWrapper.md#NewOrg)
* [contract](DaoCreatorWrapper.md#contract)
* [frendlyName](DaoCreatorWrapper.md#frendlyName)
* [name](DaoCreatorWrapper.md#name)


### Accessors

* [address](DaoCreatorWrapper.md#address)


### Methods

* [forgeOrg](DaoCreatorWrapper.md#forgeOrg)
* [getController](DaoCreatorWrapper.md#getController)
* [getParameters](DaoCreatorWrapper.md#getParameters)
* [getParametersArray](DaoCreatorWrapper.md#getParametersArray)
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


*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[constructor](ContractWrapperBase.md#constructor)*

*Defined in [contractWrapperBase.ts:37](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L37)*



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

*Defined in [wrappers/daocreator.ts:27](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L27)*





___

<a id="NewOrg"></a>

###  NewOrg

**●  NewOrg**:  *[EventFetcherFactory](../#EventFetcherFactory)[NewOrgEventResult](../interfaces/NewOrgEventResult.md)*  =  this.createEventFetcherFactory<NewOrgEventResult>("NewOrg")

*Defined in [wrappers/daocreator.ts:26](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L26)*



Events




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

**●  frendlyName**:  *`string`*  = "Dao Creator"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[frendlyName](ContractWrapperBase.md#frendlyName)*

*Defined in [wrappers/daocreator.ts:20](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L20)*





___

<a id="name"></a>

###  name

**●  name**:  *`string`*  = "DaoCreator"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[name](ContractWrapperBase.md#name)*

*Defined in [wrappers/daocreator.ts:19](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L19)*





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
<a id="forgeOrg"></a>

###  forgeOrg

► **forgeOrg**(opts?: *[ForgeOrgConfig](../interfaces/ForgeOrgConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/daocreator.ts:34](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L34)*



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



*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[getParameters](ContractWrapperBase.md#getParameters)*

*Defined in [contractWrapperBase.ts:110](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L110)*



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

► **setParameters**(...args: *`Array`.<`any`>*): `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>



*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[setParameters](ContractWrapperBase.md#setParameters)*

*Defined in [contractWrapperBase.ts:100](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L100)*



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



*Defined in [wrappers/daocreator.ts:101](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L101)*



Register schemes with newly-created DAO. Can only be invoked by the agent that created the DAO via forgeOrg, and at that, can only be called one time.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [SetSchemesConfig](../interfaces/SetSchemesConfig.md)  |  {} as SetSchemesConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>





___


