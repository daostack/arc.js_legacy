[API Reference](../README.md) > [TokenCapGCWrapper](../classes/TokenCapGCWrapper.md)



# Class: TokenCapGCWrapper

## Hierarchy


 [ContractWrapperBase](ContractWrapperBase.md)

**↳ TokenCapGCWrapper**







## Index

### Constructors

* [constructor](TokenCapGCWrapper.md#constructor)


### Properties

* [contract](TokenCapGCWrapper.md#contract)
* [frendlyName](TokenCapGCWrapper.md#frendlyName)
* [name](TokenCapGCWrapper.md#name)


### Accessors

* [address](TokenCapGCWrapper.md#address)


### Methods

* [getController](TokenCapGCWrapper.md#getController)
* [getParameters](TokenCapGCWrapper.md#getParameters)
* [getParametersArray](TokenCapGCWrapper.md#getParametersArray)
* [getSchemeParametersHash](TokenCapGCWrapper.md#getSchemeParametersHash)
* [hydrateFromAt](TokenCapGCWrapper.md#hydrateFromAt)
* [hydrateFromDeployed](TokenCapGCWrapper.md#hydrateFromDeployed)
* [hydrateFromNew](TokenCapGCWrapper.md#hydrateFromNew)
* [setParameters](TokenCapGCWrapper.md#setParameters)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new TokenCapGCWrapper**(solidityContract: *`any`*): [TokenCapGCWrapper](TokenCapGCWrapper.md)


*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[constructor](ContractWrapperBase.md#constructor)*

*Defined in [contractWrapperBase.ts:37](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L37)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [TokenCapGCWrapper](TokenCapGCWrapper.md)

---


## Properties
<a id="contract"></a>

###  contract

**●  contract**:  *`any`* 

*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[contract](ContractWrapperBase.md#contract)*

*Defined in [contractWrapperBase.ts:37](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L37)*



The underlying truffle contract object. Use this to access parts of the contract that aren't accessible via the wrapper.




___

<a id="frendlyName"></a>

###  frendlyName

**●  frendlyName**:  *`string`*  = "Token Cap Global Constraint"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[frendlyName](ContractWrapperBase.md#frendlyName)*

*Defined in [wrappers/tokenCapGC.ts:12](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/tokenCapGC.ts#L12)*





___

<a id="name"></a>

###  name

**●  name**:  *`string`*  = "TokenCapGC"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[name](ContractWrapperBase.md#name)*

*Defined in [wrappers/tokenCapGC.ts:11](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/tokenCapGC.ts#L11)*





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

► **setParameters**(params: *[TokenCapGcParams](../interfaces/TokenCapGcParams.md)*): `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>



*Overrides [ContractWrapperBase](ContractWrapperBase.md).[setParameters](ContractWrapperBase.md#setParameters)*

*Defined in [wrappers/tokenCapGC.ts:14](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/tokenCapGC.ts#L14)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [TokenCapGcParams](../interfaces/TokenCapGcParams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___


