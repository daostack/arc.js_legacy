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
import { UtilsInternal } from "../lib/utilsInternal";
import * as helpers from "./helpers";

describe("TransactionService", () => {

  it("has consistent invocationKey across the entire context", async () => {

    const av = WrapperService.wrappers.AbsoluteVote;

    const eventsReceived = new Array<string>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.AbsoluteVote.setParameters.confirmed"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(topic);
      });

    const fnSave = TransactionService.watchForConfirmedTransaction;
    try {
      // force an error to happen
      TransactionService.watchForConfirmedTransaction = (): Promise<any> => {
        return Promise.reject(new Error("faking exception"));
      };

      const result = await av.setParameters({ ownerVote: true, reputation: helpers.SOME_ADDRESS, votePerc: 50 });

      const filter = web3.eth.filter("latest");

      await new Promise(async (
        resolve: () => void,
        reject: () => void): Promise<void> => {
        filter.watch(async (ex: Error): Promise<void> => {
          if (!ex) {
            const receipt = await TransactionService.getConfirmedTransaction(result.tx, undefined);
            if (receipt) {
              UtilsInternal.stopWatchingAsync(filter).then(() => {
                return resolve();
              });
            }
          } else {
            return reject();
          }
        });
      });

    } finally {
      TransactionService.watchForConfirmedTransaction = fnSave;
      await subscription.unsubscribe(0);
    }

    assert.equal(eventsReceived.length, 1, "didn't receive the right number of events");
    assert.equal(eventsReceived[0],
      "TxTracking.AbsoluteVote.setParameters.confirmed.failed", "didn't receive the failed event");
  });

  it("receives fail event on confirmed error", async () => {

    const av = WrapperService.wrappers.AbsoluteVote;

    const eventsReceived = new Array<string>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.AbsoluteVote.setParameters.confirmed"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(topic);
      });

    const fnSave = TransactionService.watchForConfirmedTransaction;
    try {
      // force an error to happen
      TransactionService.watchForConfirmedTransaction = (): Promise<any> => {
        return Promise.reject(new Error("faking exception"));
      };

      const result = await av.setParameters({ ownerVote: true, reputation: helpers.SOME_ADDRESS, votePerc: 50 });

      const filter = web3.eth.filter("latest");

      await new Promise(async (
        resolve: () => void,
        reject: () => void): Promise<void> => {
        filter.watch(async (ex: Error): Promise<void> => {
          if (!ex) {
            const receipt = await TransactionService.getConfirmedTransaction(result.tx, undefined);
            if (receipt) {
              UtilsInternal.stopWatchingAsync(filter).then(() => {
                return resolve();
              });
            }
          } else {
            return reject();
          }
        });
      });

    } finally {
      TransactionService.watchForConfirmedTransaction = fnSave;
      await subscription.unsubscribe(0);
    }

    assert.equal(eventsReceived.length, 1, "didn't receive the right number of events");
    assert.equal(eventsReceived[0],
      "TxTracking.AbsoluteVote.setParameters.confirmed.failed", "didn't receive the failed event");
  });

  // it("receives fail event on mined status 0", async () => {

  //   const av = WrapperService.wrappers.AbsoluteVote;

  //   const eventsReceived = new Array<string>();

  //   const subscription = TransactionService.subscribe(
  //     ["TxTracking.AbsoluteVote.setParameters.mined"],
  //     (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
  //       eventsReceived.push(topic);
  //     });

  //   try {
  //     const result = await (<any>av).wrapTransactionInvocation(
  //       "AbsoluteVote.setParameters",
  //       { ownerVote: true, reputation: helpers.SOME_ADDRESS, votePerc: 50 },
  //       av.contract.setParameters,
  //       [helpers.SOME_ADDRESS, 50, true],
  //       // force to fail on insufficient gas
  //       { gas: 100 });

  //     const filter = web3.eth.filter("latest");

  //     await new Promise(async (
  //       resolve: () => void,
  //       reject: () => void): Promise<void> => {
  //       filter.watch(async (ex: Error): Promise<void> => {
  //         if (!ex) {
  //           const receipt = await TransactionService.getMinedTransaction(result.tx, undefined);
  //           if (receipt) {
  // UtilsInternal.stopWatchingAsync(filter).then(() => {
  //   return resolve();
  // });
  //           }
  //         } else {
  //           return reject();
  //         }
  //       });
  //     });

  //   } finally {
  //     await subscription.unsubscribe(0);
  //   }

  //   assert.equal(eventsReceived.length, 1, "didn't receive the right number of events");
  //   assert.equal(eventsReceived[0],
  //     "TxTracking.AbsoluteVote.setParameters.mined.failed", "didn't receive the failed event");
  // });

  it("receives fail event on exception when checking for mined", async () => {

    const av = WrapperService.wrappers.AbsoluteVote;

    const eventsReceived = new Array<string>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.AbsoluteVote.setParameters.mined"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(topic);
      });

    const fnSave = TransactionService.watchForMinedTransaction;
    try {
      // force an exception to happen
      TransactionService.watchForMinedTransaction = (): Promise<any> => {
        return Promise.reject(new Error("faking exception"));
      };

      const result = await av.setParameters({ ownerVote: true, reputation: helpers.SOME_ADDRESS, votePerc: 50 });

      const filter = web3.eth.filter("latest");

      await new Promise(async (
        resolve: () => void,
        reject: () => void): Promise<void> => {
        filter.watch(async (ex: Error): Promise<void> => {
          if (!ex) {
            const receipt = await TransactionService.getMinedTransaction(result.tx, undefined);
            if (receipt) {
              UtilsInternal.stopWatchingAsync(filter).then(() => {
                return resolve();
              });
            }
          } else {
            return reject();
          }
        });
      });

    } finally {
      TransactionService.watchForMinedTransaction = fnSave;
      await subscription.unsubscribe(0);
    }

    assert.equal(eventsReceived.length, 1, "didn't receive the right number of events");
    assert.equal(eventsReceived[0],
      "TxTracking.AbsoluteVote.setParameters.mined.failed", "didn't receive the failed event");
  });

  it("receives fail event on sent error", async () => {

    const av = WrapperService.wrappers.AbsoluteVote;
    let receivedException = false;

    const eventsReceived = new Array<string>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.AbsoluteVote.vote.sent"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(topic);
      });

    try {
      await av.vote({ vote: 0, proposalId: helpers.SOME_HASH });
    } catch (ex) {
      receivedException = true;
    } finally {
      await subscription.unsubscribe(0);
    }

    assert(receivedException, "didn't throw exception");
    assert.equal(eventsReceived.length, 1, "didn't receive the right number of events");
    assert.equal(eventsReceived[0], "TxTracking.AbsoluteVote.vote.sent.failed", "didn't receive the failed event");
  });

  it("can publish from subclasses", async () => {

    const eventsReceived = new Array<TransactionReceiptsEventInfo>();
    let invocationKey = -1;

    const subscription = TransactionService.subscribe(
      ["TxTracking.AbsoluteVote.vote.confirmed", "TxTracking.IntVoteInterface.vote.confirmed"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        if (invocationKey === -1) {
          invocationKey = txEventInfo.invocationKey;
        } else {
          assert.equal(invocationKey, txEventInfo.invocationKey);
        }
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

      await (await votingMachine.vote({ vote: BinaryVoteResult.Yes, proposalId })).getTxConfirmed();

    } finally {
      await subscription.unsubscribe(1000);
    }

    assert.equal(eventsReceived.length, 2);
    assert.equal(eventsReceived[0].functionName, "IntVoteInterface.vote");
    assert.equal(eventsReceived[1].functionName, "AbsoluteVote.vote");
  });

  it("can use toTxTruffle with contract name", async () => {

    const contract = await WrapperService.wrappers.DaoCreator;
    const result = await (await contract.forgeOrg({
      founders: [{ address: helpers.SOME_ADDRESS, reputation: "100", tokens: "100" }],
      name: "ArcJsTextDao",
      tokenName: "TestToken",
      tokenSymbol: "TT",
    }));

    const txReceiptMined = (await TransactionService.watchForMinedTransaction(result.tx)) as TransactionReceipt;

    const txReceipt = await TransactionService.toTxTruffle(txReceiptMined, "DaoCreator");

    assert.isOk(txReceipt.logs);
    assert.isOk(txReceipt.logs[0].args);
    assert.isOk(txReceipt.logs[0].args._avatar);
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
    let invocationKey: number;

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
          assert.equal(txEventInfo.txStage, TransactionStage.mined);
        }
        if (topic.endsWith(".confirmed")) {
          assert.equal(txEventInfo.txStage, TransactionStage.confirmed);
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
      await subscription.unsubscribe(0);
    }
    assert.equal(txCount, 19);
  });
});
