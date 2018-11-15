# Arc Contract Wrappers

## Overview

Arc.js wraps several Arc contracts in a "contract wrapper" JavaScript class.  Every wrapper class inherits ultimately from [ContractWrapperBase](/arc.js/api/classes/ContractWrapperBase) providing a common set of functions and properties and specific helper functions for operations specific to the contract it wraps.

Each wrapper contains some basic properties:

- `name` - the name of the wrapped Arc contract
- `friendlyName` - a more friendly name of the Arc contract
- `address` - the address of the wrapped Arc contract
- `contract` - the original "wrapped" [Truffle contract](https://github.com/trufflesuite/truffle-contract) that you can use to access all of the Truffle and Web3 functionality of the specific Arc contract being wrapped.
- `factory` - a static instance of a wrapper factory class based on [ContractWrapperFactory&lt;TWrapper&gt;](/arc.js/api/classes/ContractWrapperFactory) (where `TWrapper` is the type (class) of the wrapper).  Each factory contains static methods:
    - `at(someAddress)`
    - `new()`
    - `deployed()`

    ... that you can use to instantiate the associated wrapper class.

### Events
Each wrapper includes the wrapped contract's events as properties that give you enhanced capabilities over the straight Truffle/Web3 event API.  For more information about wrapped contract events, see [Web3 Events](#web3events).


<a name="contracttypes"></a>
### Types of Wrappers

Arc contracts and associated Arc.js contract wrapper classes are categorized as follows:

**Universal Schemes**

* ContributionReward
* GlobalConstraintRegistrar
* SchemeRegistrar
* UpgradeScheme
* VestingScheme
* VoteInOrganizationScheme

**Voting Machines**

* AbsoluteVote
* GenesisProtocol

**Global Constraints**

* TokenCapGC

**Others**

* DaoCreator
* Redeemer

See more at [Enumerate wrappers by contract type](#wrappersByContractType).

### Obtaining Wrappers

Arc.js provides multiple ways to obtain contract wrappers, each optimal for particular use cases. It all starts with the  [WrapperService](/arc.js/api/classes/WrapperService) which provides means of organizing and obtaining contract wrappers. The `WrapperService` API is primarily in the form of four static properties, each of which are exported for easy import in your code:


Export | WrapperService property | Description
---------|----------|---------
 ContractWrappers | WrapperService.wrappers | Properties are contract names, values are the corresponding contract wrapper
 ContractWrapperFactories | WrapperService.factories | Properties are contract names, values are the corresponding contract wrapper factory
 ContractWrappersByType | WrapperService.wrappersByType | Properties are a contract category name (see [Contract Types](#contracttypes)), values are an array of `IContractWrapper`
 ContractWrappersByAddress | WrapperService.wrappersByAddress | a `Map` where the key is an address and the associated value is a `IContractWrapper` for a contract as deployed by the currently-running version of Arc.js.

The following sections describe how to obtain wrapper classes in several use cases:

- [get a deployed wrapper by the Arc contract name](#get-a-deployed-wrapper-by-name)
- [get a wrapper at a given address](#get-a-wrapper-at-a-given-address)
- [deploy a new contract](#deploy-a-new-contract)
- [enumerate all of the deployed wrappers](#enumerate-all-of-the-deployed-wrappers)
- [enumerate wrappers by contract type](#wrappersByContractType)


!!! note "Keep in mind"
    In Arc.js all token and reputation amounts should always be expressed in Wei, either as a `string` or a `BigNumber`.

<a name="get-a-deployed-wrapper-by-name"></a>
## Get a deployed wrapper by Arc contract name

You can obtain, by its Arc contract name, any wrapper deployed by the running version of Arc.js:

```javascript
import { ContractWrappers } from "@daostack/arc.js";
const upgradeScheme = ContractWrappers.UpgradeScheme;
```

<a name="get-a-wrapper-at-a-given-address"></a>
## Get a wrapper at a given address

You can use a wrapper's factory class to obtain a wrapper for a contract deployed to any given address:

```javascript
import { UpgradeSchemeFactory} from "@daostack/arc.js";
const upgradeScheme = await UpgradeSchemeFactory.at(someAddress);
```

!!! info
    `.at` will return `undefined` if it can't find the contract at the given address.

Another way to get a wrapper at a given address is using [WrapperService.getContractWrapper](/arc.js/api/classes/WrapperService#getContractWrapper).  This is most useful when you have a contract name
and may or may not have an address and wish to most efficiently return the associated wrapper, or undefined when not found:

```javascript
import { WrapperService } from "@daostack/arc.js";
// returns undefined when not found, unlike the factory `.at` which throws an exception 
const upgradeScheme = await WrapperService.getContractWrapper("UpgradeScheme", someAddressThatMayBeUndefined);
}
```

<a name="deploy-a-new-contract"></a>
## Deploy a new contract

You can use a wrapper's factory class to deploy a new instance of a contract and obtain a wrapper for it:

```javascript
import { UpgradeSchemeFactory} from "@daostack/arc.js";
const newUpgradeScheme = await UpgradeSchemeFactory.new();
```

<a name="enumerate-all-of-the-deployed-wrappers"></a>
## Enumerate all of the deployed wrappers

You can enumerate all of the wrappers of contracts deployed by the running version of Arc.js:

```javascript
import { ContractWrappers } from "@daostack/arc.js";
for (var wrapper in ContractWrappers) {
  console.log(`${wrapper.friendlyName} is at ${wrapper.address}`);
}
```

<a name="wrappersByContractType"></a>
## Enumerate wrappers by contract type

You can enumerate the wrappers by contract category, for example, universalSchemes:

```javascript
import { ContractWrappersByType } from "@daostack/arc.js";
for (var schemeWrapper of ContractWrappersByType.universalSchemes) {
  console.log(`${schemeWrapper.friendlyName} is at ${schemeWrapper.address}`);
}
```

The set of contract categories is defined in [ArcWrappersByType](/arc.js/api/interfaces/ArcWrappersByType).

## Can't Find What You Need?

Arc.js doesn't wrap every Arc contact nor give you a helper class for everything, but it does give you some more options described in the following sections.

### Truffle Contracts and Web3

 Under the hood Arc.js uses Truffle contracts and `Web3`. When you find that Arc.js doesn't directly provide you a piece of information or functionality that you need, you might be able to use them to find what you want.  You can obtain `Web3` via [Utils.getWeb3](/arc.js/api/classes/Utils#getWeb3) and the Truffle contract associated with each contract wrapper instance via the `contract` property on each wrapper class.

!!! info "More on `Web3` and Truffle contracts"
    - [Web3](https://github.com/ethereum/wiki/wiki/JavaScript-API)
    - [Truffle contracts](https://github.com/trufflesuite/truffle-contract)

### Undeployed Arc Contracts

Some Arc contracts are wrapped but not deployed by Arc.js, for example `DaoToken` and others.  `ContractWrappers` (`WrapperService.wrappers`) will not contain entries for these wrappers since they are not deployed.  But you will find their factories where you can use `.at`. or `.new`.

### Unwrapped Arc Contracts

Not all Arc contracts have been given wrapper classes, for example, `Avatar`, `UController` and many more.  But using `Utils.requireContract` you can obtain a raw [Truffle contract](https://github.com/trufflesuite/truffle-contract) for any contract, enabling you to work with the contract just by providing the name of the Arc contract:

```javascript
import { Utils } from "@daostack/arc.js";
const avatarTruffleContract = await Utils.requireContract("Avatar");
```

!!! info
    `Utils.requireContract` throws an exception when there is any problem creating the truffle contract object.

