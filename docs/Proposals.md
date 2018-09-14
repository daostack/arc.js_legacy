# Working with Schemes, Proposals and Voting Machines

The ability to create proposals, vote one's reputation and stake one's reputation and tokens on the outcome of a vote are fundamental to promoting coherence and collaboration within DAOs in the DAOstack ecosystem.

!!! info "More about DAOs"
    - [Working with DAOs in Arc.js](Daos)
    - [The Arc Platform](https://medium.com/daostack/the-arc-platform-2353229a32fc)
    - [About DAOstack's vision for a DAO ecosystem](https://daostack.io/)

It all starts with "scheme" contracts that can generate proposals and supply a voting machine for each proposal.

<a name="schemes"></a>
## Schemes

Schemes in general are public-facing contracts that any agent may use when they want perform primary functions relating to a particular DAO.

Schemes are registered with a DAO's controller enabling them to access the controller's functionality.  Schemes can be "universal", which means that a single contract instance can serve multiple DAOs by storing DAO-specific parameters with the DAO's controller.  The implementation of a certain interface is what identifies a scheme as "universal".  Some schemes have the ability to create proposals and thus require that a configured voting machine be specified in the scheme's parameters.

!!! info "More Information about Schemes"

    - [All the schemes wrapped in Arc.js](Wrappers#wrappersByContractType)
    - [Obtaining a list of schemes registered with a DAO](Daos#gettingDaoSchemes)
    - [Universal Schemes in Arc](https://daostack.github.io/arc/contracts/universalSchemes/README/)
    
<a name="proposals"></a>
## Proposals
As ideas emerge from a DAO's community they can be submitted as proposals to the DAO using a DAO scheme. Proposals are then subject to a vote that proceeds according to the rules of the scheme's [voting machine](#votingmachines). The voting machine and its configuration were supplied to the scheme when the scheme was registered with the DAO's controller.

!!! note
    Schemes are registered with a DAO's controller either when the DAO [is created](Daos#creatingDAOs) or afterwards using the [SchemeRegistrar](api/classes/SchemeRegistrarWrapper).

The following table describes the various proposals you can create using scheme contract wrappers in Arc.js:

<a name="proposalschemestable"></a>

Proposal | Scheme Wrapper Class | Scheme Method
---------|----------|---------
 Propose to reward an agent for contributions to the DAO | [ContributionRewardWrapper](/api/classes/ContributionRewardWrapper) | [proposeContributionReward](/api/classes/ContributionRewardWrapper#proposeContributionReward)
Propose to add or modify a global constraint | [GlobalConstraintRegistrarWrapper](/api/classes/GlobalConstraintRegistrarWrapper) | [proposeToAddModifyGlobalConstraint](/api/classes/GlobalConstraintRegistrarWrapper#proposeToAddModifyGlobalConstraint)
Propose to remove a global constraint | [GlobalConstraintRegistrarWrapper](/api/classes/GlobalConstraintRegistrarWrapper) | [proposeToRemoveGlobalConstraint](/api/classes/GlobalConstraintRegistrarWrapper#proposeToRemoveGlobalConstraint)
Propose to add or modify a scheme | [SchemeRegistrarWrapper](/api/classes/SchemeRegistrarWrapper) | [proposeToAddModifyScheme](/api/classes/SchemeRegistrarWrapper#proposeToAddModifyScheme)
Propose to remove a scheme | [SchemeRegistrarWrapper](/api/classes/SchemeRegistrarWrapper) | [proposeToRemoveScheme](/api/classes/SchemeRegistrarWrapper#proposeToRemoveScheme)
Propose an alternative Controller for the DAO | [UpgradeSchemeWrapper](/api/classes/UpgradeSchemeWrapper) | [proposeController](/api/classes/UpgradeSchemeWrapper#proposeController)
Propse an alternative UpgradeScheme | [UpgradeSchemeWrapper](/api/classes/UpgradeSchemeWrapper) | [proposeUpgradingScheme](/api/classes/UpgradeSchemeWrapper#proposeUpgradingScheme)
Propose a vesting agreement | [VestingSchemeWrapper](/api/classes/VestingSchemeWrapper) | [proposeVestingAgreement](/api/classes/VestingSchemeWrapper#proposeVestingAgreement)
Propose to vote for any proposal in another DAO | [VoteInOrganizationSchemeWrapper](/api/classes/VoteInOrganizationSchemeWrapper) | [proposeVoteInOrganization](/api/classes/VoteInOrganizationSchemeWrapper#proposeVoteInOrganization)

Each of the scheme methods listed in the table above returns a promise of an [ArcTransactionProposalResult](/api/classes/ArcTransactionProposalResult) that will contain:

- `proposalId` - a Hash value that uniquely identifies a proposal, used to identify proposals everywhere where we refer to a proposal.
- `votingMachine` - the voting machine for the proposal, as an [IntVoteInterfaceWrapper](/api/classes/IntVoteInterfaceWrapper), facilitating operations such as voting on the proposal. (see [Voting Machines](#votingmachines)).

Proposals follow a lifecycle of creation and execution (execution is whatever happens when the voting process concludes). `GenesisProtocal` votes can also expire.  You may find yourself wanting to keep track of a proposal's lifecycle, and for that you use events. The following section describes how.


<a name="proposalevents"></a>
### Proposal Events

Each scheme responsible for creating proposals enables you to track important events during a proposal's lifecycle (see the [table of proposal types above](#proposalschemestable)).  Voting machines do the same (see [Voting Machines](#votingmachines)).

Every scheme provides instances of `EventFetcherFactory` that correspond directly to the events thrown by the scheme's Arc contract.  Proposal-generating schemes also provide special instances of `EntityFetcherFactory` that fetch information about:

- **Votable proposals** - For each proposal type, the fetched entity will contain information about the proposal, plus an instance of [IntVoteInterfaceWrapper](/api/classes/IntVoteInterfaceWrapper) for the proposal's voting machine, facilitating operations such as voting on the proposal.  See `getVotable[*]Proposals` in each scheme.

- **Executed proposals** - Some of the schemes provide additional information in the fetched entity, where additional information is available.  See `getExecutedProposals` in each scheme.

!!! Info "More on Events"
    See [Enhanced Web3 Events](Events#enhancedweb3events) and [Entities for Web3 Events](Events#entityevents) for more information about these event-fetching interfaces.

Like the schemes, the `GenesisProtocolWrapper` voting machine provides special instances of `EntityFetcherFactory` to be used for fetching events about votable and executed proposals.  The fetched entity will contain additional information relevant to the proposal that you will not get via the scheme or `IntVoteInterface` events. See [VotableGenesisProtocolProposals](/api/classes/GenesisProtocolWrapper#VotableGenesisProtocolProposals) and [ExecutedProposals](/api/classes/GenesisProtocolWrapper#ExecutedProposals).

<a name="votingmachines"></a>
## Voting Machines

Voting machines play an integral part in promoting coherence and collaboration within and between DAOs in the DAOstack ecosystem.  Which voting machine you choose to use for your DAO or DAO scheme, and how you configure it, can profoundly affect the emergent behavior of your DAO and the community that is using it.

Every proposal-generating scheme has an associated voting machine with a configuration that is registered with the controller.  Every proposal created by the scheme will use the scheme's voting machine.  

!!! info "More about Voting Machines"
    - [Voting Machines in Arc](https://daostack.github.io/arc/contracts/VotingMachines/README/).

Arc.js wraps two Arc voting machines: [AbsoluteVote](/api/classes/AbsoluteVoteWrapper) and [GenesisProtocol](/api/classes/GenesisProtocolWrapper).  While each of these voting machines have their own individual API, they both implement a common Arc interface called `IntVoteInterface` which Arc.js wraps in [IntVoteInterfaceWrapper](/api/classes/IntVoteInterfaceWrapper).

!!! note
    Arc has another voting machine contract called `QuorumVote` that Arc.js does not yet wrap.

The `IntVoteInterfaceWrapper` gives you the convenience of working with a voting machine wrapper without having to know which voting machine it is.  You may encounter `IntVoteInterfaceWrapper` in several places:

- You can obtain an [IntVoteInterfaceWrapper](/api/classes/IntVoteInterfaceWrapper) for the voting machine associated with any proposal-generating scheme using the scheme's `getVotingMachine` method.

- Every [method that creates a proposal](#proposalschemestable) returns an `IntVoteInterfaceWrapper` in the [ArcTransactionProposalResult](/api/classes/ArcTransactionProposalResult).

- Every scheme's `EntityFetcherFactory` that returns votable proposals will supply an `IntVoteInterfaceWrapper` in the fetched entity.

## Set a Universal Scheme's Parameters

When we register a universal scheme against a controller we are basically registering with the controller the hash of a set of scheme parameters and giving the scheme permission to later access the controller to obtain the parameters hash.  When later we want to use the universal scheme, we will pass to it the address of the avatar we are using, enabling the scheme to obtain from the controller the hash of the parameters that we registered for the scheme.  The scheme then needs some way to turn that hash back into an object whose hash we registered with the controller.

 So each scheme has a function called `setParameters` that passes the parameters object to the scheme, whereupon the scheme hashes the object and stores it internally in a Solidity `mapping` where the key is the parameters hash and the value is the object containing the parameters.  Until we do this, even if the scheme and its parameters have been registered with a controller, the scheme will not be able to find the parameters and any function requiring them will fail.

Here is an example that lets `UpgradeScheme` know about a set of parameter values, implying that we are going to be registering the scheme against a controller and with the given set of parameters:

```javascript
const paramsHash = await upgradeSchemeWrapper.setParameters({
  voteParametersHash: aHash,
  votingMachineAddress: anAddress
});
```

`setParameters` will extract what it needs from your object, validate their values, and always set default values on any missing properties.  It will return an `ArcTransactionDataResult<Hash>` where the `Hash` is of the parameters.

## Get a Universal Scheme's Parameters

If you want to obtain a universal scheme's parameters as registered against a given DAO's controller, use `getSchemeParameters`:

```javascript
const schemeParameters = await upgradeSchemeWrapper.getSchemeParameters(avatarAddress);
const votingMachineAddress = schemeParameters.votingMachineAddress;
```

This will return an object containing the scheme's parameter values.  The object will be the same as that which one passes to `upgradeSchemeWrapper.setParameters`.
