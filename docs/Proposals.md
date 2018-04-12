# Working with Proposals and Schemes

The ability to create proposals, vote one's reputation and stake one's reputation and tokens on an outcome of a vote are fundamental to promoting coherence and collaboration within and between DAOs in the DAOstack ecosystem.

!!! info
    Refer here for more [about DAOs in Arc.js](Daos) and [about DAOstack's vision for a DAO ecosystem](https://daostack.io/).

<a name="schemes"></a>
## Schemes

Schemes are public-facing contracts that any agent can use to interact with the DAOstack ecosystem and individual DAOs. You can use schemes for various tasks like creating a new DAO ([DaoCreatorWrapper](api/classes/DaoCreatorWrapper)), running an ICO (`SimpleICO`) or managing a DAO registry (`OrganizationRegister`).

!!! note
    `SimpleICO` and `OrganizationRegister` do not yet have [wrapper classes](Wrappers) in Arc.js.

Often we use schemes for working with proposals. Any scheme that works with proposals must be registered with a DAO's controller.  Schemes can be registered both when you [create the DAO](Daos#creatingDAOs) and afterwards using the [SchemeRegistrar](api/classes/SchemeRegistrarWrapper).  


!!! info "More Information about Schemes"
    - [All the schemes wrapped in Arc.js](Wrappers#wrappersByContractType)
    - [Obtaining a list of schemes registered with a DAO](Daos#gettingDaoSchemes)
    - [Universal Schemes in Arc](https://daostack.github.io/arc/contracts/universalSchemes/README/)
    

## Proposals
[More on Proposals to Come]

### Voting Machines
[More on Voting Machines to Come]
