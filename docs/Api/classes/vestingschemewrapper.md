[API Reference](../README.md) > [VestingSchemeWrapper](../classes/VestingSchemeWrapper.md)



# Class: VestingSchemeWrapper

## Hierarchy


 [ExtendTruffleContract](ExtendTruffleContract.md)

**↳ VestingSchemeWrapper**







## Index

### Constructors

* [constructor](VestingSchemeWrapper.md#constructor)


### Properties

* [AgreementCancel](VestingSchemeWrapper.md#AgreementCancel)
* [AgreementProposal](VestingSchemeWrapper.md#AgreementProposal)
* [Collect](VestingSchemeWrapper.md#Collect)
* [NewVestedAgreement](VestingSchemeWrapper.md#NewVestedAgreement)
* [ProposalExecuted](VestingSchemeWrapper.md#ProposalExecuted)
* [RevokeSignToCancelAgreement](VestingSchemeWrapper.md#RevokeSignToCancelAgreement)
* [SignToCancelAgreement](VestingSchemeWrapper.md#SignToCancelAgreement)
* [contract](VestingSchemeWrapper.md#contract)


### Accessors

* [address](VestingSchemeWrapper.md#address)


### Methods

* [collect](VestingSchemeWrapper.md#collect)
* [create](VestingSchemeWrapper.md#create)
* [getAgreements](VestingSchemeWrapper.md#getAgreements)
* [getController](VestingSchemeWrapper.md#getController)
* [getDefaultPermissions](VestingSchemeWrapper.md#getDefaultPermissions)
* [getParameters](VestingSchemeWrapper.md#getParameters)
* [getParametersArray](VestingSchemeWrapper.md#getParametersArray)
* [getPermissions](VestingSchemeWrapper.md#getPermissions)
* [getSchemeParameters](VestingSchemeWrapper.md#getSchemeParameters)
* [getSchemeParametersHash](VestingSchemeWrapper.md#getSchemeParametersHash)
* [hydrateFromAt](VestingSchemeWrapper.md#hydrateFromAt)
* [hydrateFromDeployed](VestingSchemeWrapper.md#hydrateFromDeployed)
* [hydrateFromNew](VestingSchemeWrapper.md#hydrateFromNew)
* [propose](VestingSchemeWrapper.md#propose)
* [revokeSignToCancel](VestingSchemeWrapper.md#revokeSignToCancel)
* [setParameters](VestingSchemeWrapper.md#setParameters)
* [signToCancel](VestingSchemeWrapper.md#signToCancel)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new VestingSchemeWrapper**(solidityContract: *`any`*): [VestingSchemeWrapper](VestingSchemeWrapper.md)


*Inherited from [ExtendTruffleContract](ExtendTruffleContract.md).[constructor](ExtendTruffleContract.md#constructor)*

*Defined in [ExtendTruffleContract.ts:26](https://github.com/daostack/arc.js/blob/616f6e7/lib/ExtendTruffleContract.ts#L26)*



ContractWrapperFactory constructs this


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| solidityContract | `any`   |  The json contract truffle artifact |





**Returns:** [VestingSchemeWrapper](VestingSchemeWrapper.md)

---


## Properties
<a id="AgreementCancel"></a>

###  AgreementCancel

**●  AgreementCancel**:  *[EventFetcherFactory](../#EventFetcherFactory)[AgreementCancelEventResult](../interfaces/AgreementCancelEventResult.md)*  =  this.createEventFetcherFactory<AgreementCancelEventResult>("AgreementCancel")

*Defined in [contracts/vestingscheme.ts:32](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L32)*





___

<a id="AgreementProposal"></a>

###  AgreementProposal

**●  AgreementProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[AgreementProposalEventResult](../interfaces/AgreementProposalEventResult.md)*  =  this.createEventFetcherFactory<AgreementProposalEventResult>("AgreementProposal")

*Defined in [contracts/vestingscheme.ts:28](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L28)*





___

<a id="Collect"></a>

###  Collect

**●  Collect**:  *[EventFetcherFactory](../#EventFetcherFactory)[CollectEventResult](../interfaces/CollectEventResult.md)*  =  this.createEventFetcherFactory<CollectEventResult>("Collect")

*Defined in [contracts/vestingscheme.ts:33](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L33)*





___

<a id="NewVestedAgreement"></a>

###  NewVestedAgreement

**●  NewVestedAgreement**:  *[EventFetcherFactory](../#EventFetcherFactory)[NewVestedAgreementEventResult](../interfaces/NewVestedAgreementEventResult.md)*  =  this.createEventFetcherFactory<NewVestedAgreementEventResult>("NewVestedAgreement")

*Defined in [contracts/vestingscheme.ts:29](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L29)*





___

<a id="ProposalExecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalExecutedEventResult](../interfaces/ProposalExecutedEventResult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [contracts/vestingscheme.ts:27](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L27)*



Events




___

<a id="RevokeSignToCancelAgreement"></a>

###  RevokeSignToCancelAgreement

**●  RevokeSignToCancelAgreement**:  *[EventFetcherFactory](../#EventFetcherFactory)[RevokeSignToCancelAgreementEventResult](../interfaces/RevokeSignToCancelAgreementEventResult.md)*  =  this.createEventFetcherFactory<RevokeSignToCancelAgreementEventResult>("RevokeSignToCancelAgreement")

*Defined in [contracts/vestingscheme.ts:31](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L31)*





___

<a id="SignToCancelAgreement"></a>

###  SignToCancelAgreement

**●  SignToCancelAgreement**:  *[EventFetcherFactory](../#EventFetcherFactory)[SignToCancelAgreementEventResult](../interfaces/SignToCancelAgreementEventResult.md)*  =  this.createEventFetcherFactory<SignToCancelAgreementEventResult>("SignToCancelAgreement")

*Defined in [contracts/vestingscheme.ts:30](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L30)*





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
<a id="collect"></a>

###  collect

► **collect**(opts?: *[CollectVestingAgreementConfig](../interfaces/CollectVestingAgreementConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [contracts/vestingscheme.ts:185](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L185)*



Collects for a beneficiary, according to the agreement


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [CollectVestingAgreementConfig](../interfaces/CollectVestingAgreementConfig.md)  |  {} as CollectVestingAgreementConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>





___

<a id="create"></a>

###  create

► **create**(opts?: *[CreateVestingAgreementConfig](../interfaces/CreateVestingAgreementConfig.md)*): `Promise`.<[ArcTransactionAgreementResult](ArcTransactionAgreementResult.md)>



*Defined in [contracts/vestingscheme.ts:91](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L91)*



Create a new vesting agreement


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [CreateVestingAgreementConfig](../interfaces/CreateVestingAgreementConfig.md)  |  {} as CreateVestingAgreementConfig |   - |





**Returns:** `Promise`.<[ArcTransactionAgreementResult](ArcTransactionAgreementResult.md)>





___

<a id="getAgreements"></a>

###  getAgreements

► **getAgreements**(opts?: *[GetAgreementParams](../interfaces/GetAgreementParams.md)*): `Promise`.<`Array`.<[Agreement](../interfaces/Agreement.md)>>



*Defined in [contracts/vestingscheme.ts:210](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L210)*



Return all agreements ever created by this scheme Filter by the optional agreementId.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [GetAgreementParams](../interfaces/GetAgreementParams.md)  |  {} as GetAgreementParams |   - |





**Returns:** `Promise`.<`Array`.<[Agreement](../interfaces/Agreement.md)>>





___

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

*Defined in [contracts/vestingscheme.ts:255](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L255)*



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

*Defined in [contracts/vestingscheme.ts:264](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L264)*



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



*Defined in [contracts/vestingscheme.ts:260](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L260)*



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

<a id="propose"></a>

###  propose

► **propose**(opts?: *[ProposeVestingAgreementConfig](../interfaces/ProposeVestingAgreementConfig.md)*): `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>



*Defined in [contracts/vestingscheme.ts:55](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L55)*



Propose a new vesting agreement


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [ProposeVestingAgreementConfig](../interfaces/ProposeVestingAgreementConfig.md)  |  {} as ProposeVestingAgreementConfig |   - |





**Returns:** `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>





___

<a id="revokeSignToCancel"></a>

###  revokeSignToCancel

► **revokeSignToCancel**(opts?: *[RevokeSignToCancelVestingAgreementConfig](../interfaces/RevokeSignToCancelVestingAgreementConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [contracts/vestingscheme.ts:160](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L160)*



Revoke vote for cancelling a vesting agreement


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [RevokeSignToCancelVestingAgreementConfig](../interfaces/RevokeSignToCancelVestingAgreementConfig.md)  |  {} as RevokeSignToCancelVestingAgreementConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>





___

<a id="setParameters"></a>

###  setParameters

► **setParameters**(params: *[StandardSchemeParams](../interfaces/StandardSchemeParams.md)*): `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>



*Overrides [ExtendTruffleContract](ExtendTruffleContract.md).[setParameters](ExtendTruffleContract.md#setParameters)*

*Defined in [contracts/vestingscheme.ts:248](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L248)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [StandardSchemeParams](../interfaces/StandardSchemeParams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___

<a id="signToCancel"></a>

###  signToCancel

► **signToCancel**(opts?: *[SignToCancelVestingAgreementConfig](../interfaces/SignToCancelVestingAgreementConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [contracts/vestingscheme.ts:135](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/vestingscheme.ts#L135)*



Sign to cancel a vesting agreement


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [SignToCancelVestingAgreementConfig](../interfaces/SignToCancelVestingAgreementConfig.md)  |  {} as SignToCancelVestingAgreementConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>





___


