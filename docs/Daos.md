# Working with DAOs

Arc.js provides a class called [DAO](api/classes/DAO) that facilitates creating and working with DAOs.  Read on for more information about DAOs in DAOstack and the [DAO](api/classes/DAO) class.

## About DAOs

Every DAO in DAOstack includes an avatar, a controller, a token, a reputation system, and zero or more schemes and global constraints.

**The avatar** is a public-facing part of the DAO that handles the interaction of the DAO with the rest of the world, for example interacting with other DAOs or paying third party agents.  A DAO is always referenced by the address of its avatar.

**The controller** is a central internal hub for all of the components of the DAO.  DAOstack documentation often refers to the various DAO components as "organs".  A controller can be "universal" or not.  If universal then a single instance can be used by multiple DAOs.  If not universal, then each DAO gets its own instance.  The API is the same for both types of controllers.

!!! note
    Any contract or agent's address can be registered like a scheme with the controller and thus work directly with the controller.

**The token** is used as currency in operations like staking in `GenesisProtocol`, vesting agreements in `VestingScheme` and rewards in `ContributionReward`.  Typically two tokens are most in play:  The global GEN token created by DAOstack, and a "native" token that is specific to every DAO.  The GEN token is used by the default GenesisProtocol voting machine for staking.

**The reputation system** provides a kind of currency of influence. Reputation conveys influence in the DAO commenserate with the rules of the DAO, such as when proposing, voting or staking, and via proposals approved to grant or remove an agent's reputation.  Reputation can be minted and burned, but it cannot be transferred between agents.  Every DAO gets its own instance of an Arc `Reputation` contract.

**Schemes** are public-facing contracts that any agent may use when they want perform primary functions relating to a particular DAO.  Some schemes are "universal" in the sense that a single instance can be reused by multiple DAOs. Some schemes have the ability to create proposals and thus require that a configured voting machine be specified in the scheme's parameters.

**Global constraints** use parameterized constraint criteria to block actions attempted by a DAO's controller that would violate a given constraint.  An example is [TokenCapGC](/api/classes/TokenCapGCWrapper) that limits the total supply of a given token to a certain maximum number.

DAOs are extensible beyond the reusability of Arc contracts: You can provide your own implementation of the controller, token, and any global constraints, voting machines and schemes you want.

