# Using Arc Contract Wrappers

## Overview

Arc.js wraps several Arc contracts in a "contract wrapper" JavaScript class.  Every wrapper class inherits from [ContractWrapperBase](api/classes/ContractWrapperBase) providing a common set of functions and properties and specific helper functions for operations specific to the contract it wraps.

Each wrapper contains a `contract` property which is the original "wrapped" [Truffle contract](https://github.com/trufflesuite/truffle-contract) that you can use to access all of the Truffle functionality of the specific Arc contract being wrapped.

Each wrapper also contains a `factory` property.  This is the static instance of the wrapper factory class which is based on [ContractWrapperFactory<TWrapper>](api/classes/ContractWrapperFactory) (where `TWrapper` is the type (class) of the wrapper).  Each factory contains the static methods `at(someAddress)`, `new()` and `deployed()` that you can use to instantiate the associated wrapper class.

Each wrapper includes the contract's events.  Refer here for more information about [how Arc.js wraps contract events](Events).

Arc.js provides multiple ways to obtain contract wrappers, each optimal in particular use cases:

* [get a deployed wrapper by the Arc contract name](Home/#get-a-deployed-wrapper-by-name)
* [enumerate all of the deployed wrappers](Home/#enumerate-all-of-the-deployed-wrappers)
* [enumerate wrappers by contract type](Home/#enumerate-wrappers-by-contract-type)
* [get a wrapper at a given address](Home/#get-a-wrapper-at-a-given-address)
* [deploy a new contract](Home/#deploy-a-new-contract)

The following sections describe what to do in each of the above use cases.

!!! note "Keep in mind"
    In Arc.js all token and reputation amounts should be expressed in Wei.

## Get a deployed wrapper by name

You can obtain, by its Arc contract name, any wrapper deployed by the running version of Arc.js:

```javascript
import { ContractWrappers } from "@daostack/arc.js";
const upgradeScheme = ContractWrappers.UpgradeScheme;
```

!!! tip
    `ContractWrappers` is an alias for [WrapperService.wrappers](api/classes/WrapperService/#wrappers)
    ```javascript
    import { WrapperService } from "@daostack/arc.js";
    const upgradeScheme = WrapperService.wrappers.UpgradeScheme;
    ```

## Enumerate all of the deployed wrappers

You can enumerate all of the wrappers of contracts deployed by the running version of Arc.js:

```javascript
import { ContractWrappers } from "@daostack/arc.js";
for (var wrapper in ContractWrappers) {
  console.log(`${wrapper.friendlyName} is at ${wrapper.address}`);
}
```

!!! tip
    `ContractWrappers` is an alias for [WrapperService.wrappers](api/classes/WrapperService/#wrappers)
    ```javascript
    import { WrapperService } from "@daostack/arc.js";
    for (var wrapperName in WrapperService.wrappers) {
      const wrapper = WrapperService.wrappers[wrapperName];
      console.log(`${wrapper.friendlyName} is at ${wrapper.address}`);
    }
    ```

<a name="wrappersByContractType"></a>
## Enumerate wrappers by contract type

Arc contracts and associated Arc.js contract wrapper classes can be categorized as follows:

**Schemes**

* ContributionReward
* GenesisProtocol
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

You can enumerate the wrappers in each category, for example, schemes:

```javascript
import { ContractWrappersByType } from "@daostack/arc.js";
for (var schemeWrapper of ContractWrappersByType.schemes) {
  console.log(`${schemeWrapper.friendlyName} is at ${schemeWrapper.address}`);
}
```

!!! tip
    `ContractWrappersByType` is an alias for [WrapperService.wrappersByType](api/classes/WrapperService/#wrappersByType)
    ```javascript
    import { WrapperService} from '@daostack/arc.js';
    const wrapperTypes = WrapperService.wrappersByType;

    for (var schemeWrapper of wrapperTypes.schemes) {
      console.log(`${schemeWrapper.friendlyName} is at ${schemeWrapper.address}`);
    }
    ```

!!! tip
    `ContractWrappersByType.allWrappers` is an array of all of wrappers.

## Get a wrapper at a given address

You can use a wrapper's factory class to obtain a wrapper for a contract deployed to any given address:

```javascript
import { UpgradeSchemeFactory} from "@daostack/arc.js";
const upgradeScheme = await UpgradeSchemeFactory.at(someAddress);
```

!!! info
    `.at` will throw an exception if it can't find the contract at the given address.

!!! tip
    `ContractWrapperFactories` is an alias for [WrapperService.factories](api/classes/WrapperService/#factories)
    ```javascript
    import { ContractWrapperFactories } from "@daostack/arc.js";
    const upgradeScheme = await ContractWrapperFactories.UpgradeScheme.at(someAddress);
    }
    ```

Another way to get a wrapper at a given address is using [WrapperService.getContractWrapper](api/classes/WrapperService/#getContractWrapper).  This is most useful when you have both contract name
and address and wish to most efficiently return the associated wrapper, or undefined when not found:

```javascript
import { WrapperService } from "@daostack/arc.js";
// returns undefined when not found, unlike the factory `.at` which throws an exception 
const upgradeScheme = await WrapperService.getContractWrapper("UpgradeScheme", someAddress);
}
```

## Deploy a new contract

You can use a wrapper's factory class to deploy a new instance of a contract and obtain a wrapper for it:

```javascript
import { UpgradeSchemeFactory} from "@daostack/arc.js";
const newUpgradeScheme = await UpgradeSchemeFactory.new();
```

!!! tip
    `ContractWrapperFactories` is an alias for [WrapperService.factories](api/classes/WrapperService/#factories)
    ```javascript
    import { ContractWrapperFactories } from "@daostack/arc.js";
    const newUpgradeScheme = await ContractWrapperFactories.UpgradeScheme.new();
    }
    ```

## Obtain a DAO scheme's parameters

Although you can always register your own schemes with a DAO, whether they be totally custom non-Arc schemes, or redeployed Arc schemes, by default a DAO is created with Arc schemes that are universal in the sense that the scheme's code is usable by any DAO with which the scheme can be registered.  But every scheme registered with a DAO is configured with a particular set of parameter values, and references such as proposals. All of these are stored in the DAO's own controller where each universal scheme is able to find them.  (If the controller is the Universal Controller then the parameters and data are keyed by the DAO's avatar address.)

If you want to obtain a DAO scheme's parameters, you can do it like this:

```javascript
const schemeParameters = schemeWrapper.getSchemeParameters(avatarAddress);
```

This will return an object containing the scheme's parameter values.  The object will be the same as that which one passes to `schemeWrapper.setParameters` when setting parameters on any contract.

For example, to obtain the voting machine address for a scheme that has one as a parameter:

```javascript
const schemeParameters = schemeWrapper.getSchemeParameters(avatarAddress);
const votingMachineAddress = schemeParameters.votingMachineAddress;
```

## Working with Unwrapped Arc Contracts

Not all Arc contracts have been given wrapper classes, for example, `Avatar`, `UController` and many more.  But using `Utils.requireContract` you can obtain a raw [Truffle contract](https://github.com/trufflesuite/truffle-contract) for any contract, enabling you to work with the contract just by providing the name of the Arc contract:

```javascript
import { Utils } from "@daostack/arc.js";
const avatarTruffleContract = await Utils.requireContract("Avatar");
```

!!! info
    `Utils.requireContract` throws an exception when there is any problem creating the truffle contract object.

## Working with Events
All Arc.js wrappers publish events of various types that you can handle, including events from Arc contracts and events that enable you to track transaction as they occur.  Refer here for [all about events in Arc.js](Events).
