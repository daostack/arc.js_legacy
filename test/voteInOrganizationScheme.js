import { VoteInOrganizationScheme } from "../test-dist/wrappers/voteInOrganizationScheme";
import * as helpers from "./helpers";
import { SchemeRegistrar } from "../test-dist/wrappers/schemeregistrar";

const createProposal = async () => {

  const originalDao = await helpers.forgeDao({
    name: "Original",
    tokenName: "Tokens of Original",
    tokenSymbol: "ORG",
    schemes: [
      { name: "ContributionReward" }
      , {
        name: "SchemeRegistrar",
        votingMachineParams: {
          ownerVote: false
        }
      }
    ],
    founders: [{
      address: accounts[0],
      reputation: web3.toWei(30),
      tokens: web3.toWei(100)
    },
    {
      address: accounts[1],
      reputation: web3.toWei(30),
      tokens: web3.toWei(100)
    }]
  });

  const schemeToDelete = (await originalDao.getSchemes("ContributionReward"))[0].address;
  assert.isOk(schemeToDelete);

  const schemeRegistrar = await helpers.getDaoScheme(originalDao, "SchemeRegistrar", SchemeRegistrar);
  assert.isOk(schemeRegistrar);
  /**
   * propose to remove ContributionReward.  It should get the ownerVote, then requiring just 30 more reps to execute.
  */
  const result = await schemeRegistrar.proposeToRemoveScheme(
    {
      avatar: originalDao.avatar.address,
      schemeAddress: schemeToDelete
    });

  assert.isOk(result.proposalId);

  /**
   * get the voting machine that will be used to vote for this proposal
   */
  const votingMachine = await helpers.getSchemeVotingMachine(originalDao, schemeRegistrar);

  assert.isOk(votingMachine);
  assert.isFalse(await helpers.voteWasExecuted(votingMachine, result.proposalId));

  return { proposalId: result.proposalId, votingMachine: votingMachine, scheme: schemeRegistrar };
};

describe("VoteInOrganizationScheme", () => {
  let dao;
  let voteInOrganizationScheme;
  beforeEach(async () => {

    dao = await helpers.forgeDao({
      schemes: [
        {
          name: "VoteInOrganizationScheme",
          votingMachineParams: {
            ownerVote: false
          }
        }
      ],
      founders: [{
        address: accounts[0],
        reputation: web3.toWei(30),
        tokens: web3.toWei(100)
      },
      {
        address: accounts[1],
        reputation: web3.toWei(30),
        tokens: web3.toWei(100)
      },
      {
        address: accounts[2],
        reputation: web3.toWei(30),
        tokens: web3.toWei(100)
      }
      ]
    });

    voteInOrganizationScheme = await helpers.getDaoScheme(dao, "VoteInOrganizationScheme", VoteInOrganizationScheme);

    assert.isOk(voteInOrganizationScheme);
  });

  it("proposeVote organization vote", async () => {

    /**
     * this is the proposal we'll vote on remotely
     */
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

    const votingMachine = await helpers.getSchemeVotingMachine(dao, voteInOrganizationScheme);

    assert.isOk(votingMachine);

    /**
     * cast a vote using voteInOrganizationScheme's voting machine.
     */
    await helpers.vote(votingMachine, result.proposalId, 1, accounts[1]);
    await helpers.vote(votingMachine, result.proposalId, 1, accounts[2]);
    /**
     * confirm that a vote was cast by the original DAO's scheme
     */
    const originalVoteEvent = proposalInfo.votingMachine.contract.VoteProposal({}, { fromBlock: 0 });

    await new Promise(async (resolve) => {
      originalVoteEvent.get((err, eventsArray) => {

        const foundVoteProposalEvent = eventsArray.filter(e => {
          return e.args._proposalId === proposalInfo.proposalId;
        });

        if (foundVoteProposalEvent.length === 1) {
          const originalVoteEvent = foundVoteProposalEvent[0];
          /**
           * expect a vote 'for'
           */
          assert.equal(originalVoteEvent.args._vote.toNumber(), 1);
          /**
           * expect the vote to have been cast on behalf of the DAO
           */
          assert.equal(originalVoteEvent.args._voter, dao.avatar.address, "wrong user voted");
        }
        else {
          assert(false, "proposal vote not found in original scheme");
        }

        resolve();

      });
    });
  });
});
