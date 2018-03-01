"use strict";

import { ExtendTruffleContract } from "../../ExtendTruffleContract";
import { Utils } from "../../utils";
const SolidityContract = Utils.requireContract("AbsoluteVote");
import ContractWrapperFactory from "../../ContractWrapperFactory";

export class TestWrapperWrapper extends ExtendTruffleContract {

  constructor() {
    super(SolidityContract);
  }

  public foo() {
    return "bar";
  }

  public aMethod() {
    return "abc";
  }

  public async setParams(params) {
    params = Object.assign({},
      {
        ownerVote: true,
        reputation: "0x1000000000000000000000000000000000000000",
        votePerc: 50,
      },
      params);

    return super.setParams(
      params.reputation,
      params.votePerc,
      params.ownerVote
    );
  }

  public getDefaultPermissions(overrideValue?: string) {
    return overrideValue || "0x00000009";
  }
}

const TestWrapper = new ContractWrapperFactory(SolidityContract, TestWrapperWrapper);
export { TestWrapper };
