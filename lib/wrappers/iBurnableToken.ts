"use strict";
import { BigNumber } from "../utils";
import { Address } from "../commonTypes";
import { ArcTransactionResult } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { EventFetcherFactory } from "../web3EventService";

export interface IBurnableTokenWrapper {

  Burn: EventFetcherFactory<BurnEventResult>;

  /**
   * Burn the given number of tokens
   * @param options
   */
  burn(options: BurnableTokenBurnOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult>;
}

export interface BurnableTokenBurnOptions {
  /**
   * Amount to burn
   */
  amount: BigNumber;
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
