"use strict";
import { BigNumber } from "bignumber.js";
import { assert } from "chai";
import { TransactionReceiptsEventInfo, TransactionService } from "../lib/transactionService";
import { Utils, Web3 } from "../lib/utils";
import { UtilsInternal } from "../lib/utilsInternal";
import { DaoTokenWrapper } from "../lib/wrappers/daoToken";
import { MintableTokenFactory, MintableTokenWrapper } from "../lib/wrappers/mintableToken";
import * as helpers from "./helpers";

describe("Tokens", () => {

  let genToken: DaoTokenWrapper;
  let mintableToken: MintableTokenWrapper;
  let web3: Web3;

  beforeEach(async () => {
    web3 = await Utils.getWeb3();
    genToken = await DaoTokenWrapper.getGenToken();
    assert.isOk(genToken);
    // assumes running in ganache and that ganache was started by arc.js (with the correct network id)
    assert.equal(genToken.address, "0xe78a0f7e598cc8b0bb87894b0f60dd2a88d6a8ab");
    assert.equal(await genToken.getTokenName(), "DAOstack");
    assert.equal(await genToken.getTokenSymbol(), "GEN");
    mintableToken = await MintableTokenFactory.new();
    assert.isOk(mintableToken);
    await (await mintableToken.mint({
      amount: web3.toWei("1000"),
      recipient: accounts[0],
    })).watchForTxMined();
    // so the mint doesn't appear in events
    await helpers.increaseTime(1);
  });

  it("can approve and transfer from", async () => {

    const amount = web3.toWei(1);

    let currentBlock = await UtilsInternal.lastBlockNumber();

    await genToken.approve({
      amount,
      // has to be the 'from' in transferFrom
      owner: accounts[1],
      // has to be the msg.sender of transferFrom
      spender: accounts[0],
    });

    const approvalEvent = genToken.Approval({ spender: accounts[0] }, { fromBlock: currentBlock });
    const approvalEvents = await approvalEvent.get();

    assert.equal(approvalEvents.length, 1);
    assert.equal(approvalEvents[0].args.value.toString(), amount);
    assert.equal(approvalEvents[0].args.owner.toString(), accounts[1]);

    currentBlock = await UtilsInternal.lastBlockNumber();

    const eventsReceived = new Array<string>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.DaoToken.transferFrom.mined",
        "TxTracking.MintableToken.transferFrom.mined",
        "TxTracking.StandardToken.transferFrom.mined"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(topic);
      });

    try {
      const txHash = await
        (await genToken.transferFrom({ from: accounts[1], to: accounts[2], amount })).watchForTxMined();
      assert.isOk(txHash);
    } finally {
      await subscription.unsubscribe(0);
    }

    const event = genToken.Transfer({ from: accounts[1] }, { fromBlock: currentBlock });
    const events = await event.get();

    assert.equal(events.length, 1);
    assert.equal(events[0].args.value.toString(), amount);
    assert.equal(events[0].args.to, accounts[2]);

    assert.equal(eventsReceived.length, 3, "didn't receive the right number of txTracking events");
  });

  it("can transfer", async () => {

    const amount = web3.toWei(1);
    const currentBlock = await UtilsInternal.lastBlockNumber();

    const eventsReceived = new Array<string>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.MintableToken.transfer.mined"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(topic);
      });

    try {
      const result = await (await mintableToken.transfer({ to: accounts[1], amount })).watchForTxMined();
      assert.isOk(result);
    } finally {
      await subscription.unsubscribe(0);
    }

    const fetcher = mintableToken.Transfer(
      { from: accounts[0] },
      { fromBlock: currentBlock });

    const events = await fetcher.get();

    assert.equal(events.length, 1);
    assert.equal(events[0].args.value.toString(), amount);

    assert.equal(eventsReceived.length, 1, "didn't receive the right number of txTracking events");
  });

  it("can mint", async () => {

    const amount = web3.toWei(1);
    const currentBlock = await UtilsInternal.lastBlockNumber();

    const eventsReceived = new Array<string>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.MintableToken.mint.mined"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(topic);
      });

    try {
      const result = await (await mintableToken.mint({ recipient: accounts[1], amount })).watchForTxMined();
      assert.isOk(result);
    } finally {
      await subscription.unsubscribe(0);
    }

    const fetcher = mintableToken.Mint(
      { to: accounts[1] },
      { fromBlock: currentBlock });

    const events = await fetcher.get();

    assert.equal(events.length, 1);
    assert.equal(events[0].args.amount.toString(), amount);
    assert.equal(eventsReceived.length, 1, "didn't receive the right number of txTracking events");
  });

  it("can burn", async () => {

    const amount = web3.toWei(1);
    const currentBlock = await UtilsInternal.lastBlockNumber();

    const eventsReceived = new Array<string>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.DaoToken.burn.mined"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(topic);
      });

    try {
      const result = await (await genToken.burn({ amount })).watchForTxMined();
      assert.isOk(result);
    } finally {
      await subscription.unsubscribe(0);
    }

    const fetcher = genToken.Burn(
      {},
      { fromBlock: currentBlock });

    const events = await fetcher.get();

    assert.equal(events.length, 1);
    assert.equal(events[0].args.value.toString(), amount);
    assert.equal(events[0].args.burner, accounts[0]);
    assert.equal(eventsReceived.length, 1, "didn't receive the right number of txTracking events");
  });

  it("can increaseApproval", async () => {

    const amount = web3.toWei(1);
    const currentBlock = await UtilsInternal.lastBlockNumber();
    const currentAllowance = await mintableToken.allowance(
      {
        owner: accounts[1],
        spender: accounts[0],
      }
    );

    const eventsReceived = new Array<string>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.MintableToken.increaseApproval.mined"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(topic);
      });

    try {
      const result = await (await mintableToken.increaseApproval({
        amount,
        // has to be the 'from' in transferFrom
        owner: accounts[1],
        // has to be the msg.sender of transferFrom
        spender: accounts[0],
      })).watchForTxMined();
      assert.isOk(result);
    } finally {
      await subscription.unsubscribe(0);
    }

    const fetcher = mintableToken.Approval(
      {},
      { fromBlock: currentBlock });

    const events = await fetcher.get();

    assert.equal(events.length, 1);
    assert(events[0].args.value.eq(currentAllowance.add(amount)));
    assert.equal(eventsReceived.length, 1, "didn't receive the right number of txTracking events");
  });

  it("can decreaseApproval", async () => {

    const amount = web3.toWei(1);

    const eventsReceived = new Array<string>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.MintableToken.decreaseApproval.mined"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(topic);
      });

    await mintableToken.approve(
      {
        amount,
        owner: accounts[1],
        spender: accounts[0],
      });

    await helpers.increaseTime(1);

    const currentBlock = await UtilsInternal.lastBlockNumber();

    const currentAllowance = await mintableToken.allowance(
      {
        owner: accounts[1],
        spender: accounts[0],
      }
    );

    try {
      const result = await (await mintableToken.decreaseApproval({
        amount,
        // has to be the 'from' in transferFrom
        owner: accounts[1],
        // has to be the msg.sender of transferFrom
        spender: accounts[0],
      })).watchForTxMined();
      assert.isOk(result);
    } finally {
      await subscription.unsubscribe(0);
    }

    const fetcher = mintableToken.Approval(
      {},
      { fromBlock: currentBlock });

    const events = await fetcher.get();

    assert.equal(events.length, 1);
    assert(events[0].args.value.eq(currentAllowance.sub(amount)));
    assert.equal(eventsReceived.length, 1, "didn't receive the right number of txTracking events");
  });
});
