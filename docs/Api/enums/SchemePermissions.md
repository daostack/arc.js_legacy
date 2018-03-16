[API Reference](../README.md) > [SchemePermissions](../enums/SchemePermissions.md)



# Enumeration: SchemePermissions

## Index

### Enumeration members

* [All](SchemePermissions.md#All)
* [CanAddRemoveGlobalConstraints](SchemePermissions.md#CanAddRemoveGlobalConstraints)
* [CanCallDelegateCall](SchemePermissions.md#CanCallDelegateCall)
* [CanRegisterSchemes](SchemePermissions.md#CanRegisterSchemes)
* [CanUpgradeController](SchemePermissions.md#CanUpgradeController)
* [IsRegistered](SchemePermissions.md#IsRegistered)
* [None](SchemePermissions.md#None)


### Functions

* [fromString](SchemePermissions.md#fromString)
* [toString](SchemePermissions.md#toString)



---
## Enumeration members
<a id="All"></a>

###  All

** All**:    = 31

*Defined in [commonTypes.ts:49](https://github.com/daostack/arc.js/blob/61e5f90/lib/commonTypes.ts#L49)*





___

<a id="CanAddRemoveGlobalConstraints"></a>

###  CanAddRemoveGlobalConstraints

** CanAddRemoveGlobalConstraints**:    = 4

*Defined in [commonTypes.ts:46](https://github.com/daostack/arc.js/blob/61e5f90/lib/commonTypes.ts#L46)*





___

<a id="CanCallDelegateCall"></a>

###  CanCallDelegateCall

** CanCallDelegateCall**:    = 16

*Defined in [commonTypes.ts:48](https://github.com/daostack/arc.js/blob/61e5f90/lib/commonTypes.ts#L48)*





___

<a id="CanRegisterSchemes"></a>

###  CanRegisterSchemes

** CanRegisterSchemes**:    = 2

*Defined in [commonTypes.ts:45](https://github.com/daostack/arc.js/blob/61e5f90/lib/commonTypes.ts#L45)*





___

<a id="CanUpgradeController"></a>

###  CanUpgradeController

** CanUpgradeController**:    = 8

*Defined in [commonTypes.ts:47](https://github.com/daostack/arc.js/blob/61e5f90/lib/commonTypes.ts#L47)*





___

<a id="IsRegistered"></a>

###  IsRegistered

** IsRegistered**:    = 1

*Defined in [commonTypes.ts:44](https://github.com/daostack/arc.js/blob/61e5f90/lib/commonTypes.ts#L44)*



A scheme always automatically gets this bit when registered to a DAO




___

<a id="None"></a>

###  None

** None**:    = 0

*Defined in [commonTypes.ts:40](https://github.com/daostack/arc.js/blob/61e5f90/lib/commonTypes.ts#L40)*





___


## Functions
<a id="fromString"></a>

###  fromString

► **fromString**(perms: *`string`*): [SchemePermissions](SchemePermissions.md)



*Defined in [commonTypes.ts:82](https://github.com/daostack/arc.js/blob/61e5f90/lib/commonTypes.ts#L82)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| perms | `string`   |  - |





**Returns:** [SchemePermissions](SchemePermissions.md)





___

<a id="toString"></a>

###  toString

► **toString**(perms: *[SchemePermissions](SchemePermissions.md)⎮[DefaultSchemePermissions](DefaultSchemePermissions.md)*): `string`



*Defined in [commonTypes.ts:79](https://github.com/daostack/arc.js/blob/61e5f90/lib/commonTypes.ts#L79)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| perms | [SchemePermissions](SchemePermissions.md)⎮[DefaultSchemePermissions](DefaultSchemePermissions.md)   |  - |





**Returns:** `string`





___


