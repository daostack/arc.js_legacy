[API Reference](../README.md) > [UpgradeSchemeWrapper](../classes/UpgradeSchemeWrapper.md)



# Class: UpgradeSchemeWrapper

## Hierarchy


 [ExtendTruffleContract](ExtendTruffleContract.md)

**↳ UpgradeSchemeWrapper**







## Index

### Constructors

* [constructor](UpgradeSchemeWrapper.md#constructor)


### Properties

* [ChangeUpgradeSchemeProposal](UpgradeSchemeWrapper.md#ChangeUpgradeSchemeProposal)
* [NewUpgradeProposal](UpgradeSchemeWrapper.md#NewUpgradeProposal)
* [ProposalDeleted](UpgradeSchemeWrapper.md#ProposalDeleted)
* [ProposalExecuted](UpgradeSchemeWrapper.md#ProposalExecuted)
* [contract](UpgradeSchemeWrapper.md#contract)


### Accessors

* [address](UpgradeSchemeWrapper.md#address)


### Methods

* [getController](UpgradeSchemeWrapper.md#getController)
* [getDefaultPermissions](UpgradeSchemeWrapper.md#getDefaultPermissions)
* [getParameters](UpgradeSchemeWrapper.md#getParameters)
* [getParametersArray](UpgradeSchemeWrapper.md#getParametersArray)
* [getPermissions](UpgradeSchemeWrapper.md#getPermissions)
* [getSchemeParameters](UpgradeSchemeWrapper.md#getSchemeParameters)
* [getSchemeParametersHash](UpgradeSchemeWrapper.md#getSchemeParametersHash)
* [hydrateFromAt](UpgradeSchemeWrapper.md#hydrateFromAt)
* [hydrateFromDeployed](UpgradeSchemeWrapper.md#hydrateFromDeployed)
* [hydrateFromNew](UpgradeSchemeWrapper.md#hydrateFromNew)
* [proposeController](UpgradeSchemeWrapper.md#proposeController)
* [proposeUpgradingScheme](UpgradeSchemeWrapper.md#proposeUpgradingScheme)
* [setParameters](UpgradeSchemeWrapper.md#setParameters)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new UpgradeSchemeWrapper**(solidityContract: *`any`*): [UpgradeSchemeWrapper](UpgradeSchemeWrapper.md)


*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[constructor](ExtendTruffleContract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [UpgradeSchemeWrapper](UpgradeSchemeWrapper.md)

---


## Properties
<a id="ChangeUpgradeSchemeProposal"></a>

###  ChangeUpgradeSchemeProposal

**●  ChangeUpgradeSchemeProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[ChangeUpgradeSchemeProposalEventResult](../interfaces/ChangeUpgradeSchemeProposalEventResult.md)*  =  this.createEventFetcherFactory<ChangeUpgradeSchemeProposalEventResult>("ChangeUpgradeSchemeProposal")

*Defined in [contracts/upgradescheme.ts:23](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/upgradescheme.ts#L23)*





___

<a id="NewUpgradeProposal"></a>

###  NewUpgradeProposal

**●  NewUpgradeProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[NewUpgradeProposalEventResult](../interfaces/NewUpgradeProposalEventResult.md)*  =  this.createEventFetcherFactory<NewUpgradeProposalEventResult>("NewUpgradeProposal")

*Defined in [contracts/upgradescheme.ts:22](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/upgradescheme.ts#L22)*



Events




___

<a id="ProposalDeleted"></a>

###  ProposalDeleted

**●  ProposalDeleted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalDeletedEventResult](../interfaces/ProposalDeletedEventResult.md)*  =  this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted")

*Defined in [contracts/upgradescheme.ts:25](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/upgradescheme.ts#L25)*





___

<a id="ProposalExecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalExecutedEventResult](../interfaces/ProposalExecutedEventResult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [contracts/upgradescheme.ts:24](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/upgradescheme.ts#L24)*





___

<a id="contract"></a>

###  contract

**●  contract**:  *`any`* 

*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[contract](ExtendTruffleContract.md#contract)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L26)*



The underlying truffle contract object. Use this to access parts of the contract that aren't accessible via the wrapper.




___


## Accessors
<a id="address"></a>

###  address


getaddress(): [Address](../#Address)

*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[address](ExtendTruffleContract.md#address)*

*Defined in [ExtendTruffleContract.ts:148](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L148)*





**Returns:** [Address](../#Address)



___


## Methods
<a id="getController"></a>

###  getController

► **getController**(avatarAddress: *[Address](../#Address)*): `Promise`.<`any`>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[getController](ExtendTruffleContract.md#getController)*

*Defined in [ExtendTruffleContract.ts:143](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L143)*



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

*Defined in [contracts/upgradescheme.ts:118](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/upgradescheme.ts#L118)*



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

*Defined in [contracts/upgradescheme.ts:127](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/upgradescheme.ts#L127)*



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

*Defined in [ExtendTruffleContract.ts:135](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L135)*



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

*Defined in [ExtendTruffleContract.ts:106](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L106)*



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



*Defined in [contracts/upgradescheme.ts:123](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/upgradescheme.ts#L123)*



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

*Defined in [ExtendTruffleContract.ts:125](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L125)*



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

*Defined in [ExtendTruffleContract.ts:56](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L56)*



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

*Defined in [ExtendTruffleContract.ts:71](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L71)*



Initialize as it was migrated by Arc.js on the current network.




**Returns:** `Promise`.<`any`>
this






___

<a id="hydrateFromNew"></a>

###  hydrateFromNew

► **hydrateFromNew**(...rest: *`Array`.<`any`>*): `Promise`.<`any`>



*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[hydrateFromNew](ExtendTruffleContract.md#hydrateFromNew)*

*Defined in [ExtendTruffleContract.ts:40](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L40)*



Initialize from a newly-migrated instance. This will migrate a new instance of the contract to the net.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| rest | `Array`.<`any`>   |  - |





**Returns:** `Promise`.<`any`>
this






___

<a id="proposeController"></a>

###  proposeController

► **proposeController**(opts?: *[ProposeControllerParams](../interfaces/ProposeControllerParams.md)*): `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>



*Defined in [contracts/upgradescheme.ts:31](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/upgradescheme.ts#L31)*



proposeController


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeControllerParams](../interfaces/ProposeControllerParams.md)  |  {} as ProposeControllerParams |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>





___

<a id="proposeUpgradingScheme"></a>

###  proposeUpgradingScheme

► **proposeUpgradingScheme**(opts?: *[ProposeUpgradingSchemeParams](../interfaces/ProposeUpgradingSchemeParams.md)*): `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>



*Defined in [contracts/upgradescheme.ts:66](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/upgradescheme.ts#L66)*



proposeUpgradingScheme


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeUpgradingSchemeParams](../interfaces/ProposeUpgradingSchemeParams.md)  |  {} as ProposeUpgradingSchemeParams |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>





___

<a id="setParameters"></a>

###  setParameters

► **setParameters**(params: *[StandardSchemeParams](../interfaces/StandardSchemeParams.md)*): `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>



*Overrides [ExtendTruffleContract](ExtendTruffleContract.md).[setParameters](ExtendTruffleContract.md#setParameters)*

*Defined in [contracts/upgradescheme.ts:111](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/upgradescheme.ts#L111)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [StandardSchemeParams](../interfaces/StandardSchemeParams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___


