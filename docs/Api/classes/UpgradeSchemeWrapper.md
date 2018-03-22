[API Reference](../README.md) > [UpgradeSchemeWrapper](../classes/UpgradeSchemeWrapper.md)



# Class: UpgradeSchemeWrapper

## Hierarchy


 [ContractWrapperBase](ContractWrapperBase.md)

**↳ UpgradeSchemeWrapper**







## Implements

* [SchemeWrapper](../interfaces/SchemeWrapper.md)

## Index

### Constructors

* [constructor](UpgradeSchemeWrapper.md#constructor)


### Properties

* [ChangeUpgradeSchemeProposal](UpgradeSchemeWrapper.md#ChangeUpgradeSchemeProposal)
* [NewUpgradeProposal](UpgradeSchemeWrapper.md#NewUpgradeProposal)
* [ProposalDeleted](UpgradeSchemeWrapper.md#ProposalDeleted)
* [ProposalExecuted](UpgradeSchemeWrapper.md#ProposalExecuted)
* [contract](UpgradeSchemeWrapper.md#contract)
* [frendlyName](UpgradeSchemeWrapper.md#frendlyName)
* [name](UpgradeSchemeWrapper.md#name)


### Accessors

* [address](UpgradeSchemeWrapper.md#address)


### Methods

* [getController](UpgradeSchemeWrapper.md#getController)
* [getDefaultPermissions](UpgradeSchemeWrapper.md#getDefaultPermissions)
* [getParameters](UpgradeSchemeWrapper.md#getParameters)
* [getParametersArray](UpgradeSchemeWrapper.md#getParametersArray)
* [getSchemeParameters](UpgradeSchemeWrapper.md#getSchemeParameters)
* [getSchemeParametersHash](UpgradeSchemeWrapper.md#getSchemeParametersHash)
* [getSchemePermissions](UpgradeSchemeWrapper.md#getSchemePermissions)
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


*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[constructor](ContractWrapperBase.md#constructor)*

*Defined in [contractWrapperBase.ts:37](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L37)*



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

*Defined in [wrappers/upgradescheme.ts:25](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L25)*





___

<a id="NewUpgradeProposal"></a>

###  NewUpgradeProposal

**●  NewUpgradeProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[NewUpgradeProposalEventResult](../interfaces/NewUpgradeProposalEventResult.md)*  =  this.createEventFetcherFactory<NewUpgradeProposalEventResult>("NewUpgradeProposal")

*Defined in [wrappers/upgradescheme.ts:24](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L24)*



Events




___

<a id="ProposalDeleted"></a>

###  ProposalDeleted

**●  ProposalDeleted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalDeletedEventResult](../interfaces/ProposalDeletedEventResult.md)*  =  this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted")

*Defined in [wrappers/upgradescheme.ts:27](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L27)*





___

<a id="ProposalExecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalExecutedEventResult](../interfaces/ProposalExecutedEventResult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [wrappers/upgradescheme.ts:26](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L26)*





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

**●  frendlyName**:  *`string`*  = "Upgrade Scheme"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[frendlyName](ContractWrapperBase.md#frendlyName)*

*Defined in [wrappers/upgradescheme.ts:18](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L18)*





___

<a id="name"></a>

###  name

**●  name**:  *`string`*  = "UpgradeScheme"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[name](ContractWrapperBase.md#name)*

*Defined in [wrappers/upgradescheme.ts:17](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L17)*





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

*Defined in [wrappers/upgradescheme.ts:120](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L120)*



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

*Defined in [wrappers/upgradescheme.ts:133](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L133)*



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

*Defined in [wrappers/upgradescheme.ts:129](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L129)*



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

*Defined in [wrappers/upgradescheme.ts:125](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L125)*



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

<a id="proposeController"></a>

###  proposeController

► **proposeController**(opts?: *[ProposeControllerParams](../interfaces/ProposeControllerParams.md)*): `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>



*Defined in [wrappers/upgradescheme.ts:33](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L33)*



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



*Defined in [wrappers/upgradescheme.ts:68](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L68)*



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



*Overrides [ContractWrapperBase](ContractWrapperBase.md).[setParameters](ContractWrapperBase.md#setParameters)*

*Defined in [wrappers/upgradescheme.ts:113](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/upgradescheme.ts#L113)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [StandardSchemeParams](../interfaces/StandardSchemeParams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___


