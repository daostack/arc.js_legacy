[@DAOstack/Arc.js API Reference](../README.md) > [NewDaoConfig](../interfaces/newdaoconfig.md)



# Interface: NewDaoConfig

## Hierarchy


 [ForgeOrgConfig](forgeorgconfig.md)

**↳ NewDaoConfig**








## Properties
<a id="daocreator"></a>

### «Optional» daoCreator

**●  daoCreator**:  *`string`* 

*Defined in [dao.ts:305](https://github.com/daostack/arc.js/blob/0fff6d4/lib/dao.ts#L305)*



The DaoCreator to use. Default is the DaoCreator supplied in this release of Arc.js.




___

<a id="founders"></a>

###  founders

**●  founders**:  *`Array`.<[FounderConfig](founderconfig.md)>* 

*Inherited from [ForgeOrgConfig](forgeorgconfig.md).[founders](forgeorgconfig.md#founders)*

*Defined in [contracts/daocreator.ts:303](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L303)*



Optional array describing founders. Default is [].




___

<a id="name"></a>

###  name

**●  name**:  *`string`* 

*Inherited from [ForgeOrgConfig](forgeorgconfig.md).[name](forgeorgconfig.md#name)*

*Defined in [contracts/daocreator.ts:290](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L290)*



The name of the new DAO.




___

<a id="tokenname"></a>

###  tokenName

**●  tokenName**:  *`string`* 

*Inherited from [ForgeOrgConfig](forgeorgconfig.md).[tokenName](forgeorgconfig.md#tokenname)*

*Defined in [contracts/daocreator.ts:294](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L294)*



The name of the token to be associated with the DAO




___

<a id="tokensymbol"></a>

###  tokenSymbol

**●  tokenSymbol**:  *`string`* 

*Inherited from [ForgeOrgConfig](forgeorgconfig.md).[tokenSymbol](forgeorgconfig.md#tokensymbol)*

*Defined in [contracts/daocreator.ts:298](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L298)*



The symbol of the token to be associated with the DAO




___

<a id="universalcontroller"></a>

### «Optional» universalController

**●  universalController**:  *`boolean`* 

*Inherited from [ForgeOrgConfig](forgeorgconfig.md).[universalController](forgeorgconfig.md#universalcontroller)*

*Defined in [contracts/daocreator.ts:308](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/daocreator.ts#L308)*



true to use the UniversalController contract, false to instantiate and use a new Controller contract. The default is true.




___


