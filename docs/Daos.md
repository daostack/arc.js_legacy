# Working with DAOs

Arc.js provides a class called [DAO](api/classes/DAO) that facilitates creating and working with DAOs.  Read on for more information about DAOs in DAOstack and the [DAO](api/classes/DAO) class.

## About DAOs

Every DAO in DAOstack includes an avatar, a controller, a token, a reputation system, and zero or more schemes and global constraints.

**The avatar** is a public-facing part of the DAO that handles the interaction of the DAO with the rest of the world, for example interacting with other DAOs or paying third party agents.  A DAO is always referenced by the address of its avatar.

**The controller** is a central internal hub for all of the components of the DAO.  DAOstack documentation often refers to the various DAO components as "organs".

!!! note
    Any contract or agent's address can be registered like a scheme with the controller and thus work directly with the controller.

**The token** is used as currency in operations like staking in `GenesisProtocol`, vesting agreements in `VestingScheme` and rewards in `ContributionReward`.

**The reputation system** provides a kind of currency of influence. Reputation conveys influence in the DAO commenserate with the rules 
of the DAO, such as when voting and the nature of what causes it to be gained or lost.  Like tokens, reputation can be minted, but it cannot be transferred between agents.

**Schemes** are public-facing contracts that any agent can use when they want perform primary functions relating to the DAOstack environment or respecting the domain of a particular DAO.  Refer here to [more about schemes](Proposals#schemes).

**Global constraints** use configured criteria to block actions attempted by the Controller that would violate a given constraint.  An example is [TokenCapGC](api/classes/TokenCapGCWrapper) that limits the total supply of a given token to a certain maximum number.

DAOs are extensible beyond the reusability of all Arc contracts: You can provide your own implementation of the controller, token, and any global constraints, voting machines and schemes you want.

!!! info
    Refer here for [more information about the architecture of DAOs](https://daostack.github.io/arc/README/#the-structure-of-a-dao).

!!! info
    Refer here for [more information about proposals](Proposals).
    
## Creating a new DAO
<a name="creatingDAOs"></a>

When creating a DAO you can configure its name, token, founders and schemes.  For schemes you configure their parameters, permissions and their voting machine.

You can call [DAO.new](api/classes/DAO#new) to create a new DAO, passing it a [configuration object](api/interfaces/NewDaoConfig).

Almost everything in the configuration has a default.  The following sections describe how to supply custom configurations.

!!! tip
    Under the hood, `Dao.new` uses the [DaoCreatorWrapper](api/classes/DaoCreatorWrapper) class.

### Creating a new DAO with all defaults

The simplest example of how to create a new DAO uses all defaults:  No schemes nor founders:

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT"
});
```

And voilà, you have created a new DAO in the DAO stack on Ethereum.  The returned object `newDao` is an instance of [DAO](api/classes/DAO) and you are off and running.  But you won't run far without schemes and founders who can make proposals and vote on them, and for that, the founders will need some reputation.

### Creating a new DAO with founders

Create a new DAO with founders by including a "founders" array.  This will automatically mint tokens and reputation to each founder:

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  founders: [
    {
      // the current user
      address: accounts[0],
      reputation: web3.toWei(1000),
      tokens: web3.toWei(40)
    },
    {
      address: founder1Address,
      reputation: web3.toWei(1000),
      tokens: web3.toWei(40)
    },
    {
      address: founder2Address,
      reputation: web3.toWei(1000),
      tokens: web3.toWei(40)
    }
  ]
});
```

!!! note
    It is not possible to add or remove founders.  In fact, there is no retained sense of who they even were .  They are simply addresses you supply when you create a DAO and to whom will immediately be minted tokens and reputation.  You can mint reputation or tokens to others... this would effectively be like adding them as founders.

So this DAO has founders with tokens and reputation, but no way to make proposals, that is, no schemes, and thus nothing on which to vote.  The DAO needs some schemes, at minimum a [SchemeRegistrar](api/classes/SchemeRegistrarWrapper) with which you can propose to add, modify or remove other schemes.

### Creating a new DAO with schemes

Create a new DAO with schemes by including a "schemes" array.  The following example registers the schemes with all default parameters, permissions and voting machines.

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  schemes: [
    { name: "SchemeRegistrar" },
    { name: "UpgradeScheme" },
    { name: "GlobalConstraintRegistrar" }
  ]
});
```

Put the last two examples together and you have a DAO with founders and schemes and can really start to realize the full potential of a DAO in the DAOstack stack.

!!! info
    Refer here to [more about schemes](Proposals#schemes).

What if we want to configure how voting will proceed when someone submits a proposal?

### Creating a new DAO overriding the default voting machine

By default, `DAO.new` configures each scheme with the [AbsoluteVote](api/classes/AbsoluteVoteWrapper) voting machine and default voting parameter values.  The following example retains the default voting machine while overriding its parameters:


```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  votingMachineParams: {
    votePerc: 45,
    ownerVote: false
  }
});
```

Here we supply an alternate voting machine address, supplying it [AbsoluteVote](api/classes/**AbsoluteVoteWrapper**) parameters:

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  votingMachineParams: {
    votePerc: 45,
    ownerVote:false
    votingMachineAddress: anAddress
  }
});
```

