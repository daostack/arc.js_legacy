[@DAOstack/Arc.js API Reference](../README.md) > [ArcContractInfo](../interfaces/arccontractinfo.md)



# Interface: ArcContractInfo


Arc contract information as contained in ArcDeployedContractNames


## Properties
<a id="address"></a>

###  address

**●  address**:  *`string`* 

*Defined in [contracts.ts:26](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts.ts#L26)*



address of the instance deployed by Arc. Calling contract.at() (a static method on ContractWrapperFactory) will return the fully hydrated instance of the wrapper class.




___

<a id="contract"></a>

###  contract

**●  contract**:  *`any`* 

*Defined in [contracts.ts:20](https://github.com/daostack/arc.js/blob/6909d59/lib/contracts.ts#L20)*



ContractWrapperFactory that has static methods that return the contract wrapper.




___

