[API Reference](../README.md) > [ContractWrapperBase](../classes/ContractWrapperBase.md)



# Class: ContractWrapperBase


Abstract base class for all Arc contract wrapper classes

Example of how to define a wrapper:

import { ContractWrapperBase } from "../contractWrapperBase"; import ContractWrapperFactory from "../contractWrapperFactory";

export class AbsoluteVoteWrapper extends ContractWrapperBase { [ wrapper properties and methods ] }

export const AbsoluteVote = new ContractWrapperFactory("AbsoluteVote", AbsoluteVoteWrapper);

## Hierarchy

**ContractWrapperBase**

↳  [AbsoluteVoteWrapper](AbsoluteVoteWrapper.md)




↳  [ContributionRewardWrapper](ContributionRewardWrapper.md)




↳  [GenesisProtocolWrapper](GenesisProtocolWrapper.md)




↳  [GlobalConstraintRegistrarWrapper](GlobalConstraintRegistrarWrapper.md)




↳  [SchemeRegistrarWrapper](SchemeRegistrarWrapper.md)




↳  [TokenCapGCWrapper](TokenCapGCWrapper.md)




↳  [UpgradeSchemeWrapper](UpgradeSchemeWrapper.md)




↳  [VestingSchemeWrapper](VestingSchemeWrapper.md)




↳  [VoteInOrganizationSchemeWrapper](VoteInOrganizationSchemeWrapper.md)




↳  [DaoCreatorWrapper](DaoCreatorWrapper.md)








## Index

### Constructors

* [constructor](ContractWrapperBase.md#constructor)


### Properties

* [contract](ContractWrapperBase.md#contract)
* [frendlyName](ContractWrapperBase.md#frendlyName)
* [name](ContractWrapperBase.md#name)


### Accessors

* [address](ContractWrapperBase.md#address)


### Methods

* [getController](ContractWrapperBase.md#getController)
* [getParameters](ContractWrapperBase.md#getParameters)
* [getParametersArray](ContractWrapperBase.md#getParametersArray)
* [getSchemeParametersHash](ContractWrapperBase.md#getSchemeParametersHash)
* [hydrateFromAt](ContractWrapperBase.md#hydrateFromAt)
* [hydrateFromDeployed](ContractWrapperBase.md#hydrateFromDeployed)
* [hydrateFromNew](ContractWrapperBase.md#hydrateFromNew)
* [setParameters](ContractWrapperBase.md#setParameters)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ContractWrapperBase**(solidityContract: *`any`*): [ContractWrapperBase](ContractWrapperBase.md)


*Defined in [contractWrapperBase.ts:37](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L37)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [ContractWrapperBase](ContractWrapperBase.md)

---


## Properties
<a id="contract"></a>

###  contract

**●  contract**:  *`any`* 

*Defined in [contractWrapperBase.ts:37](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L37)*



The underlying truffle contract object. Use this to access parts of the contract that aren't accessible via the wrapper.




___

<a id="frendlyName"></a>

###  frendlyName

**●  frendlyName**:  *`string`*  = "[friendlyName property has not been overridden]"

*Defined in [contractWrapperBase.ts:28](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L28)*



A more friendly name for the contract.




___

<a id="name"></a>

###  name

**●  name**:  *`string`*  = "[name property has not been overridden]"

*Defined in [contractWrapperBase.ts:24](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L24)*



The name of the contract.




___


## Accessors
<a id="address"></a>

###  address


getaddress(): [Address](../#Address)

*Defined in [contractWrapperBase.ts:32](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L32)*



The address of the contract




**Returns:** [Address](../#Address)



___


## Methods
<a id="getController"></a>

###  getController

► **getController**(avatarAddress: *[Address](../#Address)*): `Promise`.<`any`>



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



*Defined in [contractWrapperBase.ts:82](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L82)*



Initialize as it was migrated by Arc.js on the current network.




**Returns:** `Promise`.<`any`>
this






___

<a id="hydrateFromNew"></a>

###  hydrateFromNew

► **hydrateFromNew**(...rest: *`Array`.<`any`>*): `Promise`.<`any`>



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



*Defined in [contractWrapperBase.ts:100](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L100)*



Call setParameters on this contract. Returns promise of ArcTransactionDataResult <hash>where Result is the parameters hash.</hash>


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| args | `Array`.<`any`>   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___


