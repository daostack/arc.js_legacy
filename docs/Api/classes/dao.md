[@DAOstack/Arc.js API Reference](../README.md) > [DAO](../classes/dao.md)



# Class: DAO

## Index

### Properties

* [avatar](dao.md#avatar)
* [controller](dao.md#controller)
* [hasUController](dao.md#hasucontroller)
* [reputation](dao.md#reputation)
* [token](dao.md#token)


### Methods

* [_getConstraints](dao.md#_getconstraints)
* [_getSchemes](dao.md#_getschemes)
* [_handleConstraintEvent](dao.md#_handleconstraintevent)
* [_handleSchemeEvent](dao.md#_handleschemeevent)
* [getContractWrapper](dao.md#getcontractwrapper)
* [getGlobalConstraints](dao.md#getglobalconstraints)
* [getName](dao.md#getname)
* [getSchemes](dao.md#getschemes)
* [getTokenName](dao.md#gettokenname)
* [getTokenSymbol](dao.md#gettokensymbol)
* [isSchemeRegistered](dao.md#isschemeregistered)
* [at](dao.md#at)
* [getGenesisDao](dao.md#getgenesisdao)
* [new](dao.md#new)



---
## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *`any`* 

*Defined in [dao.ts:69](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L69)*





___

<a id="controller"></a>

###  controller

**●  controller**:  *`any`* 

*Defined in [dao.ts:70](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L70)*





___

<a id="hasucontroller"></a>

###  hasUController

**●  hasUController**:  *`boolean`* 

*Defined in [dao.ts:71](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L71)*





___

<a id="reputation"></a>

###  reputation

**●  reputation**:  *`any`* 

*Defined in [dao.ts:73](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L73)*





___

<a id="token"></a>

###  token

**●  token**:  *`any`* 

*Defined in [dao.ts:72](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L72)*





___


## Methods
<a id="_getconstraints"></a>

###  _getConstraints

► **_getConstraints**(): `Promise`.<`Array`.<[DaoGlobalConstraintInfo](../interfaces/daoglobalconstraintinfo.md)>>



*Defined in [dao.ts:203](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L203)*



returns global constraints currently in this DAO, as DaoGlobalConstraintInfo




**Returns:** `Promise`.<`Array`.<[DaoGlobalConstraintInfo](../interfaces/daoglobalconstraintinfo.md)>>





___

<a id="_getschemes"></a>

###  _getSchemes

► **_getSchemes**(): `Promise`.<`Array`.<[DaoSchemeInfo](../interfaces/daoschemeinfo.md)>>



*Defined in [dao.ts:93](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L93)*



returns schemes currently in this DAO as Array<daoschemeinfo></daoschemeinfo>




**Returns:** `Promise`.<`Array`.<[DaoSchemeInfo](../interfaces/daoschemeinfo.md)>>





___

<a id="_handleconstraintevent"></a>

###  _handleConstraintEvent

► **_handleConstraintEvent**(log: *[DecodedLogEntryEvent](../interfaces/decodedlogentryevent.md)[ControllerAddGlobalConstraintsEventLogEntry](../interfaces/controlleraddglobalconstraintseventlogentry.md)⎮`Array`.<[DecodedLogEntryEvent](../interfaces/decodedlogentryevent.md)[ControllerAddGlobalConstraintsEventLogEntry](../interfaces/controlleraddglobalconstraintseventlogentry.md)>*, arcTypesMap: *`Map`.<[Address](../#address)>,.<`string`>*, constraintsMap: *`Map`.<`string`>,.<[DaoGlobalConstraintInfo](../interfaces/daoglobalconstraintinfo.md)>*): `Promise`.<`void`>



*Defined in [dao.ts:250](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L250)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| log | [DecodedLogEntryEvent](../interfaces/decodedlogentryevent.md)[ControllerAddGlobalConstraintsEventLogEntry](../interfaces/controlleraddglobalconstraintseventlogentry.md)⎮`Array`.<[DecodedLogEntryEvent](../interfaces/decodedlogentryevent.md)[ControllerAddGlobalConstraintsEventLogEntry](../interfaces/controlleraddglobalconstraintseventlogentry.md)>   |  - |
| arcTypesMap | `Map`.<[Address](../#address)>,.<`string`>   |  - |
| constraintsMap | `Map`.<`string`>,.<[DaoGlobalConstraintInfo](../interfaces/daoglobalconstraintinfo.md)>   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="_handleschemeevent"></a>

###  _handleSchemeEvent

► **_handleSchemeEvent**(log: *[DecodedLogEntryEvent](../interfaces/decodedlogentryevent.md)[ControllerRegisterSchemeEventLogEntry](../interfaces/controllerregisterschemeeventlogentry.md)⎮`Array`.<[DecodedLogEntryEvent](../interfaces/decodedlogentryevent.md)[ControllerRegisterSchemeEventLogEntry](../interfaces/controllerregisterschemeeventlogentry.md)>*, arcTypesMap: *`Map`.<[Address](../#address)>,.<`string`>*, schemesMap: *`Map`.<`string`>,.<[DaoSchemeInfo](../interfaces/daoschemeinfo.md)>*): `Promise`.<`void`>



*Defined in [dao.ts:141](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L141)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| log | [DecodedLogEntryEvent](../interfaces/decodedlogentryevent.md)[ControllerRegisterSchemeEventLogEntry](../interfaces/controllerregisterschemeeventlogentry.md)⎮`Array`.<[DecodedLogEntryEvent](../interfaces/decodedlogentryevent.md)[ControllerRegisterSchemeEventLogEntry](../interfaces/controllerregisterschemeeventlogentry.md)>   |  - |
| arcTypesMap | `Map`.<[Address](../#address)>,.<`string`>   |  - |
| schemesMap | `Map`.<`string`>,.<[DaoSchemeInfo](../interfaces/daoschemeinfo.md)>   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="getcontractwrapper"></a>

###  getContractWrapper

► **getContractWrapper**(contract: *`string`*, address?: *[Address](../#address)*): `Promise`.<[ExtendTruffleContract](extendtrufflecontract.md)⎮`undefined`>



*Defined in [dao.ts:174](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L174)*



Returns an Arc.js contract wrapper or undefined if not found.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| contract | `string`   |  name of an Arc contract, like "SchemeRegistrar" |
| address | [Address](../#address)   |  optional |





**Returns:** `Promise`.<[ExtendTruffleContract](extendtrufflecontract.md)⎮`undefined`>





___

<a id="getglobalconstraints"></a>

###  getGlobalConstraints

► **getGlobalConstraints**(name: *`string`*): `Promise`.<`Array`.<[DaoGlobalConstraintInfo](../interfaces/daoglobalconstraintinfo.md)>>



*Defined in [dao.ts:189](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L189)*



Returns global constraints currently registered into this DAO, as Array<daoglobalconstraintinfo></daoglobalconstraintinfo>


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string`   |  like "TokenCapGC" |





**Returns:** `Promise`.<`Array`.<[DaoGlobalConstraintInfo](../interfaces/daoglobalconstraintinfo.md)>>





___

<a id="getname"></a>

###  getName

► **getName**(): `Promise`.<`string`>



*Defined in [dao.ts:280](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L280)*



Returns the name of the DAO as stored in the Avatar




**Returns:** `Promise`.<`string`>







___

<a id="getschemes"></a>

###  getSchemes

► **getSchemes**(name: *`string`*): `Promise`.<`Array`.<[DaoSchemeInfo](../interfaces/daoschemeinfo.md)>>



*Defined in [dao.ts:79](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L79)*



returns schemes currently registered into this DAO, as Array<daoschemeinfo></daoschemeinfo>


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string`   |  like "SchemeRegistrar" |





**Returns:** `Promise`.<`Array`.<[DaoSchemeInfo](../interfaces/daoschemeinfo.md)>>





___

<a id="gettokenname"></a>

###  getTokenName

► **getTokenName**(): `Promise`.<`string`>



*Defined in [dao.ts:288](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L288)*



Returns the token name for the DAO as stored in the native token




**Returns:** `Promise`.<`string`>







___

<a id="gettokensymbol"></a>

###  getTokenSymbol

► **getTokenSymbol**(): `Promise`.<`string`>



*Defined in [dao.ts:296](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L296)*



Returns the token symbol for the DAO as stored in the native token




**Returns:** `Promise`.<`string`>







___

<a id="isschemeregistered"></a>

###  isSchemeRegistered

► **isSchemeRegistered**(schemeAddress: *[Address](../#address)*): `Promise`.<`boolean`>



*Defined in [dao.ts:181](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L181)*



returns whether the scheme with the given name is registered to this DAO's controller


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| schemeAddress | [Address](../#address)   |  - |





**Returns:** `Promise`.<`boolean`>





___

<a id="at"></a>

### «Static» at

► **at**(avatarAddress: *[Address](../#address)*): `Promise`.<[DAO](dao.md)>



*Defined in [dao.ts:31](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L31)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#address)   |  - |





**Returns:** `Promise`.<[DAO](dao.md)>





___

<a id="getgenesisdao"></a>

### «Static» getGenesisDao

► **getGenesisDao**(daoCreatorAddress: *[Address](../#address)*): `Promise`.<`string`>



*Defined in [dao.ts:47](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L47)*



Returns promise of the DAOstack Genesis avatar address, or undefined if not found


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| daoCreatorAddress | [Address](../#address)   |  - |





**Returns:** `Promise`.<`string`>





___

<a id="new"></a>

### «Static» new

► **new**(opts: *[NewDaoConfig](../interfaces/newdaoconfig.md)*): `Promise`.<[DAO](dao.md)>



*Defined in [dao.ts:12](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L12)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| opts | [NewDaoConfig](../interfaces/newdaoconfig.md)   |  - |





**Returns:** `Promise`.<[DAO](dao.md)>





___


