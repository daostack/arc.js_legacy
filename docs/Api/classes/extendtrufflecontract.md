[@DAOstack/Arc.js API Reference](../README.md) > [ExtendTruffleContract](../classes/extendtrufflecontract.md)



# Class: ExtendTruffleContract


Abstract base class for all Arc contract wrapper classes

Example of how to define a wrapper:

import { ExtendTruffleContract } from "../ExtendTruffleContract"; import ContractWrapperFactory from "../ContractWrapperFactory";

export class AbsoluteVoteWrapper extends ExtendTruffleContract { [ wrapper properties and methods ] }

const AbsoluteVote = new ContractWrapperFactory("AbsoluteVote", AbsoluteVoteWrapper); export { AbsoluteVote };

## Hierarchy

**ExtendTruffleContract**

↳  [AbsoluteVoteWrapper](absolutevotewrapper.md)




↳  [ContributionRewardWrapper](contributionrewardwrapper.md)




↳  [DaoCreatorWrapper](daocreatorwrapper.md)




↳  [GenesisProtocolWrapper](genesisprotocolwrapper.md)




↳  [GlobalConstraintRegistrarWrapper](globalconstraintregistrarwrapper.md)




↳  [SchemeRegistrarWrapper](schemeregistrarwrapper.md)




↳  [TokenCapGCWrapper](tokencapgcwrapper.md)




↳  [UpgradeSchemeWrapper](upgradeschemewrapper.md)




↳  [VestingSchemeWrapper](vestingschemewrapper.md)




↳  [VoteInOrganizationSchemeWrapper](voteinorganizationschemewrapper.md)








## Index

### Constructors

* [constructor](extendtrufflecontract.md#constructor)


### Properties

* [contract](extendtrufflecontract.md#contract)
* [solidityContract](extendtrufflecontract.md#soliditycontract)


### Accessors

* [address](extendtrufflecontract.md#address)


### Methods

* [getDefaultPermissions](extendtrufflecontract.md#getdefaultpermissions)
* [getParameters](extendtrufflecontract.md#getparameters)
* [getParametersArray](extendtrufflecontract.md#getparametersarray)
* [getSchemeParametersHash](extendtrufflecontract.md#getschemeparametershash)
* [hydrateFromAt](extendtrufflecontract.md#hydratefromat)
* [hydrateFromDeployed](extendtrufflecontract.md#hydratefromdeployed)
* [hydrateFromNew](extendtrufflecontract.md#hydratefromnew)
* [setParameters](extendtrufflecontract.md#setparameters)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ExtendTruffleContract**(solidityContract: *`any`*): [ExtendTruffleContract](extendtrufflecontract.md)


*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [ExtendTruffleContract](extendtrufflecontract.md)

---


## Properties
<a id="contract"></a>

###  contract

**●  contract**:  *`any`* 

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L26)*



The underlying truffle contract object. Use this to access parts of the contract that aren't accessible via the wrapper.




___

<a id="soliditycontract"></a>

### «Private» solidityContract

**●  solidityContract**:  *`any`* 

*Defined in [ExtendTruffleContract.ts:32](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L32)*



The json contract truffle artifact




___


## Accessors
<a id="address"></a>

###  address


getaddress(): [Address](../#address)

*Defined in [ExtendTruffleContract.ts:128](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L128)*





**Returns:** [Address](../#address)



___


## Methods
<a id="getdefaultpermissions"></a>

###  getDefaultPermissions

► **getDefaultPermissions**(overrideValue?: *`string`*): `string`



*Defined in [ExtendTruffleContract.ts:98](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L98)*



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



*Defined in [ExtendTruffleContract.ts:106](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L106)*



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



*Defined in [ExtendTruffleContract.ts:124](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L124)*



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



*Defined in [ExtendTruffleContract.ts:71](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L71)*



Initialize as it was migrated by Arc.js on the current network.




**Returns:** `Promise`.<`any`>
this






___

<a id="hydratefromnew"></a>

###  hydrateFromNew

► **hydrateFromNew**(...rest: *`Array`.<`any`>*): `Promise`.<`any`>



*Defined in [ExtendTruffleContract.ts:40](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L40)*



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



*Defined in [ExtendTruffleContract.ts:89](https://github.com/daostack/arc.js/blob/6909d59/lib/ExtendTruffleContract.ts#L89)*



Call setParameters on this contract. Returns promise of ArcTransactionDataResult <hash>where Result is the parameters hash.</hash>


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| args | `Array`.<`any`>   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>





___


