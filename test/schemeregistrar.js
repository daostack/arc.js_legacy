import { SchemeRegistrar } from   '../lib/schemeregistrar.js';
import { NULL_HASH, getValueFromLogs, requireContract } from '../lib/utils';
import { forgeOrganization, contractsForTest } from './helpers';

const DAOToken = requireContract("DAOToken");

describe('SchemeRegistrar', () => {

  it("proposeToAddModifyScheme javascript wrapper should add new scheme", async () => {
    const organization = await forgeOrganization();
    const contracts = await contractsForTest();

    const schemeRegistrar = await organization.scheme('SchemeRegistrar');
    const ContributionReward = await organization.schemes('ContributionReward');
    assert.equal(ContributionReward.length,0, "scheme is already present");

    const ContributionRewardAddress = contracts.allContracts.ContributionReward.address;

    assert.isFalse(await organization.controller.isSchemeRegistered(ContributionRewardAddress), "scheme is registered into the controller");

    const tx = await schemeRegistrar.proposeToAddModifyScheme({
      avatar: organization.avatar.address,
      scheme: ContributionRewardAddress,
      schemeName: "ContributionReward",
      schemeParametersHash: NULL_HASH,
      autoRegister: true
    });


    const proposalId = getValueFromLogs(tx, '_proposalId');

    organization.vote(proposalId, 1, {from: accounts[2]});

    assert.isTrue(await organization.controller.isSchemeRegistered(ContributionRewardAddress), "scheme is not registered into the controller");
  });

  it("proposeToAddModifyScheme javascript wrapper should modify existing scheme", async () => {
    const organization = await forgeOrganization();

    const schemeRegistrar = await organization.scheme('SchemeRegistrar');
    const upgradeScheme = await organization.schemes('SchemeRegistrar');
    assert.equal(upgradeScheme.length, 1, "scheme is not present");

    const modifiedSchemeAddress = upgradeScheme[0].address;

    const tx = await schemeRegistrar.proposeToAddModifyScheme({
      avatar: organization.avatar.address,
      scheme: modifiedSchemeAddress,
      schemeName: "SchemeRegistrar",
      schemeParametersHash: NULL_HASH,
      autoRegister: true
    });


    const proposalId = getValueFromLogs(tx, '_proposalId');

    organization.vote(proposalId, 1, {from: accounts[2]});

    assert.isTrue(await organization.controller.isSchemeRegistered(modifiedSchemeAddress), "scheme is not registered into the controller");

    const paramsHash = await organization.controller.getSchemeParameters(modifiedSchemeAddress);

    assert.equal(paramsHash, NULL_HASH, "parameters hash is not correct");
  });

  it("proposeToRemoveScheme javascript wrapper should remove scheme", async () => {
    const organization = await forgeOrganization();

    const schemeRegistrar = await organization.scheme('SchemeRegistrar');
    const removedScheme = schemeRegistrar;

    const tx = await schemeRegistrar.proposeToRemoveScheme({
      avatar: organization.avatar.address,
      scheme: removedScheme.address
    });

    const proposalId = getValueFromLogs(tx, '_proposalId');

    organization.vote(proposalId, 1, {from: accounts[2]});

    assert.isFalse(await organization.controller.isSchemeRegistered(removedScheme.address), "scheme is still registered into the controller");
  });

  it("schemeRegistrar.new should work as expected with default values", async () => {
    // create a schemeRegistrar
    const registrar = await SchemeRegistrar.new({
      fee: undefined,
      beneficiary: undefined,
      tokenAddress: undefined
    });

    // because the registrar is constructed without a token address, it should have
    // created a new DAOToken - we check if it works as expected
    const tokenAddress = await registrar.nativeToken();
    const token = await DAOToken.at(tokenAddress);
    const accounts = web3.eth.accounts;
    let balance;
    balance = await token.balanceOf(accounts[0]);
    assert.equal(balance.valueOf(), 0);
    await token.mint(web3.eth.accounts[0], 1000 * Math.pow(10, 18));
    balance = await token.balanceOf(accounts[0]);
    assert.equal(balance.valueOf(), 1000 * Math.pow(10, 18));
  });

  it("schemeRegistrar.new should work as expected with non-default values", async () => {
    // create a schemeRegistrar, passing some options
    const token = await DAOToken.new();

    const registrar = await  SchemeRegistrar.new({
      tokenAddress:token.address,
      fee: 3e18,
      beneficiary: accounts[1]
    });

    // check if registrar indeed uses the specified token
    const tokenAddress = await registrar.nativeToken();
    assert.equal(tokenAddress, token.address);
    // check if the fee is as specified
    const fee = await registrar.fee();
    assert.equal(fee, 3e18);
    // check if the beneficiary is as specified
    const beneficiary = await registrar.beneficiary();
    assert.equal(beneficiary, accounts[1]);
  });
});
