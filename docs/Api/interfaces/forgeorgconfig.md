[@DAOstack/Arc.js API Reference](../README.md) > [ForgeOrgConfig](../interfaces/forgeorgconfig.md)



# Interface: ForgeOrgConfig


options for DaoCreator.forgeOrg

## Hierarchy

**ForgeOrgConfig**

↳  [NewDaoConfig](newdaoconfig.md)









## Properties
<a id="founders"></a>

###  founders

**●  founders**:  *`Array`.<[FounderConfig](founderconfig.md)>* 

*Defined in [contracts/daocreator.ts:303](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L303)*



Optional array describing founders. Default is [].




___

<a id="name"></a>

###  name

**●  name**:  *`string`* 

*Defined in [contracts/daocreator.ts:290](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L290)*



The name of the new DAO.




___

<a id="tokenname"></a>

###  tokenName

**●  tokenName**:  *`string`* 

*Defined in [contracts/daocreator.ts:294](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L294)*



The name of the token to be associated with the DAO




___

<a id="tokensymbol"></a>

###  tokenSymbol

**●  tokenSymbol**:  *`string`* 

*Defined in [contracts/daocreator.ts:298](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L298)*



The symbol of the token to be associated with the DAO




___

<a id="universalcontroller"></a>

### «Optional» universalController

**●  universalController**:  *`boolean`* 

*Defined in [contracts/daocreator.ts:308](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L308)*



true to use the UniversalController contract, false to instantiate and use a new Controller contract. The default is true.




___


