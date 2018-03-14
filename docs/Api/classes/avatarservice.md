[@DAOstack/Arc.js API Reference](../README.md) > [AvatarService](../classes/avatarservice.md)



# Class: AvatarService


Methods for querying information about an Avatar. Use it by:

let avatarService = new AvatarService(avatarAddress);

## Index

### Constructors

* [constructor](avatarservice.md#constructor)


### Properties

* [avatar](avatarservice.md#avatar)
* [avatarAddress](avatarservice.md#avataraddress)
* [controller](avatarservice.md#controller)
* [controllerAddress](avatarservice.md#controlleraddress)
* [isUController](avatarservice.md#isucontroller)
* [nativeReputation](avatarservice.md#nativereputation)
* [nativeReputationAddress](avatarservice.md#nativereputationaddress)
* [nativeToken](avatarservice.md#nativetoken)
* [nativeTokenAddress](avatarservice.md#nativetokenaddress)


### Methods

* [getAvatar](avatarservice.md#getavatar)
* [getController](avatarservice.md#getcontroller)
* [getControllerAddress](avatarservice.md#getcontrolleraddress)
* [getNativeReputation](avatarservice.md#getnativereputation)
* [getNativeReputationAddress](avatarservice.md#getnativereputationaddress)
* [getNativeToken](avatarservice.md#getnativetoken)
* [getNativeTokenAddress](avatarservice.md#getnativetokenaddress)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new AvatarService**(avatarAddress: *`string`*): [AvatarService](avatarservice.md)


*Defined in [avatarService.ts:20](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L20)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | `string`   |  - |





**Returns:** [AvatarService](avatarservice.md)

---


## Properties
<a id="avatar"></a>

### «Private» avatar

**●  avatar**:  *`any`* 

*Defined in [avatarService.ts:14](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L14)*





___

<a id="avataraddress"></a>

### «Private» avatarAddress

**●  avatarAddress**:  *`string`* 

*Defined in [avatarService.ts:13](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L13)*





___

<a id="controller"></a>

### «Private» controller

**●  controller**:  *`any`* 

*Defined in [avatarService.ts:16](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L16)*





___

<a id="controlleraddress"></a>

### «Private» controllerAddress

**●  controllerAddress**:  *`any`* 

*Defined in [avatarService.ts:15](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L15)*





___

<a id="isucontroller"></a>

###  isUController

**●  isUController**:  *`boolean`* 

*Defined in [avatarService.ts:12](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L12)*





___

<a id="nativereputation"></a>

### «Private» nativeReputation

**●  nativeReputation**:  *`any`* 

*Defined in [avatarService.ts:18](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L18)*





___

<a id="nativereputationaddress"></a>

### «Private» nativeReputationAddress

**●  nativeReputationAddress**:  *`any`* 

*Defined in [avatarService.ts:17](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L17)*





___

<a id="nativetoken"></a>

### «Private» nativeToken

**●  nativeToken**:  *`any`* 

*Defined in [avatarService.ts:20](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L20)*





___

<a id="nativetokenaddress"></a>

### «Private» nativeTokenAddress

**●  nativeTokenAddress**:  *`any`* 

*Defined in [avatarService.ts:19](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L19)*





___


## Methods
<a id="getavatar"></a>

###  getAvatar

► **getAvatar**(): `Promise`.<`any`>



*Defined in [avatarService.ts:30](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L30)*



Returns the Avatar TruffleContract




**Returns:** `Promise`.<`any`>





___

<a id="getcontroller"></a>

###  getController

► **getController**(): `Promise`.<`any`>



*Defined in [avatarService.ts:54](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L54)*



Returns a TruffleContract for the controller. Could be either UController or Controller. You can know which one by checking the AvatarService instance property `isUController`.




**Returns:** `Promise`.<`any`>





___

<a id="getcontrolleraddress"></a>

###  getControllerAddress

► **getControllerAddress**(): `Promise`.<`string`>



*Defined in [avatarService.ts:41](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L41)*



returns the address of the controller




**Returns:** `Promise`.<`string`>





___

<a id="getnativereputation"></a>

###  getNativeReputation

► **getNativeReputation**(): `Promise`.<`any`>



*Defined in [avatarService.ts:87](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L87)*



Returns the avatar's native reputation TruffleContract.




**Returns:** `Promise`.<`any`>





___

<a id="getnativereputationaddress"></a>

###  getNativeReputationAddress

► **getNativeReputationAddress**(): `Promise`.<`string`>



*Defined in [avatarService.ts:76](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L76)*



Returns the address of the avatar's native reputation.




**Returns:** `Promise`.<`string`>





___

<a id="getnativetoken"></a>

###  getNativeToken

► **getNativeToken**(): `Promise`.<`any`>



*Defined in [avatarService.ts:110](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L110)*



Returns the avatar's native token TruffleContract.




**Returns:** `Promise`.<`any`>





___

<a id="getnativetokenaddress"></a>

###  getNativeTokenAddress

► **getNativeTokenAddress**(): `Promise`.<`string`>



*Defined in [avatarService.ts:99](https://github.com/daostack/arc.js/blob/6909d59/lib/avatarService.ts#L99)*



Returns the address of the avatar's native token.




**Returns:** `Promise`.<`string`>





___


