"use strict";
import { assert } from "chai";
import {
  DecodedLogEntryEvent,
} from "ethereum-types";
import { Utils } from "../lib/utils";
import { UtilsInternal } from "../lib/utilsInternal";
import {
  Web3EventService
} from "../lib/web3EventService";
import {
  ApprovalEventResult,
  StandardTokenFactory,
} from "../lib/wrappers/standardToken";
import "./helpers";

describe("Web3EventService", () => {

  interface EntityType { blockNumber: number; }

  const makeTransactions = async (count: number = 1): Promise<void> => {
    while (count--) {
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: accounts[3],
        value: web3.utils.toWei(0.00001, "ether"),
      });
    }
  };

  it("can get entity with requiredDepth", async () => {

    const tokenAddress = await Utils.getGenTokenAddress();
    assert.isOk(tokenAddress);
    const token = await StandardTokenFactory.at(tokenAddress);
    assert.isOk(token);

    const initialBlockNumber = await UtilsInternal.lastBlockNumber();
    let currentBlockNumber = initialBlockNumber;
    let eventBlockNumber = currentBlockNumber;

    const web3EventService = new Web3EventService();

    const fetcher = web3EventService.createEntityFetcherFactory<EntityType, ApprovalEventResult>(
      token.Approval,
      async (event: DecodedLogEntryEvent<ApprovalEventResult>): Promise<any> => {
        return Promise.resolve({ blockNumber: event.blockNumber });
      })({ spender: accounts[0], owner: accounts[4] }, { fromBlock: initialBlockNumber });

    const amount = web3.utils.toWei("1");
    const result = await token.approve({
      amount,
      owner: accounts[4],
      spender: accounts[0],
    });

    await result.getTxConfirmed();

    await makeTransactions(2);

    await new Promise(async (
      resolve: () => void,
      reject: () => void): Promise<void> => {
      fetcher.get(async (error: Error, entitiesPromise: Promise<Array<EntityType>>) => {
        const entities = await entitiesPromise;
        for (const entity of entities) {
          currentBlockNumber = await UtilsInternal.lastBlockNumber();
          eventBlockNumber = entity.blockNumber;
        }
        resolve();
      }, 2);
    });

    assert.equal(eventBlockNumber, currentBlockNumber - 2);
  });

  it("can watch entity with requiredDepth", async () => {

    const tokenAddress = await Utils.getGenTokenAddress();
    assert.isOk(tokenAddress);
    const token = await StandardTokenFactory.at(tokenAddress);
    assert.isOk(token);

    const initialBlockNumber = await UtilsInternal.lastBlockNumber();
    let currentBlockNumber = initialBlockNumber;
    let eventBlockNumber = currentBlockNumber;

    const web3EventService = new Web3EventService();

    const fetcher = web3EventService.createEntityFetcherFactory<EntityType, ApprovalEventResult>(
      token.Approval,
      async (event: DecodedLogEntryEvent<ApprovalEventResult>): Promise<EntityType> => {
        return { blockNumber: event.blockNumber };
      })({ spender: accounts[0], owner: accounts[4] }, { fromBlock: initialBlockNumber });

    let done = false;
    const promise = new Promise(async (
      resolve: () => void,
      reject: () => void): Promise<void> => {
      fetcher.watch(async (error: Error, entity: EntityType) => {

        currentBlockNumber = await UtilsInternal.lastBlockNumber();
        eventBlockNumber = entity.blockNumber;
        done = true;
        resolve();
      }, 2);
    });

    const amount = web3.utils.toWei("1");
    const result = await token.approve({
      amount,
      owner: accounts[4],
      spender: accounts[0],
    });

    await result.getTxConfirmed();

    await makeTransactions(2);

    const timeoutPromise = new Promise(
      async (
        resolve: () => void,
        reject: () => void): Promise<void> => {
        // give the watch two seconds to find the tx
        setTimeout(() => { assert(done, "didn't find tx of required depth"); resolve(); }, 2000);
      });

    await Promise.all([timeoutPromise, promise]);

    fetcher.stopWatching();

    assert.equal(eventBlockNumber, currentBlockNumber - 2);
  });

  it("can watch event with requiredDepth", async () => {

    const tokenAddress = await Utils.getGenTokenAddress();
    assert.isOk(tokenAddress);
    const token = await StandardTokenFactory.at(tokenAddress);
    assert.isOk(token);

    const initialBlockNumber = await UtilsInternal.lastBlockNumber();
    let currentBlockNumber = initialBlockNumber;
    let eventBlockNumber = currentBlockNumber;
    let done = false;

    const fetcher = token.Approval({ spender: accounts[0], owner: accounts[4] }, { fromBlock: initialBlockNumber });

    const promise = new Promise(async (
      resolve: () => void,
      reject: () => void): Promise<void> => {
      fetcher.watch(async (error: Error, event: DecodedLogEntryEvent<ApprovalEventResult>) => {
        currentBlockNumber = await UtilsInternal.lastBlockNumber();
        eventBlockNumber = event.blockNumber;
        done = true;
        resolve();
      }, 2);
    });

    const amount = web3.utils.toWei("1");
    const result = await token.approve({
      amount,
      owner: accounts[4],
      spender: accounts[0],
    });

    await result.getTxConfirmed();

    await makeTransactions(2);

    const timeoutPromise = new Promise(
      async (
        resolve: () => void,
        reject: () => void): Promise<void> => {
        // give the watch two seconds to find the tx
        setTimeout(() => { assert(done, "didn't find tx of required depth"); resolve(); }, 2000);
      });

    await Promise.all([timeoutPromise, promise]);

    fetcher.stopWatching();

    assert.equal(eventBlockNumber, currentBlockNumber - 2);
  });

  it("will wait for event with requiredDepth", async () => {

    const tokenAddress = await Utils.getGenTokenAddress();
    assert.isOk(tokenAddress);
    const token = await StandardTokenFactory.at(tokenAddress);
    assert.isOk(token);

    let found = false;

    const fetcher = token.Approval({ spender: accounts[0], owner: accounts[4] }, { fromBlock: "latest" });

    fetcher.watch(async (error: Error, event: DecodedLogEntryEvent<ApprovalEventResult>) => {
      found = true;
    }, 4);

    const result = await token.approve({
      amount: web3.utils.toWei("1"),
      owner: accounts[4],
      spender: accounts[0],
    });

    await result.getTxConfirmed();

    await makeTransactions(2);

    // give the watch three seconds to not find the tx
    await UtilsInternal.sleep(3000);

    /**
     * there is no way to shut down the fetcher if it is still watching for the transaction to
     * appear at the given depth -- there is an inner watch.  So jump
     * through some hoops here.
     */
    const wasFound = found;

    // enable the watch to shut down
    await makeTransactions(2);

    fetcher.stopWatching();

    assert(!wasFound, "didn't wait for tx of required depth");

  });
});
