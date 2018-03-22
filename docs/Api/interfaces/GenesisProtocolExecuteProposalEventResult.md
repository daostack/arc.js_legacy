[API Reference](../README.md) > [GenesisProtocolExecuteProposalEventResult](../interfaces/GenesisProtocolExecuteProposalEventResult.md)



# Interface: GenesisProtocolExecuteProposalEventResult

## Hierarchy


 [ExecuteProposalEventResult](ExecuteProposalEventResult.md)

**↳ GenesisProtocolExecuteProposalEventResult**








## Properties
<a id="_decision"></a>

###  _decision

**●  _decision**:  *`BigNumber.BigNumber`* 

*Inherited from [ExecuteProposalEventResult](ExecuteProposalEventResult.md).[_decision](ExecuteProposalEventResult.md#_decision)*

*Defined in [wrappers/commonEventInterfaces.ts:18](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/commonEventInterfaces.ts#L18)*





___

<a id="_executionState"></a>

###  _executionState

**●  _executionState**:  *`BigNumber.BigNumber`* 

*Defined in [wrappers/genesisProtocol.ts:1405](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L1405)*



_executionState.toNumber() will give you a value from the enum `ExecutionState`




___

<a id="_proposalId"></a>

###  _proposalId

**●  _proposalId**:  *[Hash](../#Hash)* 

*Inherited from [ExecuteProposalEventResult](ExecuteProposalEventResult.md).[_proposalId](ExecuteProposalEventResult.md#_proposalId)*

*Defined in [wrappers/commonEventInterfaces.ts:22](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/commonEventInterfaces.ts#L22)*



indexed




___

<a id="_totalReputation"></a>

###  _totalReputation

**●  _totalReputation**:  *`BigNumber.BigNumber`* 

*Inherited from [ExecuteProposalEventResult](ExecuteProposalEventResult.md).[_totalReputation](ExecuteProposalEventResult.md#_totalReputation)*

*Defined in [wrappers/commonEventInterfaces.ts:26](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/commonEventInterfaces.ts#L26)*



total reputation in the DAO at the time the proposal is created in the voting machine




___


