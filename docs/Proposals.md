# Working with Proposals and Schemes

The ability to create proposals, vote one's reputation, and stake one's reputation and tokens on an outcome of the vote are primary functions of a DAO in the DAOstack ecosystem.  Proposals and how they distribute tokens and reputation are fundamental to promoting coherence and collaboration within and between DAOs in the DAOstack ecosystem.

!!! info
    Refer here for more [about DAOs](Daos).

## Schemes

Schemes are public-facing Arc contracts whose primary purpose is to manage proposals respecting the DAO (though technically they could be used for any purpose). For a scheme to be used by a DAO, it must be "registered" with the DAO.  Schemes can be registered both when you create the DAO and afterwards using the `SchemeRegistrar` Arc contract.  Refer here for how to [obtain a list of schemes registered with a DAO](DAOs#get-all-the-schemes-registered-to-the-dao).

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
