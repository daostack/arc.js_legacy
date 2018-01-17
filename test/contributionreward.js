import { forgeOrganization, SOME_HASH, SOME_ADDRESS } from "./helpers";
import { SHA3, getValueFromLogs, requireContract } from "../lib/utils.js";

const ContributionReward = requireContract("ContributionReward");

export async function proposeContributionReward(org) {
  const schemeRegistrar = await org.scheme("SchemeRegistrar");
  const contributionReward = await org.scheme("ContributionReward");

  const votingMachineHash = await org.votingMachine.configHash__;
  const votingMachineAddress = org.votingMachine.address;

  const schemeParametersHash = await contributionReward.setParams({
    orgNativeTokenFee: 0,
    voteParametersHash: votingMachineHash,
    votingMachine: votingMachineAddress
  });

  const tx = await schemeRegistrar.proposeToAddModifyScheme({
    avatar: org.avatar.address,
    scheme: contributionReward.address,
    schemeName: "ContributionReward",
    schemeParametersHash: schemeParametersHash
  });

  const proposalId = getValueFromLogs(tx, "_proposalId");

  org.vote(proposalId, 1, { from: accounts[2] });

  return contributionReward;
}

describe("ContributionReward scheme", () => {
  let params, paramsHash, tx, proposal;

  it("submit and accept a contribution - complete workflow", async () => {

    /* note this will give accounts[0,1,2] enough tokens to register some schemes */
    const org = await forgeOrganization();

    const scheme = await proposeContributionReward(org);

    tx = await scheme.proposeContributionReward({
      avatar: org.avatar.address, // Avatar _avatar,
      description: "A new contribution", // string _contributionDesciption,
      beneficiary: accounts[1], // address _beneficiary
      nativeTokenReward: 1
    });

    const proposalId = getValueFromLogs(tx, "_proposalId");

    // now vote with a majority account and accept this contribution
    org.vote(proposalId, 1, { from: accounts[2] });

    // TODO: check that the proposal is indeed accepted
  });

  it("submit and accept a contribution - complete workflow with payments [TODO]", async () => {
    // TODO: write a similar test as the previous one, but with all different forms of payment
  });

  it("submit and accept a contribution - using the ABI Contract", async () => {
    const founders = [
      {
        address: accounts[0],
        tokens: 30,
        reputation: 30
      },
      {
        address: accounts[1],
        tokens: 70,
        reputation: 70
      }
    ];

    const org = await forgeOrganization({ founders });

    const avatar = org.avatar;
    const controller = org.controller;

    const votingMachine = org.votingMachine;    // create a contribution Scheme
    const contributionReward = await ContributionReward.new();

    const votingMachineHash = await votingMachine.getParametersHash(
      org.reputation.address,
      50,
      true
    );
    await votingMachine.setParameters(org.reputation.address, 50, true);
    const votingMachineAddress = votingMachine.address;

    const schemeParametersHash = await contributionReward.getParametersHash(
      0,
      votingMachineHash,
      votingMachineAddress
    );

    await contributionReward.setParameters(
      0,
      votingMachineHash,
      votingMachineAddress
    );

    const schemeRegistrar = await org.scheme("SchemeRegistrar");

    tx = await schemeRegistrar.proposeToAddModifyScheme({
      avatar: avatar.address,
      scheme: contributionReward.address,
      schemeName: "ContributionReward",
      schemeParametersHash: schemeParametersHash
    });

    const proposalId = getValueFromLogs(tx, "_proposalId");

    // this will vote-and-execute
    tx = await votingMachine.vote(proposalId, 1, { from: accounts[1] });

    // now our scheme should be registered on the controller
    const schemeFromController = await controller.schemes(
      contributionReward.address
    );
    // we expect to have only the first bit set (it is a registered scheme without nay particular permissions)
    assert.equal(schemeFromController[1], "0x00000001");

    // is the organization registered?
    const orgFromContributionScheme = await org.controller.isSchemeRegistered(contributionReward.address, org.avatar.address);

    assert.equal(orgFromContributionScheme, true);
    // check the configuration for proposing new contributions

    paramsHash = await controller.getSchemeParameters(contributionReward.address, org.avatar.address);

    // params are: uint orgNativeTokenFee; bytes32 voteApproveParams; uint schemeNativeTokenFee;         BoolVoteInterface boolVote;
    params = await contributionReward.parameters(paramsHash);
    // check if they are not trivial - the 4th item should be a valid boolVote address
    assert.notEqual(params[2], "0x0000000000000000000000000000000000000000");
    assert.equal(params[2], votingMachine.address);
    // now we can propose a contribution
    tx = await contributionReward.proposeContributionReward(
      avatar.address, // Avatar _avatar,
      // web3.utils.soliditySha3('a fair play'), this is available in web3 1.0
      SHA3("a fair play"),
      [
        0, // uint _nativeTokenReward,
        0, // uint _reputationReward,
        0, // uint _ethReward,
        0
      ], // uint _externalTokenReward,
      "0x0008e8314d3f08fd072e06b6253d62ed526038a0", // StandardToken _externalToken, we provide some arbitrary address
      accounts[2] // address _beneficiary
    );

    const contributionId = tx.logs[0].args._proposalId;
    // let us vote for it (is there a way to get the votingmachine from the contributionReward?)
    // this is a minority vote for 'yes'
    // check preconditions for the vote
    proposal = await votingMachine.proposals(contributionId);
    // a propsoal has the following structure
    // 0. address owner;
    // 1. address avatar;
    // 2. Number Of Choices
    // 3. ExecutableInterface executable;
    // 4. bytes32 paramsHash;
    // 5. uint yes; // total 'yes' votes
    // 6. uint no; // total 'no' votes
    // MAPPING is skipped in the reutnr value...
    // X.mapping(address=>int) voted; // save the amount of reputation voted by an agent (positive sign is yes, negatice is no)
    // 7. bool opened; // voting opened flag
    assert.isOk(proposal[6]); // proposal.opened is true
    // first we check if our executable (proposal[3]) is indeed the contributionReward
    assert.equal(proposal[3], contributionReward.address);

    tx = await votingMachine.vote(contributionId, 1, { from: accounts[0] });
    // and this is the majority vote (which will also call execute on the executable
    tx = await votingMachine.vote(contributionId, 1, { from: accounts[1] });

    // TODO: check if proposal was deleted from contribution Scheme
    // proposal = await contributionReward.proposals(contributionId);
    // assert.equal(proposal[0], NULL_HASH);

    // check if proposal was deleted from voting machine
    proposal = await votingMachine.proposals(contributionId);
    // TODO: proposal is not deleted from voting machine: is that feature or bug?
    // assert.notOk(proposal[6]); // proposal.opened is false

    // TODO: no payments have been made. Write another test for that.
  });

  it("Can set and get parameters", async () => {
    let params;

    // create a contribution Scheme
    const contributionReward = await ContributionReward.new();

    const contributionRewardParamsHash = await contributionReward.getParametersHash(
      0,
      SOME_HASH,
      SOME_ADDRESS
    );

    // these parameters are not registered yet at this point
    params = await contributionReward.parameters(contributionRewardParamsHash);
    assert.equal(params[2], "0x0000000000000000000000000000000000000000");

    // register the parameters are registers in the contribution scheme
    await contributionReward.setParameters(0, SOME_HASH, SOME_ADDRESS);

    params = await contributionReward.parameters(contributionRewardParamsHash);
    assert.notEqual(params[2], "0x0000000000000000000000000000000000000000");
  });
});
