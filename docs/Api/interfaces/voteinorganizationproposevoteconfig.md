[API Reference](../README.md) > [VoteInOrganizationProposeVoteConfig](../interfaces/VoteInOrganizationProposeVoteConfig.md)



# Interface: VoteInOrganizationProposeVoteConfig


## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *`string`* 

*Defined in [contracts/voteInOrganizationScheme.ts:98](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/voteInOrganizationScheme.ts#L98)*



Avatar whose voters are being given the chance to vote on the original proposal.




___

<a id="originalIntVote"></a>

###  originalIntVote

**●  originalIntVote**:  *`string`* 

*Defined in [contracts/voteInOrganizationScheme.ts:103](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/voteInOrganizationScheme.ts#L103)*



Address of the voting machine used by the original proposal. The voting machine must implement IntVoteInterface (as defined in Arc).




___

<a id="originalProposalId"></a>

###  originalProposalId

**●  originalProposalId**:  *`string`* 

*Defined in [contracts/voteInOrganizationScheme.ts:107](https://github.com/daostack/arc.js/blob/caacbb2/lib/contracts/voteInOrganizationScheme.ts#L107)*



Address of the "original" proposal for which the DAO's vote will cast.




___


