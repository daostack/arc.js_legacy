# Working with Proposals and Schemes

The ability to create proposals, vote one's reputation and stake one's reputation and tokens on an outcome of a vote are fundamental to promoting coherence and collaboration within and between DAOs in the DAOstack ecosystem.

!!! info
    Refer here for more [about DAOs in Arc.js](Daos) and [about DAOstack's vision for a DAO ecosystem](https://daostack.io/).

It all starts with "scheme" contracts that generate proposals and supply a voting machine for each proposal.

<a name="schemes"></a>
## Schemes

Schemes are public-facing contracts that any agent can use to interact with the DAOstack ecosystem and individual DAOs. You can use schemes for various tasks like creating a new DAO ([DaoCreatorWrapper](api/classes/DaoCreatorWrapper)), running an ICO (`SimpleICO`) or managing a DAO registry (`OrganizationRegister`).

!!! note
    `SimpleICO` and `OrganizationRegister` do not yet have [wrapper classes](Wrappers) in Arc.js.

Most Arc schemes are specifically designed to generate proposals.

!!! info
    More information about schemes:

    - [All the schemes wrapped in Arc.js](Wrappers#wrappersByContractType)
    - [Obtaining a list of schemes registered with a DAO](Daos#gettingDaoSchemes)
    - [Universal Schemes in Arc](https://daostack.github.io/arc/contracts/universalSchemes/README/)
    

## Proposals
Proposals are emergent ideas put up for a vote by a DAO. Voting on a proposal proceeds according to rules and parameters of [voting machines](#votingmachines).  We use proposal-generating schemes to create proposals and supply them with a voting machine configured when the scheme was registered with the DAO's controller.

!!! note
    Any scheme that works with proposals must be registered with a DAO's controller, either when you [create the DAO](Daos#creatingDAOs) or afterwards using the [SchemeRegistrar](api/classes/SchemeRegistrarWrapper).

The following table describes the various proposals you can create using scheme contract wrappers in Arc.js:

<a name="proposalschemestable"></a>

Proposal | Scheme Wrapper Class | Scheme Method
---------|----------|---------
 Propose to reward an agent for contributions to the DAO | ContributionRewardWrapper | [proposeContributionReward](/api/classes/ContributionRewardWrapper#proposeContributionReward)
 Propose to add or modify a global constraint | GlobalConstraintRegistrarWrapper | [proposeToAddModifyGlobalConstraint](/api/classes/GlobalConstraintRegistrarWrapper#proposeToAddModifyGlobalConstraint)
 Propose to remove a global constraint | GlobalConstraintRegistrarWrapper | [proposeToRemoveGlobalConstraint](/api/classes/GlobalConstraintRegistrarWrapper#proposeToRemoveGlobalConstraint)
 Propose to add or modify a scheme | SchemeRegistrarWrapper | [proposeToAddModifyScheme](/api/classes/SchemeRegistrarWrapper#proposeToAddModifyScheme)
 Propose to remove a scheme | SchemeRegistrarWrapper | [proposeToRemoveScheme](/api/classes/SchemeRegistrarWrapper#proposeToRemoveScheme)
 Propose an alternative Controller for the DAO | UpgradeSchemeWrapper | [proposeController](/api/classes/UpgradeSchemeWrapper#proposeController)
 Propse an alternative UpgradeScheme | UpgradeSchemeWrapper | [proposeUpgradingScheme](/api/classes/UpgradeSchemeWrapper#proposeUpgradingScheme)
 Propose a vesting agreement | VestingSchemeWrapper | [proposeVestingAgreement](/api/classes/VestingSchemeWrapper#proposeVestingAgreement)
 Propose to vote for any proposal in another DAO | VoteInOrganizationSchemeWrapper | [proposeVoteInOrganization](/api/classes/VoteInOrganizationSchemeWrapper#proposeVoteInOrganization)

Each of the scheme methods listed in the table above returns a promise of an [ArcTransactionProposalResult](/api/classes/ArcTransactionProposalResult) that will contain:

- `proposalId` - a Hash value that uniquely identifies a proposal, used to identify proposals everywhere where we refer to a proposal.
- `votingMachine` - the voting machine for the proposal, as an [IntVoteInterfaceWrapper](/api/classes/IntVoteInterfaceWrapper), facilitating operations such as voting on the proposal. (see [Voting Machines](#votingmachines)).

Proposals follow a lifecycle of creation and execution (execution is whatever happens when the voting process concludes). `GenesisProtocal` votes can expire.  You may find yourself wanting to keep track of a proposal's lifecycle, and for that you use events. The following section describes how.


<a name="proposalevents"></a>
### Proposal Events

Each scheme responsible for creating proposals enables you to track important events during a proposal's lifecycle (see the [table of proposal types above](#proposalschemestable)).  Voting machines do the same (see [Voting Machines](#votingmachines)).

Every scheme provides `EventFetcherFactory`s that correspond directly to the events thrown by the scheme's Arc contract.  Proposal-generating schemes also provide special `EntityFetcherFactory`s that fetch entities about:

- **Votable proposals** - For each proposal type, the fetched entity will contain information about the proposal, plus an instance of [IntVoteInterfaceWrapper](/api/classes/IntVoteInterfaceWrapper) for the proposal's voting machine, facilitating operations such as voting on the proposal.  See `getVotable[*]Proposals` in each scheme.

- **Executed proposals** - Some of the schemes provide additional information in the fetched entity, where additional information is available.  See `getExecutedProposals` in each scheme.

!!! Info
    See [Enhanced Web3 Events](Events#almostrawevents) and [Entities for Web3 Events](Events#entityevents) for more information about these event-fetching interfaces.

Like the schemes, the `GenesisProtocol` voting machine provides special `EntityFetcherFactory`s for fetching events about votable and executed proposals.  The fetched entity will contain additional information relevant to the proposal that you will not get via the scheme or `IntVoteInterface` events. See [VotableGenesisProtocolProposals](/api/classes/GenesisProtocolWrapper#VotableGenesisProtocolProposals) and [ExecutedProposals](/api/classes/GenesisProtocolWrapper#ExecutedProposals).

See more about voting machines below.

<a name="votingmachines"></a>
## Voting Machines

Voting machines play an integral part in promoting coherence and collaboration within and between DAOs in the DAOstack ecosystem.  Which voting machine you choose to use for your DAO or DAO scheme, and how you configure it, can profoundly affect the emergent qualities of your organization.

Every proposal-generating scheme has an associated voting machine with appropriate configurations for the scheme.  Every proposal created by the scheme will use the scheme's voting machine.  

!!! tip
    Find more information about Arc voting machines in the [Arc documentation](https://daostack.github.io/arc/contracts/VotingMachines/README/).

Arc.js wraps two Arc voting machines: [AbsoluteVote](/api/classes/AbsoluteVoteWrapper) and [GenesisProtocol](/api/classes/GenesisProtocolWrapper).  While each of these voting machines have their own individual API, they both implement a common Arc interface called `IntVoteInterface`.  

!!! info
    Each of the Arc.js voting machine contract wrapper classes implement a common base class called [IntVoteInterfaceWrapper](/api/classes/IntVoteInterfaceWrapper).

!!! note
    Arc has another voting machine contract called `QuorumVote` that Arc.js does not yet wrap.

The `IntVoteInterfaceWrapper` gives you the convenience of working with a voting machine wrapper without having to know which voting machine it is.  You may encounter `IntVoteInterfaceWrapper` in several places:

- You can obtain an [IntVoteInterfaceWrapper](/api/classes/IntVoteInterfaceWrapper) for the voting machine associated with any proposal-generating scheme using the scheme's `getVotingMachine` method.

- Every [method that creates a proposal](#proposalschemestable) returns an `IntVoteInterfaceWrapper` in the [ArcTransactionProposalResult](/api/classes/ArcTransactionProposalResult).

- Every scheme's `EntityFetcherFactory` that returns votable proposals will supply an `IntVoteInterfaceWrapper` in the fetched entity.
