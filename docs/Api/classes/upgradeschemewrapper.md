[@DAOstack/Arc.js API Reference](../README.md) > [UpgradeSchemeWrapper](../classes/upgradeschemewrapper.md)



# Class: UpgradeSchemeWrapper

## Hierarchy


 [ExtendTruffleContract](extendtrufflecontract.md)

**↳ UpgradeSchemeWrapper**







## Index

### Constructors

* [constructor](upgradeschemewrapper.md#constructor)


### Properties

* [ChangeUpgradeSchemeProposal](upgradeschemewrapper.md#changeupgradeschemeproposal)
* [NewUpgradeProposal](upgradeschemewrapper.md#newupgradeproposal)
* [ProposalDeleted](upgradeschemewrapper.md#proposaldeleted)
* [ProposalExecuted](upgradeschemewrapper.md#proposalexecuted)
* [contract](upgradeschemewrapper.md#contract)


### Accessors

* [address](upgradeschemewrapper.md#address)


### Methods

* [getDefaultPermissions](upgradeschemewrapper.md#getdefaultpermissions)
* [getParameters](upgradeschemewrapper.md#getparameters)
* [getParametersArray](upgradeschemewrapper.md#getparametersarray)
* [getSchemeParameters](upgradeschemewrapper.md#getschemeparameters)
* [getSchemeParametersHash](upgradeschemewrapper.md#getschemeparametershash)
* [hydrateFromAt](upgradeschemewrapper.md#hydratefromat)
* [hydrateFromDeployed](upgradeschemewrapper.md#hydratefromdeployed)
* [hydrateFromNew](upgradeschemewrapper.md#hydratefromnew)
* [proposeController](upgradeschemewrapper.md#proposecontroller)
* [proposeUpgradingScheme](upgradeschemewrapper.md#proposeupgradingscheme)
* [setParameters](upgradeschemewrapper.md#setparameters)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new UpgradeSchemeWrapper**(solidityContract: *`any`*): [UpgradeSchemeWrapper](upgradeschemewrapper.md)


*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[constructor](extendtrufflecontract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [UpgradeSchemeWrapper](upgradeschemewrapper.md)

---


## Properties
<a id="changeupgradeschemeproposal"></a>

###  ChangeUpgradeSchemeProposal

**●  ChangeUpgradeSchemeProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[ChangeUpgradeSchemeProposalEventResult](../interfaces/changeupgradeschemeproposaleventresult.md)*  =  this.createEventFetcherFactory<ChangeUpgradeSchemeProposalEventResult>("ChangeUpgradeSchemeProposal")

*Defined in [contracts/upgradescheme.ts:23](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/upgradescheme.ts#L23)*





___

<a id="newupgradeproposal"></a>

###  NewUpgradeProposal

**●  NewUpgradeProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[NewUpgradeProposalEventResult](../interfaces/newupgradeproposaleventresult.md)*  =  this.createEventFetcherFactory<NewUpgradeProposalEventResult>("NewUpgradeProposal")

*Defined in [contracts/upgradescheme.ts:22](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/upgradescheme.ts#L22)*



Events




___

<a id="proposaldeleted"></a>

###  ProposalDeleted

**●  ProposalDeleted**:  *[EventFetcherFactory](../#eventfetcherfactory)[ProposalDeletedEventResult](../interfaces/proposaldeletedeventresult.md)*  =  this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted")

*Defined in [contracts/upgradescheme.ts:25](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/upgradescheme.ts#L25)*





___

<a id="proposalexecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#eventfetcherfactory)[ProposalExecutedEventResult](../interfaces/proposalexecutedeventresult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [contracts/upgradescheme.ts:24](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/upgradescheme.ts#L24)*





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
<a id="getdefaultpermissions"></a>

###  getDefaultPermissions

► **getDefaultPermissions**(overrideValue?: *`string`*): `string`



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[getDefaultPermissions](extendtrufflecontract.md#getdefaultpermissions)*

*Defined in [contracts/upgradescheme.ts:118](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/upgradescheme.ts#L118)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | `string`   |  - |





**Returns:** `string`





___

<a id="getparameters"></a>

###  getParameters

► **getParameters**(paramsHash: *[Hash](../#hash)*): `Promise`.<[StandardSchemeParams](../interfaces/standardschemeparams.md)>



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[getParameters](extendtrufflecontract.md#getparameters)*

*Defined in [contracts/upgradescheme.ts:126](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/upgradescheme.ts#L126)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paramsHash | [Hash](../#hash)   |  - |





**Returns:** `Promise`.<[StandardSchemeParams](../interfaces/standardschemeparams.md)>





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

<a id="getschemeparameters"></a>

###  getSchemeParameters

► **getSchemeParameters**(avatarAddress: *[Address](../#address)*): `Promise`.<[StandardSchemeParams](../interfaces/standardschemeparams.md)>



*Defined in [contracts/upgradescheme.ts:122](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/upgradescheme.ts#L122)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#address)   |  - |





**Returns:** `Promise`.<[StandardSchemeParams](../interfaces/standardschemeparams.md)>





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

<a id="proposecontroller"></a>

###  proposeController

► **proposeController**(opts?: *[ProposeControllerParams](../interfaces/proposecontrollerparams.md)*): `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>



*Defined in [contracts/upgradescheme.ts:31](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/upgradescheme.ts#L31)*



proposeController


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeControllerParams](../interfaces/proposecontrollerparams.md)  |  {} as ProposeControllerParams |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>





___

<a id="proposeupgradingscheme"></a>

###  proposeUpgradingScheme

► **proposeUpgradingScheme**(opts?: *[ProposeUpgradingSchemeParams](../interfaces/proposeupgradingschemeparams.md)*): `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>



*Defined in [contracts/upgradescheme.ts:66](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/upgradescheme.ts#L66)*



proposeUpgradingScheme


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeUpgradingSchemeParams](../interfaces/proposeupgradingschemeparams.md)  |  {} as ProposeUpgradingSchemeParams |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>





___

<a id="setparameters"></a>

###  setParameters

► **setParameters**(params: *[StandardSchemeParams](../interfaces/standardschemeparams.md)*): `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[setParameters](extendtrufflecontract.md#setparameters)*

*Defined in [contracts/upgradescheme.ts:111](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/upgradescheme.ts#L111)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [StandardSchemeParams](../interfaces/standardschemeparams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>





___


