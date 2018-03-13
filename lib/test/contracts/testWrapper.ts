"use strict";
import { AbsoluteVoteParams } from "contracts/absoluteVote";
import { DefaultSchemePermissions, Hash, SchemePermissions } from "../../commonTypes";
import { ArcTransactionDataResult, ContractWrapperBase } from "../../contractWrapperBase";
import ContractWrapperFactory from "../../contractWrapperFactory";

export class TestWrapperWrapper extends ContractWrapperBase {
  /**
   * Name used by Arc.js.Contracts and Arc.
   */
  public shortName: string = "TestWrapper";
  /**
   * Friendly name of the contract
   */
  public longName: string = "Test Wrapper";

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

    return super._setParameters(
      ["address", "uint", "bool"],
      [params.reputation, params.votePerc, params.ownerVote]
    );
  }

  public getDefaultPermissions(overrideValue?: SchemePermissions | DefaultSchemePermissions): SchemePermissions {
    // return overrideValue || Utils.numberToPermissionsString(DefaultSchemePermissions.MinimumPermissions);
    return (overrideValue || DefaultSchemePermissions.MinimumPermissions) as SchemePermissions;
  }
}

const TestWrapper = new ContractWrapperFactory("AbsoluteVote", TestWrapperWrapper);
export { TestWrapper };
