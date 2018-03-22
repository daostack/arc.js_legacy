[API Reference](../README.md) > [SchemeWrapper](../interfaces/SchemeWrapper.md)



# Interface: SchemeWrapper

## Implemented by

* [GenesisProtocolWrapper](../classes/GenesisProtocolWrapper.md)
* [GlobalConstraintRegistrarWrapper](../classes/GlobalConstraintRegistrarWrapper.md)
* [SchemeRegistrarWrapper](../classes/SchemeRegistrarWrapper.md)
* [UpgradeSchemeWrapper](../classes/UpgradeSchemeWrapper.md)
* [VestingSchemeWrapper](../classes/VestingSchemeWrapper.md)
* [VoteInOrganizationSchemeWrapper](../classes/VoteInOrganizationSchemeWrapper.md)


## Methods
<a id="getDefaultPermissions"></a>

###  getDefaultPermissions

► **getDefaultPermissions**(overrideValue?: *[SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)*): [SchemePermissions](../enums/SchemePermissions.md)



*Defined in [commonTypes.ts:90](https://github.com/daostack/arc.js/blob/42de6847/lib/commonTypes.ts#L90)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| overrideValue | [SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)   |  - |





**Returns:** [SchemePermissions](../enums/SchemePermissions.md)





___

<a id="getSchemeParameters"></a>

###  getSchemeParameters

► **getSchemeParameters**(avatarAddress: *[Address](../#Address)*): `Promise`.<`any`>



*Defined in [commonTypes.ts:89](https://github.com/daostack/arc.js/blob/42de6847/lib/commonTypes.ts#L89)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<`any`>





___

<a id="getSchemePermissions"></a>

###  getSchemePermissions

► **getSchemePermissions**(avatarAddress: *[Address](../#Address)*): `Promise`.<[SchemePermissions](../enums/SchemePermissions.md)>



*Defined in [commonTypes.ts:91](https://github.com/daostack/arc.js/blob/42de6847/lib/commonTypes.ts#L91)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| avatarAddress | [Address](../#Address)   |  - |





**Returns:** `Promise`.<[SchemePermissions](../enums/SchemePermissions.md)>





___


