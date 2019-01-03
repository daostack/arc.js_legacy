"use strict";
import { ArcTransactionResult } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Erc20ApproveOptions,
  Erc20ChangeApprovalOptions,
  Erc20TransferFromOptions,
  Erc20TransferOptions } from "./erc20";

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

export interface ApproveAndCallOptions extends Erc20ApproveOptions {
  callData: string;
}

export interface TransferAndCallOptions extends Erc20TransferOptions {
  callData: string;
}

export interface TransferFromAndCallOptions extends Erc20TransferFromOptions {
  callData: string;
}

export interface ChangeApprovalAndCallOptions extends Erc20ChangeApprovalOptions {
  callData: string;
}
