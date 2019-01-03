"use strict";
import { BigNumber } from "bignumber.js";
import { Address } from "../commonTypes";
import { ArcTransactionResult } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { EventFetcherFactory } from "../web3EventService";

export interface IBurnableTokenWrapper {

  /**
   * Burn the given number of tokens
   * @param options
   */
  burn(options: BurnableTokenBurnOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult>;
  /**
   * TODO: add burnFrom
   */
}

export interface BurnableTokenBurnOptions {
  /**
   * Amount to burn
   */
  amount: BigNumber | string;
}

export interface BurnEventResult {
  /**
   * Who burnt the tokens
   * indexed
   */
  burner: Address;
  /**
   * Amount burnt
   */
  value: BigNumber;
}
