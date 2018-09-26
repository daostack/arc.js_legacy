"use strict";
import BigNumber from "bignumber.js";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Web3EventService } from "../web3EventService";
import { Locking4ReputationWrapper, ReleaseOptions } from "./Locking4Reputation";

export class LockingToken4ReputationWrapper extends Locking4ReputationWrapper {
  public name: string = "LockingToken4Reputation";
  public friendlyName: string = "Locking Eth For Reputation";
  public factory: IContractWrapperFactory<LockingToken4ReputationWrapper> = LockingToken4ReputationFactory;

  public release(options: ReleaseOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    super._release(options);

    this.logContractFunctionCall("LockingToken4Reputation.release", options);

    return this.wrapTransactionInvocation("LockingToken4Reputation.release",
      options,
      this.contract.release,
      [options.lockerAddress, options.lockingId]
    );
  }

  public async lock(options: Locking4TokenOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    if (!Number.isInteger(options.period)) {
      throw new Error("period is not an integer");
    }

    if (options.period <= 0) {
      throw new Error("period must be greater then zero");
    }

    const amount = new BigNumber(options.amount);

    if (amount.lte(0)) {
      throw new Error("amount must be greater then zero");
    }

    this.logContractFunctionCall("LockingToken4Reputation.lock", options);

    return this.wrapTransactionInvocation("LockingToken4Reputation.lock",
      options,
      this.contract.lock,
      [options.amount, options.period]
    );
  }
}

export class LockingToken4ReputationType extends ContractWrapperFactory<LockingToken4ReputationWrapper> {

  public async deployed(): Promise<LockingToken4ReputationWrapper> {
    throw new Error("LockingToken4Reputation has not been deployed");
  }
}

export const LockingToken4ReputationFactory =
  new LockingToken4ReputationType(
    "LockingToken4Reputation",
    LockingToken4ReputationWrapper,
    new Web3EventService()) as LockingToken4ReputationType;

export interface Locking4TokenOptions {
  amount: BigNumber;
  period: number;
}
