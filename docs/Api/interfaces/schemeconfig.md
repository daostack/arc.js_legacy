[API Reference](../README.md) > [SchemeConfig](../interfaces/SchemeConfig.md)



# Interface: SchemeConfig


Configuration of an Arc scheme that you want to automatically register with a new DAO.


## Properties
<a id="additionalParams"></a>

### «Optional» additionalParams

**●  additionalParams**:  *`any`* 

*Defined in [contracts/daocreator.ts:356](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/daocreator.ts#L356)*



Other scheme parameters, any params besides those already provided in votingMachineParams. For example, ContributionReward requires orgNativeTokenFee.

Default is {}




___

<a id="address"></a>

### «Optional» address

**●  address**:  *`string`* 

*Defined in [contracts/daocreator.ts:333](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/daocreator.ts#L333)*



Scheme address if you don't want to use the scheme supplied in this release of Arc.js.




___

<a id="name"></a>

###  name

**●  name**:  *`string`* 

*Defined in [contracts/daocreator.ts:329](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/daocreator.ts#L329)*



The name of the Arc scheme. It must be an Arc scheme.




___

<a id="permissions"></a>

### «Optional» permissions

**●  permissions**:  *[SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)* 

*Defined in [contracts/daocreator.ts:340](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/daocreator.ts#L340)*



Extra permissions on the scheme. The minimum permissions for the scheme will be enforced (or'd with anything you supply). See ExtendTruffleContract.getDefaultPermissions for what this string should look like.




___

<a id="votingMachineParams"></a>

### «Optional» votingMachineParams

**●  votingMachineParams**:  *[NewDaoVotingMachineConfig](NewDaoVotingMachineConfig.md)* 

*Defined in [contracts/daocreator.ts:349](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/daocreator.ts#L349)*



Optional votingMachine parameters if you have not supplied them in NewDaoConfig or want to override them. Note it costs more gas to add them here.

New schemes will be created with these parameters and the DAO's native reputation contract.

Defaults are the Arc.js-deployed AbsoluteVote, the Arc.js-deployed Reputation, votePerc 50%, ownerVote true




___


