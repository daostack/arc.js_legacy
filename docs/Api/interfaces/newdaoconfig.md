[API Reference](../README.md) > [NewDaoConfig](../interfaces/NewDaoConfig.md)



# Interface: NewDaoConfig

## Hierarchy


 [ForgeOrgConfig](ForgeOrgConfig.md)

**↳ NewDaoConfig**








## Properties
<a id="daoCreator"></a>

### «Optional» daoCreator

**●  daoCreator**:  *`string`* 

*Defined in [dao.ts:305](https://github.com/daostack/arc.js/blob/caacbb2/lib/dao.ts#L305)*



The DaoCreator to use. Default is the DaoCreator supplied in this release of Arc.js.




___

<a id="founders"></a>

###  founders

**●  founders**:  *`Array`.<[FounderConfig](FounderConfig.md)>* 

*Inherited from [ForgeOrgConfig](ForgeOrgConfig.md).[founders](ForgeOrgConfig.md#founders)*

*Defined in [contracts/daocreator.ts:314](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/daocreator.ts#L314)*



Optional array describing founders. Default is [].




___

<a id="name"></a>

###  name

**●  name**:  *`string`* 

*Inherited from [ForgeOrgConfig](ForgeOrgConfig.md).[name](ForgeOrgConfig.md#name)*

*Defined in [contracts/daocreator.ts:301](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/daocreator.ts#L301)*



The name of the new DAO.




___

<a id="tokenName"></a>

###  tokenName

**●  tokenName**:  *`string`* 

*Inherited from [ForgeOrgConfig](ForgeOrgConfig.md).[tokenName](ForgeOrgConfig.md#tokenName)*

*Defined in [contracts/daocreator.ts:305](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/daocreator.ts#L305)*



The name of the token to be associated with the DAO




___

<a id="tokenSymbol"></a>

###  tokenSymbol

**●  tokenSymbol**:  *`string`* 

*Inherited from [ForgeOrgConfig](ForgeOrgConfig.md).[tokenSymbol](ForgeOrgConfig.md#tokenSymbol)*

*Defined in [contracts/daocreator.ts:309](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/daocreator.ts#L309)*



The symbol of the token to be associated with the DAO




___

<a id="universalController"></a>

### «Optional» universalController

**●  universalController**:  *`boolean`* 

*Inherited from [ForgeOrgConfig](ForgeOrgConfig.md).[universalController](ForgeOrgConfig.md#universalController)*

*Defined in [contracts/daocreator.ts:319](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/daocreator.ts#L319)*



true to use the UniversalController contract, false to instantiate and use a new Controller contract. The default is true.




___


