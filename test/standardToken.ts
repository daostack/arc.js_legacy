"use strict";
import { assert } from "chai";
import { Utils } from "../lib/utils";
import { UtilsInternal } from "../lib/utilsInternal";
import { WrapperService } from "../lib/wrapperService";
import "./helpers";

describe("Standard Token", () => {

  it("can approve transaction", async () => {

    const tokenAddress = await Utils.getGenTokenAddress();
    assert.isOk(tokenAddress);
    const token = await WrapperService.factories.StandardToken.at(tokenAddress);
    assert.isOk(token);

    const amount = web3.toWei(1);
    const result = await token.approve({
      amount,
      onBehalfOf: accounts[1],
      spender: accounts[0],
    });

    await result.getTxConfirmed();

    const currentBlock = await UtilsInternal.lastBlock();
    const txHash = await token.contract.transfer(accounts[1], amount);

    assert.isOk(txHash);

    const event = token.Approval({ spender: accounts[0] }, { fromBlock: currentBlock });
    const events = await event.get();

    assert.equal(events.length, 1);
    assert.equal(events[0].args.value.toString(), amount);
  });
});
