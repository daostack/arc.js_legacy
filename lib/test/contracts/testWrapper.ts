"use strict";
import { AbsoluteVoteParams } from "contracts/absoluteVote";
import { DefaultSchemePermissions, Hash, SchemePermissions } from "../../commonTypes";
import ContractWrapperFactory from "../../ContractWrapperFactory";
import { ArcTransactionDataResult, ExtendTruffleContract } from "../../ExtendTruffleContract";

export class TestWrapperWrapper extends ExtendTruffleContract {

  public foo(): string {
    return "bar";
  }

  public aMethod(): string {
    return "abc";
  }

  public async setParameters(params: AbsoluteVoteParams): Promise<ArcTransactionDataResult<Hash>> {
    params = Object.assign({},
      {
        ownerVote: true,
        reputation: "0x1000000000000000000000000000000000000000",
        votePerc: 50,
      },
      params);

    return super.setParameters(
      params.reputation,
      params.votePerc,
      params.ownerVote
    );
  }

  public getDefaultPermissions(overrideValue?: SchemePermissions | DefaultSchemePermissions): SchemePermissions {
    // return overrideValue || Utils.numberToPermissionsString(DefaultSchemePermissions.MinimumPermissions);
    return (overrideValue || DefaultSchemePermissions.MinimumPermissions) as SchemePermissions;
  }
}

const TestWrapper = new ContractWrapperFactory("AbsoluteVote", TestWrapperWrapper);
export { TestWrapper };
