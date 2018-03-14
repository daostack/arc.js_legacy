[@DAOstack/Arc.js API Reference](../README.md) > [ProposeVoteConfig](../interfaces/proposevoteconfig.md)



# Interface: ProposeVoteConfig


## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *`string`* 

*Defined in [contracts/genesisProtocol.ts:1129](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L1129)*



The DAO's avatar under which the proposal is being made.




___

<a id="executable"></a>

###  executable

**●  executable**:  *`string`* 

*Defined in [contracts/genesisProtocol.ts:1146](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L1146)*



contract that implements ExecutableInterface to invoke if/when the vote passes




___

<a id="numofchoices"></a>

###  numOfChoices

**●  numOfChoices**:  *`number`* 

*Defined in [contracts/genesisProtocol.ts:1138](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L1138)*



number of choices when voting. Must be between 1 and 10.




___

<a id="paramshash"></a>

###  paramsHash

**●  paramsHash**:  *`string`* 

*Defined in [contracts/genesisProtocol.ts:1142](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L1142)*



GenesisProtocol parameters to apply to this proposal




___

<a id="proposer"></a>

###  proposer

**●  proposer**:  *`string`* 

*Defined in [contracts/genesisProtocol.ts:1134](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/genesisProtocol.ts#L1134)*



address of the agent making the proposal. Default is the current default account.




___


