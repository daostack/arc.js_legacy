[API Reference](../README.md) > [AvatarService](../classes/AvatarService.md)



# Class: AvatarService


Methods for querying information about an Avatar. Use it by:

let avatarService = new AvatarService(avatarAddress);

## Index

### Constructors

* [constructor](AvatarService.md#constructor)


### Properties

* [isUController](AvatarService.md#isUController)


### Methods

* [getAvatar](AvatarService.md#getAvatar)
* [getController](AvatarService.md#getController)
* [getControllerAddress](AvatarService.md#getControllerAddress)
* [getNativeReputation](AvatarService.md#getNativeReputation)
* [getNativeReputationAddress](AvatarService.md#getNativeReputationAddress)
* [getNativeToken](AvatarService.md#getNativeToken)
* [getNativeTokenAddress](AvatarService.md#getNativeTokenAddress)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new AvatarService**(avatarAddress: *`string`*): [AvatarService](AvatarService.md)


*Defined in [avatarService.ts:20](https://github.com/daostack/arc.js/blob/caacbb2/lib/avatarService.ts#L20)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | `string`   |  - |





**Returns:** [AvatarService](AvatarService.md)

---


## Properties
<a id="isUController"></a>

###  isUController

**●  isUController**:  *`boolean`* 

*Defined in [avatarService.ts:12](https://github.com/daostack/arc.js/blob/caacbb2/lib/avatarService.ts#L12)*





___


## Methods
<a id="getAvatar"></a>

###  getAvatar

► **getAvatar**(): `Promise`.<`any`>



*Defined in [avatarService.ts:30](https://github.com/daostack/arc.js/blob/caacbb2/lib/avatarService.ts#L30)*



Returns the Avatar TruffleContract




**Returns:** `Promise`.<`any`>





___

<a id="getController"></a>

###  getController

► **getController**(): `Promise`.<`any`>



*Defined in [avatarService.ts:54](https://github.com/daostack/arc.js/blob/caacbb2/lib/avatarService.ts#L54)*



Returns a TruffleContract for the controller. Could be either UController or Controller. You can know which one by checking the AvatarService instance property `isUController`.




**Returns:** `Promise`.<`any`>





___

<a id="getControllerAddress"></a>

###  getControllerAddress

► **getControllerAddress**(): `Promise`.<`string`>



*Defined in [avatarService.ts:41](https://github.com/daostack/arc.js/blob/caacbb2/lib/avatarService.ts#L41)*



returns the address of the controller




**Returns:** `Promise`.<`string`>





___

<a id="getNativeReputation"></a>

###  getNativeReputation

► **getNativeReputation**(): `Promise`.<`any`>



*Defined in [avatarService.ts:87](https://github.com/daostack/arc.js/blob/caacbb2/lib/avatarService.ts#L87)*



Returns the avatar's native reputation TruffleContract.




**Returns:** `Promise`.<`any`>





___

<a id="getNativeReputationAddress"></a>

###  getNativeReputationAddress

► **getNativeReputationAddress**(): `Promise`.<`string`>



*Defined in [avatarService.ts:76](https://github.com/daostack/arc.js/blob/caacbb2/lib/avatarService.ts#L76)*



Returns the address of the avatar's native reputation.




**Returns:** `Promise`.<`string`>





___

<a id="getNativeToken"></a>

###  getNativeToken

► **getNativeToken**(): `Promise`.<`any`>



*Defined in [avatarService.ts:110](https://github.com/daostack/arc.js/blob/caacbb2/lib/avatarService.ts#L110)*



Returns the avatar's native token TruffleContract.




**Returns:** `Promise`.<`any`>





___

<a id="getNativeTokenAddress"></a>

###  getNativeTokenAddress

► **getNativeTokenAddress**(): `Promise`.<`string`>



*Defined in [avatarService.ts:99](https://github.com/daostack/arc.js/blob/caacbb2/lib/avatarService.ts#L99)*



Returns the address of the avatar's native token.




**Returns:** `Promise`.<`string`>





___


