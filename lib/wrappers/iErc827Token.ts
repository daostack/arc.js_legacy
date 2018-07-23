"use strict";
import { ArcTransactionResult } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import {
  StandardTokenApproveOptions,
  StandardTokenChangeApprovalOptions,
  StandardTokenTransferFromOptions,
  StandardTokenTransferOptions
} from "./standardToken";

export interface IErc827TokenWrapper {

  /**
   * Approve transfer of tokens by msg.sender (or `onBehalfOf`, if given)
   * from the given "spender".  Then call the function specified
   * by `callData`, all in a single transaction.
   * @param options
   */
  approveAndCall(options: ApproveAndCallOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult>;

  /**
   * Transfer tokens from the current account to another.  Then call the function specified
   * by `callData`, all in a single transaction.
   * @param options
   */
  transferAndCall(options: TransferAndCallOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult>;

  /**
   * Transfer tokens from one address to another.  Then call the function specified
   * by `callData`, all in a single transaction.
   * @param options
   */
  transferFromAndCall(options: TransferFromAndCallOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult>;

  /**
   * Increase the number of tokens approved that msg.sender (or `onBehalfOf`, if given)
   * may transfer from the given "spender".
   * Then call the function specified by `callData`, all in a single transaction.
   * @param options
   */
  increaseApprovalAndCall(options: ChangeApprovalAndCallOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult>;

  /**
   * Decrease the number of tokens approved that msg.sender (or `onBehalfOf` if given)
   * may transfer from the given "spender".
   * Then call the function specified by `callData`, all in a single transaction.
   * @param options
   */
  decreaseApprovalAndCall(options: ChangeApprovalAndCallOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult>;
}

export interface ApproveAndCallOptions extends StandardTokenApproveOptions {
  callData: string;
}

export interface TransferAndCallOptions extends StandardTokenTransferOptions {
  callData: string;
}

export interface TransferFromAndCallOptions extends StandardTokenTransferFromOptions {
  callData: string;
}

export interface ChangeApprovalAndCallOptions extends StandardTokenChangeApprovalOptions {
  callData: string;
}
