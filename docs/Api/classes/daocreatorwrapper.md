[@DAOstack/Arc.js API Reference](../README.md) > [DaoCreatorWrapper](../classes/daocreatorwrapper.md)



# Class: DaoCreatorWrapper

## Hierarchy


 [ExtendTruffleContract](extendtrufflecontract.md)

**↳ DaoCreatorWrapper**







## Index

### Constructors

* [constructor](daocreatorwrapper.md#constructor)


### Properties

* [InitialSchemesSet](daocreatorwrapper.md#initialschemesset)
* [NewOrg](daocreatorwrapper.md#neworg)
* [contract](daocreatorwrapper.md#contract)


### Accessors

* [address](daocreatorwrapper.md#address)


### Methods

* [forgeOrg](daocreatorwrapper.md#forgeorg)
* [getDefaultPermissions](daocreatorwrapper.md#getdefaultpermissions)
* [getParameters](daocreatorwrapper.md#getparameters)
* [getParametersArray](daocreatorwrapper.md#getparametersarray)
* [getSchemeParametersHash](daocreatorwrapper.md#getschemeparametershash)
* [hydrateFromAt](daocreatorwrapper.md#hydratefromat)
* [hydrateFromDeployed](daocreatorwrapper.md#hydratefromdeployed)
* [hydrateFromNew](daocreatorwrapper.md#hydratefromnew)
* [setParameters](daocreatorwrapper.md#setparameters)
* [setSchemes](daocreatorwrapper.md#setschemes)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new DaoCreatorWrapper**(solidityContract: *`any`*): [DaoCreatorWrapper](daocreatorwrapper.md)


*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[constructor](extendtrufflecontract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [DaoCreatorWrapper](daocreatorwrapper.md)

---


## Properties
<a id="initialschemesset"></a>

###  InitialSchemesSet

**●  InitialSchemesSet**:  *[EventFetcherFactory](../#eventfetcherfactory)[InitialSchemesSetEventResult](../interfaces/initialschemesseteventresult.md)*  =  this.createEventFetcherFactory<InitialSchemesSetEventResult>("InitialSchemesSet")

*Defined in [contracts/daocreator.ts:25](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L25)*





___

<a id="neworg"></a>

###  NewOrg

**●  NewOrg**:  *[EventFetcherFactory](../#eventfetcherfactory)[NewOrgEventResult](../interfaces/neworgeventresult.md)*  =  this.createEventFetcherFactory<NewOrgEventResult>("NewOrg")

*Defined in [contracts/daocreator.ts:24](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L24)*



Events




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
<a id="forgeorg"></a>

###  forgeOrg

► **forgeOrg**(opts?: *[ForgeOrgConfig](../interfaces/forgeorgconfig.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/daocreator.ts:32](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L32)*



Create a new DAO


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ForgeOrgConfig](../interfaces/forgeorgconfig.md)  |  {} as ForgeOrgConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>





___

<a id="getdefaultpermissions"></a>

###  getDefaultPermissions

► **getDefaultPermissions**(overrideValue?: *`string`*): `string`



*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[getDefaultPermissions](extendtrufflecontract.md#getdefaultpermissions)*

*Defined in [ExtendTruffleContract.ts:98](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L98)*



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



*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[getParameters](extendtrufflecontract.md#getparameters)*

*Defined in [ExtendTruffleContract.ts:106](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L106)*



Given a hash, return the associated parameters as an object.


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

*Defined in [ExtendTruffleContract.ts:124](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L124)*



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

<a id="setparameters"></a>

###  setParameters

► **setParameters**(...args: *`Array`.<`any`>*): `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>



*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[setParameters](extendtrufflecontract.md#setparameters)*

*Defined in [ExtendTruffleContract.ts:89](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L89)*



Call setParameters on this contract. Returns promise of ArcTransactionDataResult <hash>where Result is the parameters hash.</hash>


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| args | `Array`.<`any`>   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>





___

<a id="setschemes"></a>

###  setSchemes

► **setSchemes**(opts?: *[SetSchemesConfig](../interfaces/setschemesconfig.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/daocreator.ts:88](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L88)*



Register schemes with newly-created DAO. Can only be invoked by the agent that created the DAO via forgeOrg, and at that, can only be called one time.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [SetSchemesConfig](../interfaces/setschemesconfig.md)  |  {} as SetSchemesConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>





___