Here we supply a different default voting machine ([GenesisProtocol](api/classes/GenesisProtocolWrapper)), with default voting parameters:

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  votingMachineParams: {
    votingMachineName: "GenesisProtocol"
  }
});
```

Here we override the default voting machine parameters on just one of the schemes:

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  schemes: [
    { name: "SchemeRegistrar" },
    { name: "UpgradeScheme" },
    {
      name: "GlobalConstraintRegistrar",
      votingMachineParams: {
        votePerc: 30,
      }
    }
  ]
});
```

!!! tip
    If you want change the default voting machine for all calls to `DAO.new` you can do it using the [ConfigService](api/classes/ConfigService) setting `defaultVotingMachine`. See [Arc.js Configuration Settings](Configuration.md).

!!! note "Important"
    If you want to use [GenesisProtocol](api/classes/GenesisProtocolWrapper) on _any_ scheme, you must also add it as scheme on the DAO itself (see [Creating a new DAO with schemes](#creating-a-new-dao-with-schemes)).

### Creating a new DAO with a non-Universal Controller

There are two types of DAO controller: universal and non-universal.  The default is universal.  You can create a DAO using the DAOstack `Controller` contract by passing `false` for `universalController`:

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  universalController: false
});
```

!!! info
    For more information about choosing between universal and non-universal controllers, see [this article](https://daostack.github.io/arc/contracts/controller/UController/).

### Creating a new DAO using a custom DaoCreator scheme

Arc supplies a contract for creating DAOs called `DaoCreator`.  But you don't have to rely on  `DAOCreator` if you prefer different functionality -- you can supply your own DAO creator scheme by passing its address in `daoCreatorScheme`:

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  daoCreatorScheme: anAddress
});
```

!!! note
    Your DAO creator contract must, at least as a subset of its functionality, implement the same ABI as the Arc `DaoCreator` contract shipped with the running version of Arc.js.

### Get a previously-created DAO

Use [DAO.at](api/classes/DAO#at) to get a previously-created DAO using the avatar address:

```javascript
const dao = await DAO.at(daoAvatarAddress);
```

!!! info
    `DAO.at` will throw an exception if there is any problem loading the DAO.

### Get all the schemes registered to the DAO
<a name="gettingDaoSchemes"></a>

You can obtain the addresses of all of the schemes that are registered with a DAO using [DAO.getSchemes](api/classes/DAO/#getSchemes).  You will also get a contract wrapper if the scheme happens to be the one deployed by the running version of Arc.js:

```javascript
const daoSchemeInfos = await myDao.getSchemes();
for (let schemeInfo of daoSchemeInfos) {
  console.log(`scheme address: ${schemeInfo.address}`);
  if (schemeInfo.wrapper) {
    console.log(`scheme name: ${schemeInfo.wrapper.name}`);
  }
}
```

Or info about a single scheme:

```javascript
const daoSchemeInfos =  = await myDao.getSchemes("UpgradeScheme");
const upgradeSchemeInfo = daoSchemeInfos[0];
console.log(`scheme address: ${upgradeSchemeInfo.address}`);
if (upgradeSchemeInfo.wrapper) {
  console.log(`scheme name: ${upgradeSchemeInfo.wrapper.name}`);
}
```

### Get all the DAOs

You can obtain all of the DAOs that have been created by the DaoCreator that was deployed by the currently-running version of Arc.js:

```javascript
const avatarAddresses = await DAO.getDaos();
```

Or all of the DAOs created by a specific DaoCreator:

```javascript
const avatarAddresses = await DAO.getDaos({"daoCreatorAddress": [anAddress]});
```

You can also get DAOs using the [EventFetcherFactory](api/README/#eventfetcherfactory) mechanism, enabling you to watch as DAOs are created, and get the events with more precision:

```javascript
const daoEventFetcherFactory = await DAO.getDaoCreationEvents();
const watcher = await daoEventFetcherFactory({}, { fromBlock: 0 }).watch(
  async (error, daoAddresses) => {
    if (!error) {
        const addresses = await daoAddresses;
        avatarAddresses.forEach((address) => {
          const dao = await DAO.at(address);
        });
      }
  }
);
```
