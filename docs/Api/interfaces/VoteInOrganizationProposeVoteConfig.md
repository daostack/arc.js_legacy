[API Reference](../README.md) > [VoteInOrganizationProposeVoteConfig](../interfaces/VoteInOrganizationProposeVoteConfig.md)



# Interface: VoteInOrganizationProposeVoteConfig


## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *[Address](../#Address)* 

*Defined in [wrappers/voteInOrganizationScheme.ts:103](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/voteInOrganizationScheme.ts#L103)*



Avatar whose voters are being given the chance to vote on the original proposal.




___

<a id="originalIntVote"></a>

###  originalIntVote

**●  originalIntVote**:  *`string`* 

*Defined in [wrappers/voteInOrganizationScheme.ts:108](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/voteInOrganizationScheme.ts#L108)*



Address of the voting machine used by the original proposal. The voting machine must implement IntVoteInterface (as defined in Arc).




___

<a id="originalProposalId"></a>

###  originalProposalId

**●  originalProposalId**:  *`string`* 

*Defined in [wrappers/voteInOrganizationScheme.ts:112](https://github.com/daostack/arc.js/blob/42de6847/lib/wrappers/voteInOrganizationScheme.ts#L112)*



Address of the "original" proposal for which the DAO's vote will cast.




___


