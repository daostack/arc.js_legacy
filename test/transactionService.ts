import { assert } from "chai";
import { promisify } from "util";
import { TransactionReceipt } from "web3";
import {
  AbsoluteVoteWrapper,
  GlobalConstraintRegistrarFactory,
  GlobalConstraintRegistrarWrapper,
  WrapperService
} from "../lib";
import { BinaryVoteResult, fnVoid } from "../lib/commonTypes";
import { TransactionReceiptsEventInfo, TransactionService, TransactionStage } from "../lib/transactionService";
import * as helpers from "./helpers";

describe("TransactionService", () => {

  it("can publish from subclasses", async () => {

    const eventsReceived = new Array<TransactionReceiptsEventInfo>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.AbsoluteVote.vote.confirmed", "TxTracking.IntVoteInterface.vote.confirmed"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(txEventInfo);
      });

    try {
      const dao = await helpers.forgeDao({
        schemes: [
          {
            name: "GlobalConstraintRegistrar",
            votingMachineParams: {
              ownerVote: false,
            },
          },
        ],
      });
      const tokenCapGC = WrapperService.wrappers.TokenCapGC;

      const globalConstraintParametersHash =
        (await tokenCapGC.setParameters({ token: dao.token.address, cap: 3141 })).result;

      const globalConstraintRegistrar = await helpers.getDaoScheme(
        dao,
        "GlobalConstraintRegistrar",
        GlobalConstraintRegistrarFactory) as GlobalConstraintRegistrarWrapper;

      const votingMachineHash = await helpers.getSchemeVotingMachineParametersHash(dao, globalConstraintRegistrar);

      const proposalId = await (await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
        avatar: dao.avatar.address,
        globalConstraint: tokenCapGC.address,
        globalConstraintParametersHash,
        votingMachineHash,
      })).getProposalIdFromMinedTx();

      const votingMachineAddress = await globalConstraintRegistrar.getVotingMachineAddress(dao.avatar.address);

      const votingMachine =
        (await WrapperService.factories.AbsoluteVote.at(votingMachineAddress)) as AbsoluteVoteWrapper;

      await votingMachine.vote({ vote: BinaryVoteResult.Yes, proposalId });

    } finally {
      await helpers.sleep(1000); // allow time to confirm
      subscription.unsubscribe();
    }

    assert.equal(eventsReceived.length, 2);
    assert.equal(eventsReceived[0].functionName, "IntVoteInterface.vote");
    assert.equal(eventsReceived[1].functionName, "AbsoluteVote.vote");
  });

  it("can decode and read logs", async () => {

    const contract = await WrapperService.wrappers.DaoCreator;
    const txReceipt = await (await contract.forgeOrg({
      founders: [{ address: helpers.SOME_ADDRESS, reputation: "100", tokens: "100" }],
      name: "ArcJsTextDao",
      tokenName: "TestToken",
      tokenSymbol: "TT",
    })).watchForTxMined();

    assert.isOk(txReceipt.logs);
    assert.isOk(txReceipt.logs[0].args);
    assert.isOk(txReceipt.logs[0].args._avatar);
  });

  it("can track the mining of a tx", async () => {

    const txHash = web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[5],
      value: web3.toWei(0.00001, "ether"),
    });

    const txReceipt = await TransactionService.watchForMinedTransaction(txHash);

    assert(txReceipt, "didn't find mined tx");
    assert.equal(txReceipt.transactionHash, txHash, "hashes don't match");
  });

  it("can get the depth of a tx", async () => {

    const txHash = web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[5],
      value: web3.toWei(0.00001, "ether"),
    });

    let depth: number;
    let depth2: number;

    await TransactionService.watchForMinedTransaction(txHash)
      .then(async (): Promise<void> => { depth = await TransactionService.getTransactionDepth(txHash); });

    const txHash2 = web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[5],
      value: web3.toWei(0.00001, "ether"),
    });

    await TransactionService.watchForMinedTransaction(txHash)
      .then(async (): Promise<void> => { depth2 = await TransactionService.getTransactionDepth(txHash); });

    /**
     * ganache seems to create at least one new block for every transaction
     */
    assert(depth2 > depth, `${depth2} should be greater than ${depth}`);
  });

  it("can get tx events from DAO.new", async () => {

    let txCount = 0;
    let invocationKey: symbol;

    const subscription = TransactionService.subscribe("TxTracking.DAO.new",
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        if (!invocationKey) {
          invocationKey = txEventInfo.invocationKey;
        }
        assert.equal(invocationKey, txEventInfo.invocationKey, "invocationKey doesn't match");
        assert(topic.startsWith("TxTracking.DAO.new"));
        assert.isOk(txEventInfo.options);
        assert.isOk(txEventInfo.options.schemes);
        assert.equal(txEventInfo.options.schemes.length, 2);
        assert.equal(txEventInfo.txCount, 6);
        assert(topic.endsWith(".kickoff") ||
          topic.endsWith(".sent") ||
          topic.endsWith(".mined") ||
          topic.endsWith(".confirmed"));

        if (txCount === 0) {
          assert(topic.endsWith(".kickoff"));
          assert(txEventInfo.txStage === TransactionStage.kickoff);
          assert(txEventInfo.tx === null);
        } else {
          assert(txEventInfo.tx !== null);
        }
        if (topic.endsWith(".kickoff")) {
          assert(!txEventInfo.tx);
        } else {
          assert.isOk(txEventInfo.tx);
        }
        if (topic.endsWith(".mined")) {
          assert(txEventInfo.txStage === TransactionStage.mined);
        }
        if (topic.endsWith(".confirmed")) {
          assert(txEventInfo.txStage === TransactionStage.confirmed);
        }
        if (topic.endsWith(".mined") || topic.endsWith(".confirmed")) {
          assert.isOk(txEventInfo.txReceipt);
        } else {
          assert(!txEventInfo.txReceipt);
        }
        ++txCount;
      });

    try {
      await helpers.forgeDao({
        schemes: [
          { name: "SchemeRegistrar" },
          {
            name: "UpgradeScheme",
            votingMachineParams: {
              ownerVote: true,
              votePerc: 30,
            },
          },
        ],
      });
    } finally {
      // have to wait for txs to get fully confirmed
      subscription.unsubscribe();
    }
    assert.equal(txCount, 19);
  });
});
