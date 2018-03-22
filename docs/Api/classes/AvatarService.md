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


### ⊕ **new AvatarService**(avatarAddress: *[Address](../#Address)*): [AvatarService](AvatarService.md)


*Defined in avatarService.ts:21*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** [AvatarService](AvatarService.md)

---


## Properties
<a id="isUController"></a>

###  isUController

**●  isUController**:  *`boolean`* 

*Defined in avatarService.ts:13*





___


## Methods
<a id="getAvatar"></a>

###  getAvatar

► **getAvatar**(): `Promise`.<`any`>



*Defined in avatarService.ts:31*



Returns the Avatar TruffleContract




**Returns:** `Promise`.<`any`>





___

<a id="getController"></a>

###  getController

► **getController**(): `Promise`.<`any`>



*Defined in avatarService.ts:55*



Returns a TruffleContract for the controller. Could be either UController or Controller. You can know which one by checking the AvatarService instance property `isUController`.




**Returns:** `Promise`.<`any`>





___

<a id="getControllerAddress"></a>

###  getControllerAddress

► **getControllerAddress**(): `Promise`.<`string`>



*Defined in avatarService.ts:42*



returns the address of the controller




**Returns:** `Promise`.<`string`>





___

<a id="getNativeReputation"></a>

###  getNativeReputation

► **getNativeReputation**(): `Promise`.<`any`>



*Defined in avatarService.ts:88*



Returns the avatar's native reputation TruffleContract.




**Returns:** `Promise`.<`any`>





___

<a id="getNativeReputationAddress"></a>

###  getNativeReputationAddress

► **getNativeReputationAddress**(): `Promise`.<`string`>



*Defined in avatarService.ts:77*



Returns the address of the avatar's native reputation.




**Returns:** `Promise`.<`string`>





___

<a id="getNativeToken"></a>

###  getNativeToken

► **getNativeToken**(): `Promise`.<`any`>



*Defined in avatarService.ts:111*



Returns the avatar's native token TruffleContract.




**Returns:** `Promise`.<`any`>





___

<a id="getNativeTokenAddress"></a>

###  getNativeTokenAddress

► **getNativeTokenAddress**(): `Promise`.<`string`>



*Defined in avatarService.ts:100*



Returns the address of the avatar's native token.




**Returns:** `Promise`.<`string`>





___


