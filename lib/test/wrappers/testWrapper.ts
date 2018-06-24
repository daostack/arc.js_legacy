"use strict";
import { DefaultSchemePermissions, Hash, SchemePermissions } from "../../commonTypes";
import { ContractWrapperBase } from "../../contractWrapperBase";
import { ContractWrapperFactory } from "../../contractWrapperFactory";
import { ArcTransactionDataResult, IContractWrapperFactory } from "../../iContractWrapperBase";
import { Web3EventService } from "../../web3EventService";
import { AbsoluteVoteParams } from "../../wrappers/absoluteVote";

export class TestWrapperWrapper extends ContractWrapperBase {

  public name: string = "AbsoluteVote";
  public friendlyName: string = "Test Wrapper";
  public factory: IContractWrapperFactory<TestWrapperWrapper> = TestWrapperFactory;

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
      "AbsoluteVote.setParameters",
      params.txEventStack,
      params.reputation,
      params.votePerc,
      params.ownerVote
    );
  }

  public getDefaultPermissions(): SchemePermissions {
    return DefaultSchemePermissions.MinimumPermissions as number;
  }
}

export const TestWrapperFactory =
  new ContractWrapperFactory("AbsoluteVote", TestWrapperWrapper, new Web3EventService());
