[@DAOstack/Arc.js API Reference](../README.md) > [SchemesConfig](../interfaces/schemesconfig.md)



# Interface: SchemesConfig

## Hierarchy

**SchemesConfig**

↳  [SetSchemesConfig](setschemesconfig.md)









## Properties
<a id="schemes"></a>

### «Optional» schemes

**●  schemes**:  *`Array`.<[SchemeConfig](schemeconfig.md)>* 

*Defined in [contracts/daocreator.ts:363](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L363)*



Any Arc schemes you would like to automatically register with the new DAO. Non-Arc schemes are not allowed here. You may add them later in your application's workflow using SchemeRegistrar.




___

<a id="votingmachineparams"></a>

### «Optional» votingMachineParams

**●  votingMachineParams**:  *[NewDaoVotingMachineConfig](newdaovotingmachineconfig.md)* 

*Defined in [contracts/daocreator.ts:357](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L357)*



default votingMachine parameters if you have not configured a scheme that you want to register with the new DAO with its own voting parameters.

New schemes will be created these parameters.

Defaults are described in NewDaoVotingMachineConfig.




___


