[API Reference](../README.md) > [ExtendTruffleContract](../classes/ExtendTruffleContract.md)



# Class: ExtendTruffleContract


Abstract base class for all Arc contract wrapper classes

Example of how to define a wrapper:

import { ExtendTruffleContract } from "../ExtendTruffleContract"; import ContractWrapperFactory from "../ContractWrapperFactory";

export class AbsoluteVoteWrapper extends ExtendTruffleContract { [ wrapper properties and methods ] }

const AbsoluteVote = new ContractWrapperFactory("AbsoluteVote", AbsoluteVoteWrapper); export { AbsoluteVote };

## Hierarchy

**ExtendTruffleContract**

↳  [AbsoluteVoteWrapper](AbsoluteVoteWrapper.md)




↳  [ContributionRewardWrapper](ContributionRewardWrapper.md)




↳  [DaoCreatorWrapper](DaoCreatorWrapper.md)




↳  [GenesisProtocolWrapper](GenesisProtocolWrapper.md)




↳  [GlobalConstraintRegistrarWrapper](GlobalConstraintRegistrarWrapper.md)




↳  [SchemeRegistrarWrapper](SchemeRegistrarWrapper.md)




↳  [TokenCapGCWrapper](TokenCapGCWrapper.md)




↳  [UpgradeSchemeWrapper](UpgradeSchemeWrapper.md)




↳  [VestingSchemeWrapper](VestingSchemeWrapper.md)




↳  [VoteInOrganizationSchemeWrapper](VoteInOrganizationSchemeWrapper.md)








## Index

### Constructors

* [constructor](ExtendTruffleContract.md#constructor)


### Properties

* [contract](ExtendTruffleContract.md#contract)


### Accessors

* [address](ExtendTruffleContract.md#address)


### Methods

* [getController](ExtendTruffleContract.md#getController)
* [getDefaultPermissions](ExtendTruffleContract.md#getDefaultPermissions)
* [getParameters](ExtendTruffleContract.md#getParameters)
* [getParametersArray](ExtendTruffleContract.md#getParametersArray)
* [getPermissions](ExtendTruffleContract.md#getPermissions)
* [getSchemeParametersHash](ExtendTruffleContract.md#getSchemeParametersHash)
* [hydrateFromAt](ExtendTruffleContract.md#hydrateFromAt)
* [hydrateFromDeployed](ExtendTruffleContract.md#hydrateFromDeployed)
* [hydrateFromNew](ExtendTruffleContract.md#hydrateFromNew)
* [setParameters](ExtendTruffleContract.md#setParameters)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ExtendTruffleContract**(solidityContract: *`any`*): [ExtendTruffleContract](ExtendTruffleContract.md)


*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [ExtendTruffleContract](ExtendTruffleContract.md)

---


## Properties
<a id="contract"></a>

###  contract

**●  contract**:  *`any`* 

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L26)*



The underlying truffle contract object. Use this to access parts of the contract that aren't accessible via the wrapper.




___


## Accessors
<a id="address"></a>

###  address


getaddress(): [Address](../#Address)

*Defined in [ExtendTruffleContract.ts:148](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L148)*





**Returns:** [Address](../#Address)



___


## Methods
<a id="getController"></a>

###  getController

► **getController**(avatarAddress: *[Address](../#Address)*): `Promise`.<`any`>



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



*Defined in [ExtendTruffleContract.ts:98](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L98)*



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



*Defined in [ExtendTruffleContract.ts:117](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L117)*



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



*Defined in [ExtendTruffleContract.ts:106](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L106)*



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



*Defined in [ExtendTruffleContract.ts:71](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L71)*



Initialize as it was migrated by Arc.js on the current network.




**Returns:** `Promise`.<`any`>
this






___

<a id="hydrateFromNew"></a>

###  hydrateFromNew

► **hydrateFromNew**(...rest: *`Array`.<`any`>*): `Promise`.<`any`>



*Defined in [ExtendTruffleContract.ts:40](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L40)*



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



*Defined in [ExtendTruffleContract.ts:89](https://github.com/daostack/arc.js/blob/caacbb2/lib/ExtendTruffleContract.ts#L89)*



Call setParameters on this contract. Returns promise of ArcTransactionDataResult <hash>where Result is the parameters hash.</hash>


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| args | `Array`.<`any`>   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___


