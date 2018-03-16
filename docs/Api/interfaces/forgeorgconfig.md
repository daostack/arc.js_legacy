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

*Defined in [contracts/daocreator.ts:314](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/daocreator.ts#L314)*



Optional array describing founders. Default is [].




___

<a id="name"></a>

###  name

**●  name**:  *`string`* 

*Defined in [contracts/daocreator.ts:301](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/daocreator.ts#L301)*



The name of the new DAO.




___

<a id="tokenName"></a>

###  tokenName

**●  tokenName**:  *`string`* 

*Defined in [contracts/daocreator.ts:305](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/daocreator.ts#L305)*



The name of the token to be associated with the DAO




___

<a id="tokenSymbol"></a>

###  tokenSymbol

**●  tokenSymbol**:  *`string`* 

*Defined in [contracts/daocreator.ts:309](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/daocreator.ts#L309)*



The symbol of the token to be associated with the DAO




___

<a id="universalController"></a>

### «Optional» universalController

**●  universalController**:  *`boolean`* 

*Defined in [contracts/daocreator.ts:319](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/daocreator.ts#L319)*



true to use the UniversalController contract, false to instantiate and use a new Controller contract. The default is true.




___


