[API Reference](../README.md) > [SetSchemesConfig](../interfaces/SetSchemesConfig.md)



# Interface: SetSchemesConfig

## Hierarchy


 [SchemesConfig](SchemesConfig.md)

**↳ SetSchemesConfig**








## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *[Address](../#Address)* 

*Defined in [wrappers/daocreator.ts:380](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L380)*



avatar address




___

<a id="schemes"></a>

### «Optional» schemes

**●  schemes**:  *`Array`.<[SchemeConfig](SchemeConfig.md)>* 

*Inherited from [SchemesConfig](SchemesConfig.md).[schemes](SchemesConfig.md#schemes)*

*Defined in [wrappers/daocreator.ts:373](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L373)*



Any Arc schemes you would like to automatically register with the new DAO. Non-Arc schemes are not allowed here. You may add them later in your application's workflow using SchemeRegistrar.




___

<a id="votingMachineParams"></a>

### «Optional» votingMachineParams

**●  votingMachineParams**:  *[NewDaoVotingMachineConfig](NewDaoVotingMachineConfig.md)* 

*Inherited from [SchemesConfig](SchemesConfig.md).[votingMachineParams](SchemesConfig.md#votingMachineParams)*

*Defined in [wrappers/daocreator.ts:367](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L367)*



default votingMachine parameters if you have not configured a scheme that you want to register with the new DAO with its own voting parameters.

New schemes will be created these parameters.

Defaults are described in NewDaoVotingMachineConfig.




___


