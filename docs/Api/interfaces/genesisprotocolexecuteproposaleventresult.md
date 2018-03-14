[@DAOstack/Arc.js API Reference](../README.md) > [GenesisProtocolExecuteProposalEventResult](../interfaces/genesisprotocolexecuteproposaleventresult.md)



# Interface: GenesisProtocolExecuteProposalEventResult

## Hierarchy


 [ExecuteProposalEventResult](executeproposaleventresult.md)

**↳ GenesisProtocolExecuteProposalEventResult**








## Properties
<a id="_decision"></a>

###  _decision

**●  _decision**:  *`BigNumber.BigNumber`* 

*Inherited from [ExecuteProposalEventResult](executeproposaleventresult.md).[_decision](executeproposaleventresult.md#_decision)*

*Defined in [contracts/commonEventInterfaces.ts:18](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/commonEventInterfaces.ts#L18)*





___

<a id="_executionstate"></a>

###  _executionState

**●  _executionState**:  *`BigNumber.BigNumber`* 

*Defined in [contracts/genesisProtocol.ts:1411](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L1411)*



_executionState.toNumber() will give you a value from the enum `ExecutionState`




___

<a id="_proposalid"></a>

###  _proposalId

**●  _proposalId**:  *[Hash](../#hash)* 

*Inherited from [ExecuteProposalEventResult](executeproposaleventresult.md).[_proposalId](executeproposaleventresult.md#_proposalid)*

*Defined in [contracts/commonEventInterfaces.ts:22](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/commonEventInterfaces.ts#L22)*



indexed




___

<a id="_totalreputation"></a>

###  _totalReputation

**●  _totalReputation**:  *`BigNumber.BigNumber`* 

*Inherited from [ExecuteProposalEventResult](executeproposaleventresult.md).[_totalReputation](executeproposaleventresult.md#_totalreputation)*

*Defined in [contracts/commonEventInterfaces.ts:26](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/commonEventInterfaces.ts#L26)*



total reputation in the DAO at the time the proposal is created in the voting machine




___


