[API Reference](../README.md) > [ProposeToAddModifySchemeParams](../interfaces/ProposeToAddModifySchemeParams.md)



# Interface: ProposeToAddModifySchemeParams


## Properties
<a id="avatar"></a>

###  avatar

**●  avatar**:  *[Address](../#Address)* 

*Defined in [contracts/schemeregistrar.ts:203](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/schemeregistrar.ts#L203)*



avatar address




___

<a id="permissions"></a>

### «Optional» permissions

**●  permissions**:  *[SchemePermissions](../enums/SchemePermissions.md)⎮[DefaultSchemePermissions](../enums/DefaultSchemePermissions.md)⎮`null`* 

*Defined in [contracts/schemeregistrar.ts:227](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/schemeregistrar.ts#L227)*



Optionally supply values from SchemePermissions or DefaultSchemePermissions.

This value is manditory for non-Arc schemes.

For Arc schemes the default is taken from DefaultSchemePermissions for the scheme given by schemeName.




___

<a id="schemeAddress"></a>

### «Optional» schemeAddress

**●  schemeAddress**:  *[Address](../#Address)* 

*Defined in [contracts/schemeregistrar.ts:209](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/schemeregistrar.ts#L209)*



Optional scheme address. Supply this if you are submitting a non-Arc scheme or wish to use a different Arc scheme than the default. In the latter case, you must also supply the schemeName.




___

<a id="schemeName"></a>

### «Optional» schemeName

**●  schemeName**:  *`string`⎮`null`* 

*Defined in [contracts/schemeregistrar.ts:214](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/schemeregistrar.ts#L214)*



Scheme name, like "SchemeRegistrar" or "ContributionReward". Not required if you are registering a non-arc scheme.




___

<a id="schemeParametersHash"></a>

###  schemeParametersHash

**●  schemeParametersHash**:  *`string`* 

*Defined in [contracts/schemeregistrar.ts:218](https://github.com/daostack/arc.js/blob/616f6e7/lib/contracts/schemeregistrar.ts#L218)*



Fash of scheme parameters. These must be already registered with the new scheme.




___


