"use strict";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Web3EventService } from "../web3EventService";
import { Locking4ReputationWrapper, ReleaseOptions } from "./Locking4Reputation";

export class LockingEth4ReputationWrapper extends Locking4ReputationWrapper {
  public name: string = "LockingEth4Reputation";
  public friendlyName: string = "Locking Eth For Reputation";
  public factory: IContractWrapperFactory<LockingEth4ReputationWrapper> = LockingEth4ReputationFactory;

  public release(options: ReleaseOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    super._release(options);

    this.logContractFunctionCall("LockingEth4Reputation.release", options);

    return this.wrapTransactionInvocation("LockingEth4Reputation.release",
      options,
      this.contract.release,
      [options.lockerAddress, options.lockingId]
    );
  }

  public async lock(options: Locking4EthOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    if (!Number.isInteger(options.period)) {
      throw new Error("period is not an integer");
    }

    if (options.period <= 0) {
      throw new Error("period must be greater then zero");
    }

    this.logContractFunctionCall("LockingEth4Reputation.lock", options);

    return this.wrapTransactionInvocation("LockingEth4Reputation.lock",
      options,
      this.contract.lock,
      [options.period]
    );
  }
}

export class LockingEth4ReputationType extends ContractWrapperFactory<LockingEth4ReputationWrapper> {

  public async deployed(): Promise<LockingEth4ReputationWrapper> {
    throw new Error("LockingEth4Reputation has not been deployed");
  }
}

export const LockingEth4ReputationFactory =
  new LockingEth4ReputationType(
    "LockingEth4Reputation",
    LockingEth4ReputationWrapper,
    new Web3EventService()) as LockingEth4ReputationType;

export interface Locking4EthOptions {
  period: number;
}
