[API Reference](../README.md) > [SchemesConfig](../interfaces/SchemesConfig.md)



# Interface: SchemesConfig

## Hierarchy

**SchemesConfig**

↳  [SetSchemesConfig](SetSchemesConfig.md)









## Properties
<a id="schemes"></a>

### «Optional» schemes

**●  schemes**:  *`Array`.<[SchemeConfig](SchemeConfig.md)>* 

*Defined in [wrappers/daocreator.ts:373](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L373)*



Any Arc schemes you would like to automatically register with the new DAO. Non-Arc schemes are not allowed here. You may add them later in your application's workflow using SchemeRegistrar.




___

<a id="votingMachineParams"></a>

### «Optional» votingMachineParams

**●  votingMachineParams**:  *[NewDaoVotingMachineConfig](NewDaoVotingMachineConfig.md)* 

*Defined in [wrappers/daocreator.ts:367](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L367)*



default votingMachine parameters if you have not configured a scheme that you want to register with the new DAO with its own voting parameters.

New schemes will be created these parameters.

Defaults are described in NewDaoVotingMachineConfig.




___


