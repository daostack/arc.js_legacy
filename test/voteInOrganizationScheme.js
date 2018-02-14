import { VoteInOrganizationScheme } from "../lib/contracts/voteInOrganizationScheme";
import * as helpers from "./helpers";
import { Utils } from "../lib/utils";
import { SchemeRegistrar } from "../lib/contracts/schemeregistrar";

const createProposal = async function () {

  const originalDao = await helpers.forgeDao({
    name: "Original",
    tokenName: "Tokens of Original",
    tokenSymbol: "ORG",
    schemes: [
      { name: "ContributionReward" }
      , { name: "SchemeRegistrar" }
      , { name: "GenesisProtocol" }
    ],
    founders: [{
      address: accounts[0],
      reputation: web3.toWei(1000),
      tokens: web3.toWei(1000)
    }]
  });

  const schemeToDelete = (await originalDao.getSchemes("ContributionReward"))[0].address;
  assert.isOk(schemeToDelete);
  const schemeRegistrar = await helpers.getDaoScheme(originalDao, "SchemeRegistrar", SchemeRegistrar);
  assert.isOk(schemeRegistrar);
  const result = await schemeRegistrar.proposeToRemoveScheme(
    {
      avatar: originalDao.avatar.address,
      scheme: schemeToDelete
    });

  assert.isOk(result.proposalId);

  /**
   * get the voting machine will be used for this proposal
   */
  const votingMachine = await helpers.getSchemeVotingMachine(originalDao, schemeRegistrar, 2);

  assert.isOk(votingMachine);

  return { proposalId: result.proposalId, votingMachine: votingMachine, scheme: schemeRegistrar };
};

describe("VoteInOrganizationScheme", () => {
  let dao;
  let voteInOrganizationScheme;
  beforeEach(async () => {

    dao = await helpers.forgeDao({
      schemes: [
        { name: "VoteInOrganizationScheme" }
        , { name: "GenesisProtocol" }
      ],
      founders: [{
        address: accounts[0],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(1000)
      }]
    });

    const schemeInDao = await dao.getSchemes("VoteInOrganizationScheme");

    assert.isOk(schemeInDao);
    assert.equal(schemeInDao.length, 1);
    assert.equal(schemeInDao[0].name, "VoteInOrganizationScheme");

    voteInOrganizationScheme = await VoteInOrganizationScheme.at(schemeInDao[0].address);

    assert.isOk(voteInOrganizationScheme);
  });

  it("proposeVote organization vote", async () => {

    const proposalInfo = await createProposal();

    const options = {
      avatar: dao.avatar.address,
      originalIntVote: proposalInfo.votingMachine.address,
      originalProposalId: proposalInfo.proposalId
    };

    const result = await voteInOrganizationScheme.proposeVote(options);

    assert.isOk(result);
    assert.isOk(result.tx);
    assert.isOk(result.proposalId);

    assert.equal(result.tx.logs.length, 1); // no other event
    assert.equal(result.tx.logs[0].event, "NewVoteProposal");

    const votingMachine = await helpers.getSchemeVotingMachine(dao, voteInOrganizationScheme, 1);

    assert.isOk(votingMachine);

    /**
     * cast a helpers.vote using voteInOrganizationScheme's voting machine.
     * assert that the proposal is executed.
     */
    const tx = await helpers.vote(votingMachine, result.proposalId, 1, web3.eth.accounts[0]);
    /**
     * confirm helpers.vote was cast in the current DAO scheme
     */
    // TODO: Update these to use ProposalExecuted
    const eventProposal = Utils.getValueFromLogs(tx, "_proposalId", "ExecuteProposal", 1);
    assert.equal(eventProposal, result.proposalId);

    /**
     * confirm that a helpers.vote was cast by the original DAO's scheme
     */
    const originalVoteEvent = proposalInfo.votingMachine.VoteProposal({}, { fromBlock: 0 });

    await new Promise(async (resolve) => {
      originalVoteEvent.get((err, eventsArray) => {

        const foundVoteProposalEvent = eventsArray.filter(e => {
          return e.args._proposalId == proposalInfo.proposalId;
        });

        if (foundVoteProposalEvent.length === 1) {
          const originalVoteEvent = foundVoteProposalEvent[0];
          /**
           * expect a helpers.vote 'for'
           */
          assert.equal(originalVoteEvent.args._vote.toNumber(), 1);
          /**
           * expect the helpers.vote to have been cast on behalf of the scheme that created the proposal
           * TODO: confirm that accounts[0] is correct.
           */
          assert.equal(originalVoteEvent.args._voter, accounts[0]);
        }
        else {
          assert(false, "proposal helpers.vote not found in original scheme");
        }

        resolve();

      });
    });
  });
});
