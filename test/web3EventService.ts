"use strict";
import { assert } from "chai";
import { ApprovalEventResult, DecodedLogEntryEvent, StandardTokenFactory, Web3EventService } from "../lib/index";
import { Utils } from "../lib/utils";
import { UtilsInternal } from "../lib/utilsInternal";
import "./helpers";

describe("Web3EventService", () => {

  it("can watch entity with requiredDepth", async () => {

    const tokenAddress = await Utils.getGenTokenAddress();
    assert.isOk(tokenAddress);
    const token = await StandardTokenFactory.at(tokenAddress);
    assert.isOk(token);

    const initialBlockNumber = await UtilsInternal.lastBlock();
    let currentBlockNumber = initialBlockNumber;
    let eventBlockNumber = currentBlockNumber;

    const web3EventService = new Web3EventService();

    const fetcher = web3EventService.createEntityFetcherFactory<any, ApprovalEventResult>(
      token.Approval,
      async (event: DecodedLogEntryEvent<ApprovalEventResult>): Promise<any> => {
        return { blockNumber: event.blockNumber };
      })({ spender: accounts[0], owner: accounts[4] }, { fromBlock: initialBlockNumber });

    const promise = new Promise(async (
      resolve: () => void,
      reject: () => void): Promise<void> => {
      fetcher.watch(async (error: Error, event: DecodedLogEntryEvent<any>) => {

        currentBlockNumber = await UtilsInternal.lastBlock();
        eventBlockNumber = event.blockNumber;

        resolve();
      }, 2);
    });

    const amount = web3.toWei(1);
    const result = await token.approve({
      amount,
      onBehalfOf: accounts[4],
      spender: accounts[0],
    });

    await result.getTxConfirmed();

    await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[4],
      value: web3.toWei(0.00001, "ether"),
    });

    await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[3],
      value: web3.toWei(0.00001, "ether"),
    });

    await promise;

    fetcher.stopWatching();

    assert.equal(eventBlockNumber, currentBlockNumber - 2);
  });

  it("can watch event with requiredDepth", async () => {

    const tokenAddress = await Utils.getGenTokenAddress();
    assert.isOk(tokenAddress);
    const token = await StandardTokenFactory.at(tokenAddress);
    assert.isOk(token);

    const initialBlockNumber = await UtilsInternal.lastBlock();
    let currentBlockNumber = initialBlockNumber;
    let eventBlockNumber = currentBlockNumber;

    const fetcher = token.Approval({ spender: accounts[0], owner: accounts[4] }, { fromBlock: initialBlockNumber });

    const promise = new Promise(async (
      resolve: () => void,
      reject: () => void): Promise<void> => {
      fetcher.watch(async (error: Error, event: DecodedLogEntryEvent<ApprovalEventResult>) => {
        currentBlockNumber = await UtilsInternal.lastBlock();
        eventBlockNumber = event.blockNumber;
        resolve();
      }, 2);
    });

    const amount = web3.toWei(1);
    const result = await token.approve({
      amount,
      onBehalfOf: accounts[4],
      spender: accounts[0],
    });

    await result.getTxConfirmed();

    await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[4],
      value: web3.toWei(0.00001, "ether"),
    });

    await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[3],
      value: web3.toWei(0.00001, "ether"),
    });

    await promise;

    fetcher.stopWatching();

    assert.equal(eventBlockNumber, currentBlockNumber - 2);
  });
});
