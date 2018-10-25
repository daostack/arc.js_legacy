import { assert } from "chai";
import {
  Address,
  BinaryVoteResult,
  fnVoid,
  Hash
} from "../lib/commonTypes";
import { DecodedLogEntryEvent } from "../lib/iContractWrapperBase";
import { AbsoluteVoteWrapper } from "../lib/wrappers/absoluteVote";
import { VoteProposalEventResult } from "../lib/wrappers/iIntVoteInterface";
import { IntVoteInterfaceWrapper } from "../lib/wrappers/intVoteInterface";
import { SchemeRegistrarFactory, SchemeRegistrarWrapper } from "../lib/wrappers/schemeRegistrar";
import {
  VotableVoteInOrganizationProposal,
  VoteInOrganizationSchemeFactory,
  VoteInOrganizationSchemeWrapper
} from "../lib/wrappers/voteInOrganizationScheme";
import * as helpers from "./helpers";

const createProposal =
  async (): Promise<{ proposalId: Hash, votingMachine: IntVoteInterfaceWrapper, scheme: SchemeRegistrarWrapper }> => {

    const originalDao = await helpers.forgeDao({
      founders: [{
        address: accounts[0],
        reputation: web3.utils.toWei(30),
        tokens: web3.utils.toWei(100),
      },
      {
        address: accounts[1],
        reputation: web3.utils.toWei(30),
        tokens: web3.utils.toWei(100),
      }],
      name: "Original",
      schemes: [
        { name: "ContributionReward" }
        , {
          name: "SchemeRegistrar",
          votingMachineParams: {
            ownerVote: false,
          },
        },
      ],
      tokenName: "Tokens of Original",
      tokenSymbol: "ORG",
    });

    const schemeToDelete = (await originalDao.getSchemes("ContributionReward"))[0].address;
    assert.isOk(schemeToDelete);

    const schemeRegistrar =
      await helpers.getDaoScheme(originalDao, "SchemeRegistrar", SchemeRegistrarFactory) as SchemeRegistrarWrapper;
    assert.isOk(schemeRegistrar);
    /**
     * propose to remove ContributionReward.  It should get the ownerVote, then requiring just 30 more reps to execute.
     */
    const result = await schemeRegistrar.proposeToRemoveScheme(
      {
        avatar: originalDao.avatar.address,
        schemeAddress: schemeToDelete,
      });

    const proposalId = await result.getProposalIdFromMinedTx();
    assert.isOk(proposalId);

    /**
     * get the voting machine that will be used to vote for this proposal
     */
    const votingMachine = await helpers.getSchemeVotingMachine(originalDao, schemeRegistrar);

    assert.isOk(votingMachine);
    assert.isFalse(await helpers.voteWasExecuted(votingMachine, proposalId));

    return { proposalId, votingMachine, scheme: schemeRegistrar };
  };

describe("VoteInOrganizationScheme", () => {
  let dao;
  let voteInOrganizationScheme: VoteInOrganizationSchemeWrapper;
  beforeEach(async () => {

    dao = await helpers.forgeDao({
      founders: [{
        address: accounts[0],
        reputation: web3.utils.toWei(30),
        tokens: web3.utils.toWei(100),
      },
      {
        address: accounts[1],
        reputation: web3.utils.toWei(30),
        tokens: web3.utils.toWei(100),
      },
      {
        address: accounts[2],
        reputation: web3.utils.toWei(30),
        tokens: web3.utils.toWei(100),
      },
      ],
      schemes: [
        {
          name: "VoteInOrganizationScheme",
          votingMachineParams: {
            ownerVote: false,
          },
        },
      ],
    });

    voteInOrganizationScheme = await helpers.getDaoScheme(
      dao,
      "VoteInOrganizationScheme",
      VoteInOrganizationSchemeFactory) as VoteInOrganizationSchemeWrapper;

    assert.isOk(voteInOrganizationScheme);
  });

  it("can get proposed votes", async () => {

    /**
     * this is the proposal we'll vote on remotely
     */
    const originalProposalInfo = await createProposal();

    const options = {
      avatar: dao.avatar.address,
      originalProposalId: originalProposalInfo.proposalId,
      originalVotingMachineAddress: originalProposalInfo.votingMachine.address,
    };

    const proposalInfo = await voteInOrganizationScheme.proposeVoteInOrganization(options);
    const proposalInfo2 = await voteInOrganizationScheme.proposeVoteInOrganization(options);

    const proposals = await (
      await voteInOrganizationScheme.getVotableProposals(dao.avatar.address))(
        {},
        { fromBlock: 0 }
      ).get();

    assert.equal(proposals.length, 2);

    const proposalId1 = await proposalInfo.getProposalIdFromMinedTx();
    const proposalId2 = await proposalInfo2.getProposalIdFromMinedTx();

    assert.equal(
      proposals.filter(
        /* tslint:disable-next-line:max-line-length */
        (p: VotableVoteInOrganizationProposal) => p.proposalId === proposalId1).length,
      1,
      "first proposal not found");

    assert.equal(
      proposals.filter(
        /* tslint:disable-next-line:max-line-length */
        (p: VotableVoteInOrganizationProposal) => p.proposalId === proposalId2).length,
      1,
      "second proposal not found");
  });

  it("proposeVoteInOrganization organization vote", async () => {

    /**
     * this is the proposal we'll vote on remotely
     */
    const proposalInfo = await createProposal();

    const options = {
      avatar: dao.avatar.address,
      originalProposalId: proposalInfo.proposalId,
      originalVotingMachineAddress: proposalInfo.votingMachine.address,
    };

    const result = await voteInOrganizationScheme.proposeVoteInOrganization(options);

    assert.isOk(result);
    assert.isOk(result.tx);

    const proposalId = await result.getProposalIdFromMinedTx();

    assert.isOk(proposalId);

    const tx = await result.watchForTxMined();

    assert.equal(tx.logs.length, 1); // no other event
    // TODO: restore this: assert.equal(tx.logs[0].event, "NewVoteProposal");

    const votingMachine = await helpers.getSchemeVotingMachine(dao, voteInOrganizationScheme);

    assert.isOk(votingMachine);

    /**
     * cast a vote using voteInOrganizationScheme's voting machine.
     */
    await helpers.vote(votingMachine, proposalId, BinaryVoteResult.Yes, accounts[1]);
    await helpers.vote(votingMachine, proposalId, BinaryVoteResult.Yes, accounts[2]);
    /**
     * confirm that a vote was cast by the original DAO's scheme
     */
    const originalVoteEvent = votingMachine.VoteProposal({}, { fromBlock: 0 });

    await new Promise(async (resolve: fnVoid): Promise<void> => {
      originalVoteEvent.get((err: Error, eventsArray: Array<DecodedLogEntryEvent<VoteProposalEventResult>>) => {

        const foundVoteProposalEvent = eventsArray.filter((e: DecodedLogEntryEvent<VoteProposalEventResult>) => {
          return e.args._proposalId === proposalInfo.proposalId;
        });

        if (foundVoteProposalEvent.length === 1) {
          const event = foundVoteProposalEvent[0];
          /**
           * expect a vote 'for'
           */
          assert.equal(event.args._vote.toNumber(), 1);
          /**
           * expect the vote to have been cast on behalf of the DAO
           */
          assert.equal(event.args._voter, dao.avatar.address, "wrong user voted");
        } else {
          assert(false, "proposal vote not found in original scheme");
        }
        resolve();
      });
    });
  });
});
