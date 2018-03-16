[API Reference](../README.md) > [DAO](../classes/DAO.md)



# Class: DAO

## Index

### Properties

* [avatar](DAO.md#avatar)
* [controller](DAO.md#controller)
* [hasUController](DAO.md#hasUController)
* [reputation](DAO.md#reputation)
* [token](DAO.md#token)


### Methods

* [_getConstraints](DAO.md#_getConstraints)
* [_getSchemes](DAO.md#_getSchemes)
* [_handleConstraintEvent](DAO.md#_handleConstraintEvent)
* [_handleSchemeEvent](DAO.md#_handleSchemeEvent)
* [getContractWrapper](DAO.md#getContractWrapper)
* [getGlobalConstraints](DAO.md#getGlobalConstraints)
* [getName](DAO.md#getName)
* [getSchemes](DAO.md#getSchemes)
* [getTokenName](DAO.md#getTokenName)
* [getTokenSymbol](DAO.md#getTokenSymbol)
* [isSchemeRegistered](DAO.md#isSchemeRegistered)
* [at](DAO.md#at)
* [getGenesisDao](DAO.md#getGenesisDao)
* [new](DAO.md#new)



---
## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *`any`* 

*Defined in [dao.ts:69](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L69)*





___

<a id="controller"></a>

###  controller

**●  controller**:  *`any`* 

*Defined in [dao.ts:70](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L70)*





___

<a id="hasUController"></a>

###  hasUController

**●  hasUController**:  *`boolean`* 

*Defined in [dao.ts:71](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L71)*





___

<a id="reputation"></a>

###  reputation

**●  reputation**:  *`any`* 

*Defined in [dao.ts:73](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L73)*





___

<a id="token"></a>

###  token

**●  token**:  *`any`* 

*Defined in [dao.ts:72](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L72)*





___


## Methods
<a id="_getConstraints"></a>

###  _getConstraints

► **_getConstraints**(): `Promise`.<`Array`.<[DaoGlobalConstraintInfo](../interfaces/DaoGlobalConstraintInfo.md)>>



*Defined in [dao.ts:203](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L203)*



returns global constraints currently in this DAO, as DaoGlobalConstraintInfo




**Returns:** `Promise`.<`Array`.<[DaoGlobalConstraintInfo](../interfaces/DaoGlobalConstraintInfo.md)>>





___

<a id="_getSchemes"></a>

###  _getSchemes

► **_getSchemes**(): `Promise`.<`Array`.<[DaoSchemeInfo](../interfaces/DaoSchemeInfo.md)>>



*Defined in [dao.ts:93](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L93)*



returns schemes currently in this DAO as Array<daoschemeinfo></daoschemeinfo>




**Returns:** `Promise`.<`Array`.<[DaoSchemeInfo](../interfaces/DaoSchemeInfo.md)>>





___

<a id="_handleConstraintEvent"></a>

###  _handleConstraintEvent

► **_handleConstraintEvent**(log: *[DecodedLogEntryEvent](../interfaces/DecodedLogEntryEvent.md)[ControllerAddGlobalConstraintsEventLogEntry](../interfaces/ControllerAddGlobalConstraintsEventLogEntry.md)⎮`Array`.<[DecodedLogEntryEvent](../interfaces/DecodedLogEntryEvent.md)[ControllerAddGlobalConstraintsEventLogEntry](../interfaces/ControllerAddGlobalConstraintsEventLogEntry.md)>*, arcTypesMap: *`Map`.<[Address](../#Address)>,.<`string`>*, constraintsMap: *`Map`.<`string`>,.<[DaoGlobalConstraintInfo](../interfaces/DaoGlobalConstraintInfo.md)>*): `Promise`.<`void`>



*Defined in [dao.ts:250](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L250)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| log | [DecodedLogEntryEvent](../interfaces/DecodedLogEntryEvent.md)[ControllerAddGlobalConstraintsEventLogEntry](../interfaces/ControllerAddGlobalConstraintsEventLogEntry.md)⎮`Array`.<[DecodedLogEntryEvent](../interfaces/DecodedLogEntryEvent.md)[ControllerAddGlobalConstraintsEventLogEntry](../interfaces/ControllerAddGlobalConstraintsEventLogEntry.md)>   |  - |
| arcTypesMap | `Map`.<[Address](../#Address)>,.<`string`>   |  - |
| constraintsMap | `Map`.<`string`>,.<[DaoGlobalConstraintInfo](../interfaces/DaoGlobalConstraintInfo.md)>   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="_handleSchemeEvent"></a>

###  _handleSchemeEvent

► **_handleSchemeEvent**(log: *[DecodedLogEntryEvent](../interfaces/DecodedLogEntryEvent.md)[ControllerRegisterSchemeEventLogEntry](../interfaces/ControllerRegisterSchemeEventLogEntry.md)⎮`Array`.<[DecodedLogEntryEvent](../interfaces/DecodedLogEntryEvent.md)[ControllerRegisterSchemeEventLogEntry](../interfaces/ControllerRegisterSchemeEventLogEntry.md)>*, arcTypesMap: *`Map`.<[Address](../#Address)>,.<`string`>*, schemesMap: *`Map`.<`string`>,.<[DaoSchemeInfo](../interfaces/DaoSchemeInfo.md)>*): `Promise`.<`void`>



*Defined in [dao.ts:141](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L141)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| log | [DecodedLogEntryEvent](../interfaces/DecodedLogEntryEvent.md)[ControllerRegisterSchemeEventLogEntry](../interfaces/ControllerRegisterSchemeEventLogEntry.md)⎮`Array`.<[DecodedLogEntryEvent](../interfaces/DecodedLogEntryEvent.md)[ControllerRegisterSchemeEventLogEntry](../interfaces/ControllerRegisterSchemeEventLogEntry.md)>   |  - |
| arcTypesMap | `Map`.<[Address](../#Address)>,.<`string`>   |  - |
| schemesMap | `Map`.<`string`>,.<[DaoSchemeInfo](../interfaces/DaoSchemeInfo.md)>   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="getContractWrapper"></a>

###  getContractWrapper

► **getContractWrapper**(contract: *`string`*, address?: *[Address](../#Address)*): `Promise`.<[ExtendTruffleContract](ExtendTruffleContract.md)⎮`undefined`>



*Defined in [dao.ts:174](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L174)*



Returns an Arc.js contract wrapper or undefined if not found.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| contract | `string`   |  name of an Arc contract, like "SchemeRegistrar" |
| address | [Address](../#Address)   |  optional |





**Returns:** `Promise`.<[ExtendTruffleContract](ExtendTruffleContract.md)⎮`undefined`>





___

<a id="getGlobalConstraints"></a>

###  getGlobalConstraints

► **getGlobalConstraints**(name: *`string`*): `Promise`.<`Array`.<[DaoGlobalConstraintInfo](../interfaces/DaoGlobalConstraintInfo.md)>>



*Defined in [dao.ts:189](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L189)*



Returns global constraints currently registered into this DAO, as Array<daoglobalconstraintinfo></daoglobalconstraintinfo>


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string`   |  like "TokenCapGC" |





**Returns:** `Promise`.<`Array`.<[DaoGlobalConstraintInfo](../interfaces/DaoGlobalConstraintInfo.md)>>





___

<a id="getName"></a>

###  getName

► **getName**(): `Promise`.<`string`>



*Defined in [dao.ts:280](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L280)*



Returns the name of the DAO as stored in the Avatar




**Returns:** `Promise`.<`string`>







___

<a id="getSchemes"></a>

###  getSchemes

► **getSchemes**(name: *`string`*): `Promise`.<`Array`.<[DaoSchemeInfo](../interfaces/DaoSchemeInfo.md)>>



*Defined in [dao.ts:79](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L79)*



returns schemes currently registered into this DAO, as Array<daoschemeinfo></daoschemeinfo>


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string`   |  like "SchemeRegistrar" |





**Returns:** `Promise`.<`Array`.<[DaoSchemeInfo](../interfaces/DaoSchemeInfo.md)>>





___

<a id="getTokenName"></a>

###  getTokenName

► **getTokenName**(): `Promise`.<`string`>



*Defined in [dao.ts:288](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L288)*



Returns the token name for the DAO as stored in the native token




**Returns:** `Promise`.<`string`>







___

<a id="getTokenSymbol"></a>

###  getTokenSymbol

► **getTokenSymbol**(): `Promise`.<`string`>



*Defined in [dao.ts:296](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L296)*



Returns the token symbol for the DAO as stored in the native token




**Returns:** `Promise`.<`string`>







___

<a id="isSchemeRegistered"></a>

###  isSchemeRegistered

► **isSchemeRegistered**(schemeAddress: *[Address](../#Address)*): `Promise`.<`boolean`>



*Defined in [dao.ts:181](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L181)*



returns whether the scheme with the given name is registered to this DAO's controller


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| schemeAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<`boolean`>





___

<a id="at"></a>

### «Static» at

► **at**(avatarAddress: *[Address](../#Address)*): `Promise`.<[DAO](DAO.md)>



*Defined in [dao.ts:31](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L31)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[DAO](DAO.md)>





___

<a id="getGenesisDao"></a>

### «Static» getGenesisDao

► **getGenesisDao**(daoCreatorAddress: *[Address](../#Address)*): `Promise`.<`string`>



*Defined in [dao.ts:47](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L47)*



Returns promise of the DAOstack Genesis avatar address, or undefined if not found


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| daoCreatorAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<`string`>





___

<a id="new"></a>

### «Static» new

► **new**(opts: *[NewDaoConfig](../interfaces/NewDaoConfig.md)*): `Promise`.<[DAO](DAO.md)>



*Defined in [dao.ts:12](https://github.com/daostack/arc.js/blob/616f6e7/lib/dao.ts#L12)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| opts | [NewDaoConfig](../interfaces/NewDaoConfig.md)   |  - |





**Returns:** `Promise`.<[DAO](DAO.md)>





___


