[API Reference](../README.md) > [ForgeOrgConfig](../interfaces/ForgeOrgConfig.md)



# Interface: ForgeOrgConfig


options for DaoCreator.forgeOrg

## Hierarchy

**ForgeOrgConfig**

↳  [NewDaoConfig](NewDaoConfig.md)









## Properties
<a id="founders"></a>

###  founders

**●  founders**:  *`Array`.<[FounderConfig](FounderConfig.md)>* 

*Defined in [wrappers/daocreator.ts:313](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L313)*



Optional array describing founders. Default is [].




___

<a id="name"></a>

###  name

**●  name**:  *`string`* 

*Defined in [wrappers/daocreator.ts:300](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L300)*



The name of the new DAO.




___

<a id="tokenName"></a>

###  tokenName

**●  tokenName**:  *`string`* 

*Defined in [wrappers/daocreator.ts:304](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L304)*



The name of the token to be associated with the DAO




___

<a id="tokenSymbol"></a>

###  tokenSymbol

**●  tokenSymbol**:  *`string`* 

*Defined in [wrappers/daocreator.ts:308](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L308)*



The symbol of the token to be associated with the DAO




___

<a id="universalController"></a>

### «Optional» universalController

**●  universalController**:  *`boolean`* 

*Defined in [wrappers/daocreator.ts:318](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L318)*



true to use the UniversalController contract, false to instantiate and use a new Controller contract. The default is true.




___


