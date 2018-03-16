[API Reference](../README.md) > [DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)



# Enumeration: DefaultSchemePermissions


These are the permissions that are the minimum that each scheme must have to be able to perform its full range of functionality.

Note that '1' is always assigned to a scheme by the Controller when the scheme is registered with the controller.

## Index

### Enumeration members

* [AllPermissions](DefaultSchemePermissions.md#AllPermissions)
* [ContributionReward](DefaultSchemePermissions.md#ContributionReward)
* [GenesisProtocol](DefaultSchemePermissions.md#GenesisProtocol)
* [GlobalConstraintRegistrar](DefaultSchemePermissions.md#GlobalConstraintRegistrar)
* [MinimumPermissions](DefaultSchemePermissions.md#MinimumPermissions)
* [NoPermissions](DefaultSchemePermissions.md#NoPermissions)
* [SchemeRegistrar](DefaultSchemePermissions.md#SchemeRegistrar)
* [UpgradeScheme](DefaultSchemePermissions.md#UpgradeScheme)
* [VestingScheme](DefaultSchemePermissions.md#VestingScheme)
* [VoteInOrganizationScheme](DefaultSchemePermissions.md#VoteInOrganizationScheme)



---
## Enumeration members
<a id="AllPermissions"></a>

###  AllPermissions

** AllPermissions**:    =  SchemePermissions.All

*Defined in [commonTypes.ts:63](https://github.com/daostack/arc.js/blob/caacbb2/lib/commonTypes.ts#L63)*





___

<a id="ContributionReward"></a>

###  ContributionReward

** ContributionReward**:    =  SchemePermissions.IsRegistered

*Defined in [commonTypes.ts:64](https://github.com/daostack/arc.js/blob/caacbb2/lib/commonTypes.ts#L64)*





___

<a id="GenesisProtocol"></a>

###  GenesisProtocol

** GenesisProtocol**:    =  SchemePermissions.IsRegistered

*Defined in [commonTypes.ts:65](https://github.com/daostack/arc.js/blob/caacbb2/lib/commonTypes.ts#L65)*





___

<a id="GlobalConstraintRegistrar"></a>

###  GlobalConstraintRegistrar

** GlobalConstraintRegistrar**:    =  SchemePermissions.IsRegistered | SchemePermissions.CanAddRemoveGlobalConstraints

*Defined in [commonTypes.ts:66](https://github.com/daostack/arc.js/blob/caacbb2/lib/commonTypes.ts#L66)*





___

<a id="MinimumPermissions"></a>

###  MinimumPermissions

** MinimumPermissions**:    =  SchemePermissions.IsRegistered

*Defined in [commonTypes.ts:62](https://github.com/daostack/arc.js/blob/caacbb2/lib/commonTypes.ts#L62)*





___

<a id="NoPermissions"></a>

###  NoPermissions

** NoPermissions**:    =  SchemePermissions.None

*Defined in [commonTypes.ts:61](https://github.com/daostack/arc.js/blob/caacbb2/lib/commonTypes.ts#L61)*





___

<a id="SchemeRegistrar"></a>

###  SchemeRegistrar

** SchemeRegistrar**:    =  SchemePermissions.All

*Defined in [commonTypes.ts:70](https://github.com/daostack/arc.js/blob/caacbb2/lib/commonTypes.ts#L70)*



Has all permissions so that it can register/unregister all schemes




___

<a id="UpgradeScheme"></a>

###  UpgradeScheme

** UpgradeScheme**:    =  SchemePermissions.IsRegistered | SchemePermissions.CanRegisterSchemes | SchemePermissions.CanUpgradeController

*Defined in [commonTypes.ts:71](https://github.com/daostack/arc.js/blob/caacbb2/lib/commonTypes.ts#L71)*





___

<a id="VestingScheme"></a>

###  VestingScheme

** VestingScheme**:    =  SchemePermissions.IsRegistered

*Defined in [commonTypes.ts:72](https://github.com/daostack/arc.js/blob/caacbb2/lib/commonTypes.ts#L72)*





___

<a id="VoteInOrganizationScheme"></a>

###  VoteInOrganizationScheme

** VoteInOrganizationScheme**:    =  SchemePermissions.IsRegistered | SchemePermissions.CanCallDelegateCall

*Defined in [commonTypes.ts:73](https://github.com/daostack/arc.js/blob/caacbb2/lib/commonTypes.ts#L73)*





___


