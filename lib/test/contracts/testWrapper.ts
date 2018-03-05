"use strict";

import { AbsoluteVoteParams } from "contracts/absoluteVote";
import ContractWrapperFactory from "../../ContractWrapperFactory";
import { ArcTransactionDataResult, ExtendTruffleContract, Hash } from "../../ExtendTruffleContract";
import { Utils } from "../../utils";
const SolidityContract = Utils.requireContract("AbsoluteVote");

export class TestWrapperWrapper extends ExtendTruffleContract {

  constructor() {
    super(SolidityContract);
  }

  public foo(): string {
    return "bar";
  }

  public aMethod(): string {
    return "abc";
  }

  public async setParams(params: AbsoluteVoteParams): Promise<ArcTransactionDataResult<Hash>> {
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

  public getDefaultPermissions(overrideValue?: string): string {
    return overrideValue || "0x00000009";
  }
}

const TestWrapper = new ContractWrapperFactory(SolidityContract, TestWrapperWrapper);
export { TestWrapper };
