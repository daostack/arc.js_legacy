import { proposeContributionReward, vote, forgeDao, SOME_HASH, SOME_ADDRESS } from "./helpers";

import { ContributionReward } from "../lib/contracts/contributionreward";

describe("ContributionReward scheme", () => {
  let params, paramsHash, proposal;

  it("submit and accept a contribution - complete workflow", async () => {

    /* note this will give accounts[0,1,2] enough tokens to register some schemes */
    const dao = await forgeDao();

    const scheme = await proposeContributionReward(dao);

    const result = await scheme.proposeContributionReward({
      avatar: dao.avatar.address, // Avatar _avatar,
      description: "A new contribution", // string _contributionDesciption,
      beneficiary: accounts[1], // address _beneficiary
      nativeTokenReward: 1
    });

    const proposalId = result.proposalId;

    // now vote with a majority account and accept this contribution
    vote(dao, proposalId, 1, { from: accounts[2] });

    // TODO: check that the proposal is indeed accepted
  });

  it("submit and accept a contribution - complete workflow with payments [TODO]", async () => {
    // TODO: write a similar test as the previous one, but with all different forms of payment
  });

  it("submit and accept a contribution - using the ABI Contract", async () => {
    const founders = [
      {
        address: accounts[0],
        tokens: web3.toWei(30),
        reputation: web3.toWei(30)
      },
      {
        address: accounts[1],
        tokens: web3.toWei(70),
        reputation: web3.toWei(70)
      }
    ];

    const dao = await forgeDao({ founders });

    const avatar = dao.avatar;
    const controller = dao.controller;

    const votingMachine = dao.votingMachine;    // create a contribution Scheme
    const contributionReward = await ContributionReward.new();

    const votingMachineHash = (await votingMachine.setParams({
      reputation: dao.reputation.address,
      votePerc: 50,
      ownerVote: true
    })).result;

    const votingMachineAddress = votingMachine.address;

    const schemeParametersHash = (await contributionReward.setParams({
      orgNativeTokenFee: 0,
      voteParametersHash: votingMachineHash,
      votingMachine: votingMachineAddress
    })).result;

    const schemeRegistrar = await dao.getScheme("SchemeRegistrar");

    let result = await schemeRegistrar.proposeToAddModifyScheme({
      avatar: avatar.address,
      scheme: contributionReward.address,
      schemeName: "ContributionReward",
      schemeParametersHash: schemeParametersHash
    });

    const proposalId = result.proposalId;

    // this will vote-and-execute
    await votingMachine.vote(proposalId, 1, { from: accounts[1] });

    // now our scheme should be registered on the controller
    const schemeFromController = await controller.schemes(contributionReward.address);
    // we expect to have only the first bit set (it is a registered scheme without nay particular permissions)
    assert.equal(schemeFromController[1], "0x00000001");

    // is the dao registered?
    const orgFromContributionScheme = await dao.isSchemeRegistered(contributionReward.address);

    assert.equal(orgFromContributionScheme, true);
    // check the configuration for proposing new contributions

    paramsHash = await controller.getSchemeParameters(contributionReward.address, dao.avatar.address);

    // params are: uint orgNativeTokenFee; bytes32 voteApproveParams; BoolVoteInterface boolVote;
    params = await contributionReward.parameters(paramsHash);
    // check if they are not trivial - the 3rd item should be a valid boolVote address
    assert.notEqual(params[2], "0x0000000000000000000000000000000000000000");
    assert.equal(params[2], votingMachine.address);
    // now we can propose a contribution
    result = await contributionReward.proposeContributionReward({
      avatar: avatar.address,
      description: "a fair play",
      nativeTokenReward: 1,
      beneficiary: accounts[2]
    });

    const contributionId = result.proposalId;
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

    await votingMachine.vote(contributionId, 1, { from: accounts[0] });
    // and this is the majority vote (which will also call execute on the executable
    await votingMachine.vote(contributionId, 1, { from: accounts[1] });

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
