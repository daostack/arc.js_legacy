[API Reference](../README.md) > [ProposeVoteConfig](../interfaces/ProposeVoteConfig.md)



# Interface: ProposeVoteConfig


## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *[Address](../#Address)* 

*Defined in [wrappers/genesisProtocol.ts:1110](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L1110)*



The DAO's avatar under which the proposal is being made.




___

<a id="executable"></a>

###  executable

**●  executable**:  *`string`* 

*Defined in [wrappers/genesisProtocol.ts:1123](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L1123)*



contract that implements ExecutableInterface to invoke if/when the vote passes




___

<a id="numOfChoices"></a>

###  numOfChoices

**●  numOfChoices**:  *`number`* 

*Defined in [wrappers/genesisProtocol.ts:1119](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L1119)*



number of choices when voting. Must be between 1 and 10.




___

<a id="proposer"></a>

###  proposer

**●  proposer**:  *`string`* 

*Defined in [wrappers/genesisProtocol.ts:1115](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/genesisProtocol.ts#L1115)*



address of the agent making the proposal. Default is the current default account.




___


