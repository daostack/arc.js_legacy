[API Reference](../README.md) > [VestingSchemeWrapper](../classes/VestingSchemeWrapper.md)



# Class: VestingSchemeWrapper

## Hierarchy


 [ContractWrapperBase](ContractWrapperBase.md)

**↳ VestingSchemeWrapper**







## Implements

* [SchemeWrapper](../interfaces/SchemeWrapper.md)

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
* [frendlyName](VestingSchemeWrapper.md#frendlyName)
* [name](VestingSchemeWrapper.md#name)


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
* [getSchemeParameters](VestingSchemeWrapper.md#getSchemeParameters)
* [getSchemeParametersHash](VestingSchemeWrapper.md#getSchemeParametersHash)
* [getSchemePermissions](VestingSchemeWrapper.md#getSchemePermissions)
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


*Inherited from [ContractWrapperBase](ContractWrapperBase.md).[constructor](ContractWrapperBase.md#constructor)*

*Defined in [contractWrapperBase.ts:37](https://github.com/daostack/arc.js/blob/42de6847/lib/contractWrapperBase.ts#L37)*



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

*Defined in [wrappers/vestingscheme.ts:34](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L34)*





___

<a id="AgreementProposal"></a>

###  AgreementProposal

**●  AgreementProposal**:  *[EventFetcherFactory](../#EventFetcherFactory)[AgreementProposalEventResult](../interfaces/AgreementProposalEventResult.md)*  =  this.createEventFetcherFactory<AgreementProposalEventResult>("AgreementProposal")

*Defined in [wrappers/vestingscheme.ts:30](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L30)*





___

<a id="Collect"></a>

###  Collect

**●  Collect**:  *[EventFetcherFactory](../#EventFetcherFactory)[CollectEventResult](../interfaces/CollectEventResult.md)*  =  this.createEventFetcherFactory<CollectEventResult>("Collect")

*Defined in [wrappers/vestingscheme.ts:35](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L35)*





___

<a id="NewVestedAgreement"></a>

###  NewVestedAgreement

**●  NewVestedAgreement**:  *[EventFetcherFactory](../#EventFetcherFactory)[NewVestedAgreementEventResult](../interfaces/NewVestedAgreementEventResult.md)*  =  this.createEventFetcherFactory<NewVestedAgreementEventResult>("NewVestedAgreement")

*Defined in [wrappers/vestingscheme.ts:31](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L31)*





___

<a id="ProposalExecuted"></a>

###  ProposalExecuted

**●  ProposalExecuted**:  *[EventFetcherFactory](../#EventFetcherFactory)[ProposalExecutedEventResult](../interfaces/ProposalExecutedEventResult.md)*  =  this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted")

*Defined in [wrappers/vestingscheme.ts:29](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L29)*



Events




___

<a id="RevokeSignToCancelAgreement"></a>

###  RevokeSignToCancelAgreement

**●  RevokeSignToCancelAgreement**:  *[EventFetcherFactory](../#EventFetcherFactory)[RevokeSignToCancelAgreementEventResult](../interfaces/RevokeSignToCancelAgreementEventResult.md)*  =  this.createEventFetcherFactory<RevokeSignToCancelAgreementEventResult>("RevokeSignToCancelAgreement")

*Defined in [wrappers/vestingscheme.ts:33](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L33)*





___

<a id="SignToCancelAgreement"></a>

###  SignToCancelAgreement

**●  SignToCancelAgreement**:  *[EventFetcherFactory](../#EventFetcherFactory)[SignToCancelAgreementEventResult](../interfaces/SignToCancelAgreementEventResult.md)*  =  this.createEventFetcherFactory<SignToCancelAgreementEventResult>("SignToCancelAgreement")

*Defined in [wrappers/vestingscheme.ts:32](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L32)*





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

**●  frendlyName**:  *`string`*  = "Vesting Scheme"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[frendlyName](ContractWrapperBase.md#frendlyName)*

*Defined in [wrappers/vestingscheme.ts:23](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L23)*





___

<a id="name"></a>

###  name

**●  name**:  *`string`*  = "VestingScheme"

*Overrides [ContractWrapperBase](ContractWrapperBase.md).[name](ContractWrapperBase.md#name)*

*Defined in [wrappers/vestingscheme.ts:22](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L22)*





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
<a id="collect"></a>

###  collect

► **collect**(opts?: *[CollectVestingAgreementConfig](../interfaces/CollectVestingAgreementConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/vestingscheme.ts:187](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L187)*



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



*Defined in [wrappers/vestingscheme.ts:93](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L93)*



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



*Defined in [wrappers/vestingscheme.ts:212](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L212)*



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

*Defined in [wrappers/vestingscheme.ts:257](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L257)*



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

*Defined in [wrappers/vestingscheme.ts:270](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L270)*



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

*Defined in [wrappers/vestingscheme.ts:266](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L266)*



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

*Defined in [wrappers/vestingscheme.ts:262](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L262)*



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

<a id="propose"></a>

###  propose

► **propose**(opts?: *[ProposeVestingAgreementConfig](../interfaces/ProposeVestingAgreementConfig.md)*): `Promise`.<[ArcTransactionProposalResult](ArcTransactionProposalResult.md)>



*Defined in [wrappers/vestingscheme.ts:57](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L57)*



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



*Defined in [wrappers/vestingscheme.ts:162](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L162)*



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



*Overrides [ContractWrapperBase](ContractWrapperBase.md).[setParameters](ContractWrapperBase.md#setParameters)*

*Defined in [wrappers/vestingscheme.ts:250](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L250)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | [StandardSchemeParams](../interfaces/StandardSchemeParams.md)   |  - |





**Returns:** `Promise`.<[ArcTransactionDataResult](ArcTransactionDataResult.md)[Hash](../#Hash)>





___

<a id="signToCancel"></a>

###  signToCancel

► **signToCancel**(opts?: *[SignToCancelVestingAgreementConfig](../interfaces/SignToCancelVestingAgreementConfig.md)*): `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>



*Defined in [wrappers/vestingscheme.ts:137](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/vestingscheme.ts#L137)*



Sign to cancel a vesting agreement


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| opts | [SignToCancelVestingAgreementConfig](../interfaces/SignToCancelVestingAgreementConfig.md)  |  {} as SignToCancelVestingAgreementConfig |   - |





**Returns:** `Promise`.<[ArcTransactionResult](ArcTransactionResult.md)>





___


