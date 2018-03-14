[@DAOstack/Arc.js API Reference](../README.md) > [VoteInOrganizationProposeVoteConfig](../interfaces/voteinorganizationproposevoteconfig.md)



# Interface: VoteInOrganizationProposeVoteConfig


## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *`string`* 

*Defined in [contracts/voteInOrganizationScheme.ts:97](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/voteInOrganizationScheme.ts#L97)*



Avatar whose voters are being given the chance to vote on the original proposal.




___

<a id="originalintvote"></a>

###  originalIntVote

**●  originalIntVote**:  *`string`* 

*Defined in [contracts/voteInOrganizationScheme.ts:102](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/voteInOrganizationScheme.ts#L102)*



Address of the voting machine used by the original proposal. The voting machine must implement IntVoteInterface (as defined in Arc).




___

<a id="originalproposalid"></a>

###  originalProposalId

**●  originalProposalId**:  *`string`* 

*Defined in [contracts/voteInOrganizationScheme.ts:106](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/voteInOrganizationScheme.ts#L106)*



Address of the "original" proposal for which the DAO's vote will cast.




___


