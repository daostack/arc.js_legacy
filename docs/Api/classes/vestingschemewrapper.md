[@DAOstack/Arc.js API Reference](../README.md) > [VestingSchemeWrapper](../classes/vestingschemewrapper.md)



# Class: VestingSchemeWrapper

## Hierarchy


 [ExtendTruffleContract](extendtrufflecontract.md)

**↳ VestingSchemeWrapper**







## Index

### Constructors

* [constructor](vestingschemewrapper.md#constructor)


### Properties

* [AgreementCancel](vestingschemewrapper.md#agreementcancel)
* [AgreementProposal](vestingschemewrapper.md#agreementproposal)
* [Collect](vestingschemewrapper.md#collect)
* [NewVestedAgreement](vestingschemewrapper.md#newvestedagreement)
* [ProposalExecuted](vestingschemewrapper.md#proposalexecuted)
* [RevokeSignToCancelAgreement](vestingschemewrapper.md#revokesigntocancelagreement)
* [SignToCancelAgreement](vestingschemewrapper.md#signtocancelagreement)
* [contract](vestingschemewrapper.md#contract)


### Accessors

* [address](vestingschemewrapper.md#address)


### Methods

* [collect](vestingschemewrapper.md#collect-1)
* [create](vestingschemewrapper.md#create)
* [getAgreements](vestingschemewrapper.md#getagreements)
* [getDefaultPermissions](vestingschemewrapper.md#getdefaultpermissions)
* [getParameters](vestingschemewrapper.md#getparameters)
* [getParametersArray](vestingschemewrapper.md#getparametersarray)
* [getSchemeParameters](vestingschemewrapper.md#getschemeparameters)
* [getSchemeParametersHash](vestingschemewrapper.md#getschemeparametershash)
* [hydrateFromAt](vestingschemewrapper.md#hydratefromat)
* [hydrateFromDeployed](vestingschemewrapper.md#hydratefromdeployed)
* [hydrateFromNew](vestingschemewrapper.md#hydratefromnew)
* [propose](vestingschemewrapper.md#propose)
* [revokeSignToCancel](vestingschemewrapper.md#revokesigntocancel)
* [setParameters](vestingschemewrapper.md#setparameters)
* [signToCancel](vestingschemewrapper.md#signtocancel)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new VestingSchemeWrapper**(solidityContract: *`any`*): [VestingSchemeWrapper](vestingschemewrapper.md)


*Inherited from [ExtendTruffleContract](extendtrufflecontract.md).[constructor](extendtrufflecontract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/0fff6d4/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [VestingSchemeWrapper](vestingschemewrapper.md)

---


## Properties
<a id="agreementcancel"></a>

###  AgreementCancel

**●  AgreementCancel**:  *[EventFetcherFactory](../#eventfetcherfactory)[AgreementCancelEventResult](../interfaces/agreementcanceleventresult.md)*  =  this.createEventFetcherFactory<AgreementCancelEventResult>("AgreementCancel")

*Defined in [contracts/vestingscheme.ts:47](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L47)*





___

<a id="agreementproposal"></a>

###  AgreementProposal

**●  AgreementProposal**:  *[EventFetcherFactory](../#eventfetcherfactory)[AgreementProposalEventResult](../interfaces/agreementproposaleventresult.md)*  =  this.createEventFetcherFactory<AgreementProposalEventResult>("AgreementProposal")

*Defined in [contracts/vestingscheme.ts:43](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L43)*





___

<a id="collect"></a>

###  Collect

**●  Collect**:  *[EventFetcherFactory](../#eventfetcherfactory)[CollectEventResult](../interfaces/collecteventresult.md)*  =  this.createEventFetcherFactory<CollectEventResult>("Collect")

*Defined in [contracts/vestingscheme.ts:48](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L48)*





___

<a id="newvestedagreement"></a>

###  NewVestedAgreement

**●  NewVestedAgreement**:  *[EventFetcherFactory](../#eventfetcherfactory)[NewVestedAgreementEventResult](../interfaces/newvestedagreementeventresult.md)*  =  this.createEventFetcherFactory<NewVestedAgreementEventResult>("NewVestedAgreement")

*Defined in [contracts/vestingscheme.ts:44](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L44)*





___

<a id="proposalexecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#eventfetcherfactory)[ProposalExecutedEventResult](../interfaces/proposalexecutedeventresult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [contracts/vestingscheme.ts:42](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L42)*



Events




___

<a id="revokesigntocancelagreement"></a>

###  RevokeSignToCancelAgreement

**●  RevokeSignToCancelAgreement**:  *[EventFetcherFactory](../#eventfetcherfactory)[RevokeSignToCancelAgreementEventResult](../interfaces/revokesigntocancelagreementeventresult.md)*  =  this.createEventFetcherFactory<RevokeSignToCancelAgreementEventResult>("RevokeSignToCancelAgreement")

*Defined in [contracts/vestingscheme.ts:46](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L46)*





___

<a id="signtocancelagreement"></a>

###  SignToCancelAgreement

**●  SignToCancelAgreement**:  *[EventFetcherFactory](../#eventfetcherfactory)[SignToCancelAgreementEventResult](../interfaces/signtocancelagreementeventresult.md)*  =  this.createEventFetcherFactory<SignToCancelAgreementEventResult>("SignToCancelAgreement")

*Defined in [contracts/vestingscheme.ts:45](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L45)*





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
<a id="collect-1"></a>

###  collect

► **collect**(opts?: *[CollectVestingAgreementConfig](../interfaces/collectvestingagreementconfig.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/vestingscheme.ts:185](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L185)*



Collects for a beneficiary, according to the agreement


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [CollectVestingAgreementConfig](../interfaces/collectvestingagreementconfig.md)  |  {} as CollectVestingAgreementConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>





___

<a id="create"></a>

###  create

► **create**(opts?: *[CreateVestingAgreementConfig](../interfaces/createvestingagreementconfig.md)*): `Promise`.<[ArcTransactionAgreementResult](arctransactionagreementresult.md)>



*Defined in [contracts/vestingscheme.ts:91](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L91)*



Create a new vesting agreement


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [CreateVestingAgreementConfig](../interfaces/createvestingagreementconfig.md)  |  {} as CreateVestingAgreementConfig |   - |





**Returns:** `Promise`.<[ArcTransactionAgreementResult](arctransactionagreementresult.md)>





___

<a id="getagreements"></a>

###  getAgreements

► **getAgreements**(opts?: *[GetAgreementParams](../interfaces/getagreementparams.md)*): `Promise`.<`Array`.<[Agreement](../interfaces/agreement.md)>>



*Defined in [contracts/vestingscheme.ts:210](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L210)*



Return all agreements ever created by this scheme Filter by the optional agreementId.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetAgreementParams](../interfaces/getagreementparams.md)  |  {} as GetAgreementParams |   - |





**Returns:** `Promise`.<`Array`.<[Agreement](../interfaces/agreement.md)>>





___

<a id="getdefaultpermissions"></a>

###  getDefaultPermissions

► **getDefaultPermissions**(overrideValue?: *`string`*): `string`



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[getDefaultPermissions](extendtrufflecontract.md#getdefaultpermissions)*

*Defined in [contracts/vestingscheme.ts:255](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L255)*



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

*Defined in [contracts/vestingscheme.ts:263](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L263)*



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



*Defined in [contracts/vestingscheme.ts:259](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L259)*



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

<a id="propose"></a>

###  propose

► **propose**(opts?: *[ProposeVestingAgreementConfig](../interfaces/proposevestingagreementconfig.md)*): `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>



*Defined in [contracts/vestingscheme.ts:55](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L55)*



Propose a new vesting agreement


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeVestingAgreementConfig](../interfaces/proposevestingagreementconfig.md)  |  {} as ProposeVestingAgreementConfig |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](arctransactionproposalresult.md)>





___

<a id="revokesigntocancel"></a>

###  revokeSignToCancel

► **revokeSignToCancel**(opts?: *[RevokeSignToCancelVestingAgreementConfig](../interfaces/revokesigntocancelvestingagreementconfig.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/vestingscheme.ts:160](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L160)*



Revoke vote for cancelling a vesting agreement


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [RevokeSignToCancelVestingAgreementConfig](../interfaces/revokesigntocancelvestingagreementconfig.md)  |  {} as RevokeSignToCancelVestingAgreementConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>





___

<a id="setparameters"></a>

###  setParameters

► **setParameters**(params: *[StandardSchemeParams](../interfaces/standardschemeparams.md)*): `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>



*Overrides [ExtendTruffleContract](extendtrufflecontract.md).[setParameters](extendtrufflecontract.md#setparameters)*

*Defined in [contracts/vestingscheme.ts:248](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L248)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [StandardSchemeParams](../interfaces/standardschemeparams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](arctransactiondataresult.md)[Hash](../#hash)>





___

<a id="signtocancel"></a>

###  signToCancel

► **signToCancel**(opts?: *[SignToCancelVestingAgreementConfig](../interfaces/signtocancelvestingagreementconfig.md)*): `Promise`.<[ArcTransactionResult](arctransactionresult.md)>



*Defined in [contracts/vestingscheme.ts:135](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/vestingscheme.ts#L135)*



Sign to cancel a vesting agreement


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [SignToCancelVestingAgreementConfig](../interfaces/signtocancelvestingagreementconfig.md)  |  {} as SignToCancelVestingAgreementConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](arctransactionresult.md)>





___


