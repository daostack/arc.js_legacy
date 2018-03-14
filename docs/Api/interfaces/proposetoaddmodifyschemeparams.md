[@DAOstack/Arc.js API Reference](../README.md) > [ProposeToAddModifySchemeParams](../interfaces/proposetoaddmodifyschemeparams.md)



# Interface: ProposeToAddModifySchemeParams


## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *`string`* 

*Defined in [contracts/schemeregistrar.ts:238](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/schemeregistrar.ts#L238)*



avatar address




___

<a id="isregistering"></a>

### «Optional» isRegistering

**●  isRegistering**:  *`boolean`⎮`null`* 

*Defined in [contracts/schemeregistrar.ts:258](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/schemeregistrar.ts#L258)*



true if the given scheme is able to register/unregister/modify schemes.

isRegistering should only be supplied when schemeName is not given (and thus the scheme is non-Arc). Otherwise we determine its value based on scheme and schemeName.




___

<a id="scheme"></a>

###  scheme

**●  scheme**:  *`string`* 

*Defined in [contracts/schemeregistrar.ts:242](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/schemeregistrar.ts#L242)*



scheme address




___

<a id="schemename"></a>

### «Optional» schemeName

**●  schemeName**:  *`string`⎮`null`* 

*Defined in [contracts/schemeregistrar.ts:247](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/schemeregistrar.ts#L247)*



scheme identifier, like "SchemeRegistrar" or "ContributionReward". pass null if registering a non-arc scheme




___

<a id="schemeparametershash"></a>

###  schemeParametersHash

**●  schemeParametersHash**:  *`string`* 

*Defined in [contracts/schemeregistrar.ts:251](https://github.com/daostack/arc.js/blob/0fff6d4/lib/contracts/schemeregistrar.ts#L251)*



hash of scheme parameters. These must be already registered with the new scheme.




___


