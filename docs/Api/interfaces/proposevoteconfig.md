[API Reference](../README.md) > [ProposeVoteConfig](../interfaces/ProposeVoteConfig.md)



# Interface: ProposeVoteConfig


## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *`string`* 

*Defined in [contracts/genesisProtocol.ts:1139](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L1139)*



The DAO's avatar under which the proposal is being made.




___

<a id="executable"></a>

###  executable

**●  executable**:  *`string`* 

*Defined in [contracts/genesisProtocol.ts:1156](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L1156)*



contract that implements ExecutableInterface to invoke if/when the vote passes




___

<a id="numOfChoices"></a>

###  numOfChoices

**●  numOfChoices**:  *`number`* 

*Defined in [contracts/genesisProtocol.ts:1148](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L1148)*



number of choices when voting. Must be between 1 and 10.




___

<a id="paramsHash"></a>

###  paramsHash

**●  paramsHash**:  *`string`* 

*Defined in [contracts/genesisProtocol.ts:1152](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L1152)*



GenesisProtocol parameters to apply to this proposal




___

<a id="proposer"></a>

###  proposer

**●  proposer**:  *`string`* 

*Defined in [contracts/genesisProtocol.ts:1144](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/genesisProtocol.ts#L1144)*



address of the agent making the proposal. Default is the current default account.




___


