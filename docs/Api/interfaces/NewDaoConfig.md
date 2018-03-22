[API Reference](../README.md) > [NewDaoConfig](../interfaces/NewDaoConfig.md)



# Interface: NewDaoConfig

## Hierarchy


 [ForgeOrgConfig](ForgeOrgConfig.md)

**↳ NewDaoConfig**








## Properties
<a id="daoCreator"></a>

### «Optional» daoCreator

**●  daoCreator**:  *`string`* 

*Defined in dao.ts:305*



The DaoCreator to use. Default is the DaoCreator supplied in this release of Arc.js.




___

<a id="founders"></a>

###  founders

**●  founders**:  *`Array`.<[FounderConfig](FounderConfig.md)>* 

*Inherited from [ForgeOrgConfig](ForgeOrgConfig.md).[founders](ForgeOrgConfig.md#founders)*

*Defined in [wrappers/daocreator.ts:313](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L313)*



Optional array describing founders. Default is [].




___

<a id="name"></a>

###  name

**●  name**:  *`string`* 

*Inherited from [ForgeOrgConfig](ForgeOrgConfig.md).[name](ForgeOrgConfig.md#name)*

*Defined in [wrappers/daocreator.ts:300](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L300)*



The name of the new DAO.




___

<a id="tokenName"></a>

###  tokenName

**●  tokenName**:  *`string`* 

*Inherited from [ForgeOrgConfig](ForgeOrgConfig.md).[tokenName](ForgeOrgConfig.md#tokenName)*

*Defined in [wrappers/daocreator.ts:304](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L304)*



The name of the token to be associated with the DAO




___

<a id="tokenSymbol"></a>

###  tokenSymbol

**●  tokenSymbol**:  *`string`* 

*Inherited from [ForgeOrgConfig](ForgeOrgConfig.md).[tokenSymbol](ForgeOrgConfig.md#tokenSymbol)*

*Defined in [wrappers/daocreator.ts:308](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L308)*



The symbol of the token to be associated with the DAO




___

<a id="universalController"></a>

### «Optional» universalController

**●  universalController**:  *`boolean`* 

*Inherited from [ForgeOrgConfig](ForgeOrgConfig.md).[universalController](ForgeOrgConfig.md#universalController)*

*Defined in [wrappers/daocreator.ts:318](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/daocreator.ts#L318)*



true to use the UniversalController contract, false to instantiate and use a new Controller contract. The default is true.




___


