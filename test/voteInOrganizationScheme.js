import { DAO } from "../lib/dao";
import { VoteInOrganizationScheme } from "../lib/contracts/voteInOrganizationScheme";
import { getVotingMachineForScheme } from "./helpers";
import { Utils } from "../lib/utils";

describe("VoteInOrganization Scheme", () => {
    let dao, originalDao;
    let voteInOrganizationScheme;

    const createProposal = async function () {

        originalDao = await DAO.new({
            name: "Original",
            tokenName: "Tokens of Original",
            tokenSymbol: "ORG",
            schemes: [
                { name: "ContributionReward" }
                , { name: "SchemeRegistrar" }
            ],
            founders: [{
                address: accounts[0],
                reputation: web3.toWei(1000),
                tokens: web3.toWei(1000)
            }]
        });

        const schemeToDelete = (await originalDao.getSchemes("ContributionReward"))[0].address;
        assert.isOk(schemeToDelete);
        const schemeRegistrar = await originalDao.getScheme("SchemeRegistrar");
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
        const schemeParams = await originalDao.getSchemeParameters(schemeRegistrar);
        const votingMachine = await getVotingMachineForScheme(originalDao, schemeRegistrar, 2);

        assert.isOk(votingMachine);

        return { proposalId: result.proposalId, votingMachine: votingMachine.address };
    };

    beforeEach(async () => {

        dao = await DAO.new({
            name: "Skynet",
            tokenName: "Tokens of skynet",
            tokenSymbol: "SNT",
            schemes: [
                { name: "VoteInOrganizationScheme" }
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
            originalIntVote: proposalInfo.votingMachine,
            originalProposalId: proposalInfo.proposalId
        };

        const result = await voteInOrganizationScheme.proposeVote(options);

        assert.isOk(result);
        assert.isOk(result.tx);
        assert.isOk(result.proposalId);

        assert.equal(result.tx.logs.length, 1); // no other event
        assert.equal(result.tx.logs[0].event, "NewVoteProposal");

        const votingMachine = await getVotingMachineForScheme(dao, voteInOrganizationScheme, 0);

        assert.isOk(votingMachine);

        /**
         * cast a vote using voteInOrganizationScheme's voting machine.
         * assert that the proposal is executed.
         */
        const tx = await votingMachine.vote(result.proposalId, 1, { from: web3.eth.accounts[0] });
        // TODO: Update these to use ProposalExecuted
        // const eventAvatar = Utils.getValueFromLogs(tx, "_avatar", "LogExecuteProposal", 1);
        // assert.equal(eventAvatar, dao.avatar.address);
        const eventProposal = Utils.getValueFromLogs(tx, "_proposalId", "LogExecuteProposal", 1);
        assert.equal(eventProposal, result.proposalId);
    });
});
