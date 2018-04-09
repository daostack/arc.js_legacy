# Working with Proposals and Schemes

The ability to create proposals, vote one's reputation and stake one's reputation and tokens on an outcome of a vote are fundamental to promoting coherence and collaboration within and between DAOs in the DAOstack ecosystem.

!!! info
    Refer here for more [about DAOs](Daos).

## Schemes
<a name="schemes"></a>

Schemes are public-facing contracts that any agent can use when they want perform primary functions relating to the DAOstack environment or respecting the domain of a particular DAO.

You can use schemes in the context of the general DAOstack environment for various functions such as creating a new DAO ([DaoCreatorWrapper](api/classes/DaoCreatorWrapper)), running an ICO (`SimpleICO`) or managing a DAO registry (`OrganizationRegister`).

!!! note
    `SimpleICO` and `OrganizationRegister` do not yet have [wrapper classes](Wrappers) in Arc.js.

Most often we use schemes to perform primary functions respecting a particular DAO, especially when working with proposals.

For a scheme to be used by a DAO, it must be "registered" with the DAO.  Schemes can be registered both when you [create the DAO](Daos#creatingDAOs) and afterwards using the [SchemeRegistrar](api/classes/SchemeRegistrarWrapper).  Refer here for how to [obtain a list of schemes registered with a DAO](Daos#gettingDaoSchemes).

Here is a list of the schemes currently wrapped by Arc.js:

* ContributionReward
* GenesisProtocol
* GlobalConstraintRegistrar
* SchemeRegistrar
* UpgradeScheme
* VoteInOrganizationScheme
* VestingScheme

Refer here for how to [obtain this list of scheme wrappers at runtime](Wrappers#enumerate-wrappers-by-contract-type).

## Proposals
[More on Proposals to Come]

### Voting Machines