!!! info "More About DAOs"
    For more information about DAOs, refer to [Structure of a DAO](https://daostack.github.io/arc/README/#the-structure-of-a-dao).
!!! info "More About Schemes"
    For more information about schemes, refer to [Schemes](Proposals#schemes).
!!! info "More About Proposals"
    For more information about proposals, refer to [Proposals](Proposals#proposals).
    
## Creating a new DAO
<a name="creatingDAOs"></a>

When creating a DAO you can configure its name, token, founders and schemes.  For schemes you configure their parameters and controller permissions.

You can call [DAO.new](api/classes/DAO#new) to create a new DAO, passing it a [configuration object](api/interfaces/NewDaoConfig).

Almost everything in the configuration has a default.  The following sections describe how to supply custom configurations.

!!! info
    Under the hood, `Dao.new` uses the [DaoCreatorWrapper](api/classes/DaoCreatorWrapper) class.

### Creating a new DAO with founders

The simplest example of how to create a new DAO adds one or more founders and no schemes. You add the founders by including a "founders" array.  This will automatically mint tokens and reputation to each founder:

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  founders: [
    {
      // the current user account
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

And voilà, you have created a new DAO with three founders in the DAO stack on Ethereum.  The returned object `newDao` is an instance of [DAO](api/classes/DAO).

But though this DAO has founders with tokens and reputation who can thus make proposals and vote on them, there is still no way to _create_ proposals and thus nothing on which to vote.

!!! note "On Founders"
    It is not possible to add or remove founders.  In fact, there is no retained sense of who they even were
    other than events that record their interactions with the DAO.  They are simply addresses you supply when you create a DAO and to whom will immediately and optionally be minted tokens and reputation.  By virtue of their reputation with the DAO, founders are the first "participants" in a DAO (also sometimes referred-to as "members" of a DAO).  The set of participants in a DAO will change as agents gain and lose reputation with the DAO.

### Creating a new DAO with schemes

You can create a new DAO with schemes that enable DAO participants to create proposals and vote by including a "schemes" array in the `DAO.new` JSON.  The following example registers three schemes with all default parameters, permissions and voting machines.

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

Put the last two examples together and you have a DAO with founders and schemes and can start to realize the potential of a DAO in the DAOstack ecosystem.

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
    If you want change the default voting machine for all calls to `DAO.new` you can do it using the [ConfigService](/api/classes/ConfigService) setting `defaultVotingMachine`. See [Arc.js Configuration Settings](Configuration.md).

<a name="gpExplanation"></a>
!!! note "Important"
    If you want to use [GenesisProtocol](api/classes/GenesisProtocolWrapper) on _any_ scheme, you must also add it as a scheme in its own right on the DAO itself.  When you supply the GenesisProtocol parameters, you must do so on the GenesisProtocol scheme itself -- unlike with AbsoluteVote and QuorumVote, any GenesisProtocol params sent directly to the scheme that uses it are ignored.

### Creating a new DAO with a non-Universal Controller

As mentioned above, there are two types of DAO controller: universal and non-universal.  The default is universal.  You can create a DAO using the DAOstack `Controller` contract by passing `false` for `universalController`:

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

See [Get information about a DAO](#daoinformation)

### Get all the DAOs

You can obtain all of the DAOs that have been created by the DaoCreator that was deployed by the currently-running version of Arc.js:

```javascript
const avatarAddresses = await DAO.getDaos();
```

Or all of the DAOs created by a specific DaoCreator:

```javascript
const avatarAddresses = await DAO.getDaos({"daoCreatorAddress": anAddress});
```

You can also watch as DAOs are, or have been, created using the [EventFetcherFactory](Events) mechanism:

```typescript
const daoEventFetcherFactory = await DAO.getDaoCreationEvents();
const watcher = await daoEventFetcherFactory({}, { fromBlock: 0 }).watch(
  async (error: Error, addressPromise: Promise<Address>): void => {
    if (!error) {
        const address = await addressPromise;
        const dao = await DAO.at(address);
      }
  }
);
```

!!! note
    Like with `DAO.getDaos` you can supply a `daoCreatorAddress` in the options of `getDaoCreationEvents`.

<a name="daoinformation"></a>
### Get information about a DAO

Once you have an instance of DAO you can obtain lots of information about it.  First, you will find it has several helpful member variables:

Name | Description
---------|----------
 name | string name of the DAO
 avatar | Truffle contract of the DAO's avatar
 controller | Truffle contract of the DAO's controller
 hasUController | boolean true if the DAO's controller is universal
 token | `DaoTokenWrapper` of the DAO's native token 
 reputation | `ReputationWrapper` of the DAO's reputation contract

Further, there are a number of other informational methods, all described in the following sections.


<a name="gettingDaoSchemes"></a>
### Get all the schemes registered to the DAO

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

### Check whether a given scheme is registered to the DAO

You can check whether a given scheme is registered to the DAO:

```javascript
const isRegistered = await myDao.isSchemeRegistered(schemeAddress);
```

### Get all the participants in a DAO

A DAO participant (often also referred-to as a "member") is any agent with reputation with the DAO.

You can obtain the address and reputation of all of the participants in a DAO using [DAO.getParticipants](/api/classes/DAO/#getParticipants) like this:

```javascript
const daoParticipants = await myDao.getParticipants({
  returnReputations: true
});

for (let participant of daoParticipants) {
  console.log(`address: ${participant.address}`);
  console.log(`  reputation: ${web3.fromWei(participant.reputation)}`);
}
```

Or for a single participant:

```javascript
const daoParticipants = await myDao.getParticipants({
  returnReputations: true,
  participantAddress: anAddress
});

const participant = daoParticipants[0];
console.log(`address: ${participant.address}`);
console.log(`  reputation: ${web3.fromWei(participant.reputation)}`);
```

### Get all the globalConstraints in a DAO

You can obtain information about all of the global constraints registered with a DAO, using [DAO.getGlobalConstraints](/api/classes/DAO/#getGlobalConstraints) like this:

```javascript
const constraints = await myDao.getGlobalConstraints();

for (let constraint of constraints) {
  console.log(`address: ${constraint.address}`);
  console.log(`  paramsHash: ${constraint.paramsHash}`);
  console.log(`  wrapper: ${constraint.wrapper}`);
}
```

Or for a single constraint that is wrapped by the running version of Arc.js, by passing the contract name of the constraint:

```javascript
const constraints = await myDao.getGlobalConstraints(contractName);

const constraint = constraints[0];
console.log(`address: ${constraint.address}`);
console.log(`  paramsHash: ${constraint.paramsHash}`);
console.log(`  wrapper: ${constraint.wrapper}`);
```

### Check whether a given global constraint is registered to the DAO

You can check whether a given global constraint, given by its address, is registered to the DAO:

```javascript
const isRegistered = await myDao.isGlobalConstraintRegistered(gcAddress);
```

### Get the native token balance of an account

You can get the native token balance of an account:

```javascript
const balance = web3.fromWei((await myDao.getTokenBalance(agentAddress)));
```

### Get the name of the DAO's native token

A shortcut to `myDao.token.getTokenName()`, you can get the name of the DAO's native token:

```javascript
const tokenName = await myDao.getTokenName();
```

### Get the DAO's native token symbol

A shortcut to `myDao.token.getTokenSymbol()`, you can get the symbol of the DAO's native token:

```javascript
const tokenSymbol = await myDao.getTokenSymbol();
```

