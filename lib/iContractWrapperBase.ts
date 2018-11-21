import BigNumber from "bignumber.js";
import { Address, Hash, SchemePermissions } from "./commonTypes";
import {
  TransactionReceiptTruffle,
  TransactionService
} from "./transactionService";
import { IIntVoteInterface } from "./wrappers/iIntVoteInterface";

export interface IContractWrapper {
  factory: IContractWrapperFactory<any>;
  name: string;
  friendlyName: string;
  address: Address;
  contract: any;
  hydrateFromNew(...rest: Array<any>): Promise<any>;
  hydrateFromAt(address: string): Promise<any>;
}

/**
 * The minimum requirements for a scheme that can be registered with a DAO/controller.
 */
export interface ISchemeWrapper extends IContractWrapper {
  getSchemePermissions(avatarAddress: Address): Promise<SchemePermissions>;
  getDefaultPermissions(): SchemePermissions;
}

/**
 * The minimum requirements for a universal scheme.
 */
export interface IUniversalSchemeWrapper extends ISchemeWrapper {
  getParameters(paramsHash: Hash): Promise<any>;
  getParametersHash(params: any): Promise<Hash>;
  setParameters(params: any): Promise<ArcTransactionDataResult<Hash>>;
  getSchemeParameters(avatarAddress: Address): Promise<any>;
  getParametersArray(paramsHash: Hash): Promise<Array<any>>;
}

/**
 * The minimum requirements for a voting machine wrapper.
 */
export interface IVotingMachineWrapper extends IContractWrapper {
  getParameters(paramsHash: Hash): Promise<any>;
  getParametersHash(params: any): Promise<Hash>;
  setParameters(params: any): Promise<ArcTransactionDataResult<Hash>>;
  getParametersArray(paramsHash: Hash): Promise<Array<any>>;
}

export interface IContractWrapperFactory<TWrapper extends IContractWrapper> {
  new: (...rest: Array<any>) => Promise<TWrapper>;
  at: (address: string) => Promise<TWrapper>;
  deployed: () => Promise<TWrapper>;
  ensureSolidityContract(): Promise<any>;
}

export class ArcTransactionResult {

  constructor(
    /**
     * The transaction hash
     */
    public tx: Hash,
    /**
     *  the Truffle contract wrapper
     */
    private contract: string | object) {
  }

  /**
   * Returns a promise of the transaction if it is mined,
   * converted to a TransactionReceiptTruffle (with readable logs).
   *
   * Returns null if the transaciton is not yet mined.
   */
  public async getTxMined(): Promise<TransactionReceiptTruffle | null> {
    if (!this.tx) {
      return null;
    }
    return TransactionService.getMinedTransaction(
      this.tx,
      this.contract) as Promise<TransactionReceiptTruffle | null>;
  }

  /**
   * Returns a promise of the transaction if it is confirmed,
   * converted to a TransactionReceiptTruffle (with readable logs).
   *
   * Returns null if the transaction is not yet found at the required depth.
   *
   * @param requiredDepth Optional minimum block depth required to resolve the promise.
   * Default comes from the `ConfigService`.
   */
  public async getTxConfirmed(requiredDepth?: number): Promise<TransactionReceiptTruffle | null> {
    if (!this.tx) {
      return null;
    }
    return TransactionService.getConfirmedTransaction(
      this.tx,
      this.contract,
      requiredDepth) as Promise<TransactionReceiptTruffle | null>;
  }

  /**
   * Returns promise of a mined transaction once it has been mined,
   * converted to a TransactionReceiptTruffle (with readable logs).
   */
  public async watchForTxMined(): Promise<TransactionReceiptTruffle> {
    if (!this.tx) {
      return null;
    }
    return TransactionService.watchForMinedTransaction(
      this.tx,
      this.contract) as Promise<TransactionReceiptTruffle | null>;
  }

  /**
   * Returns a promise of a TransactionReceipt once the given transaction has been confirmed,
   * converted to a TransactionReceiptTruffle (with readable logs),
   * according to the optional `requiredDepth`.
   *
   * @param requiredDepth Optional minimum block depth required to resolve the promise.
   * Default comes from the `ConfigService`.
   */
  public async watchForTxConfirmed(requiredDepth?: number): Promise<TransactionReceiptTruffle> {
    if (!this.tx) {
      return null;
    }
    return TransactionService.watchForConfirmedTransaction(this.tx,
      this.contract,
      requiredDepth) as Promise<TransactionReceiptTruffle | null>;
  }

  /**
   * Returns promise of a value from the logs of the mined transaction. Will watch for the mined tx,
   * so could take a while to return.
   * @param valueName - The name of the property whose value we wish to return
   * @param eventName - Name of the event in whose log we are to look for the value
   * @param index - Index of the log in which to look for the value, when eventName is not given.
   * Default is the index of the last log in the transaction.
   */
  public async getValueFromMinedTx(
    valueName: string,
    eventName: string = null, index: number = 0): Promise<any | undefined> {
    if (!this.tx) {
      return null;
    }
    const txMined = await this.watchForTxMined();
    return TransactionService.getValueFromLogs(txMined, valueName, eventName, index);
  }
}
/**
 * Base or actual type returned by all contract wrapper methods that generate a transaction and initiate a proposal.
 */
export class ArcTransactionProposalResult extends ArcTransactionResult {

  constructor(
    tx: Hash,
    contract: any,
    /**
     * The proposal's voting machine, as IntVoteInterface
     */
    public votingMachine: IIntVoteInterface) {
    super(tx, contract);
    this.votingMachine = votingMachine;
  }

  /**
   * Returns promise of the proposal id from the logs of the mined transaction. Will watch for the mined tx;
   * if it hasn't yet been mined, could take a while to return.
   */
  public async getProposalIdFromMinedTx(): Promise<Hash> {
    return this.getValueFromMinedTx("_proposalId");
  }
}

/**
 * Base or actual type returned by all contract wrapper methods that generate a transaction and any other result.
 */
export class ArcTransactionDataResult<TData> extends ArcTransactionResult {
  constructor(
    tx: Hash,
    contract: any,
    /**
     * Additional data being returned.
     */
    public result: TData) {
    super(tx, contract);
    this.result = result;
  }
}

/**
 * Common scheme parameters for schemes that are able to create proposals.
 */
export interface StandardSchemeParams {
  /**
   * Hash of the voting machine parameters to use when voting on a proposal.
   */
  voteParametersHash: Hash;
  /**
   * Address of the voting machine to use when voting on a proposal.
   */
  votingMachineAddress: Address;
}

export { DecodedLogEntryEvent, TransactionReceipt } from "web3";

/**
 * The value of the global config setting `gasPriceAdjustor`
 * This function will be invoked to obtain promise of a desired gas price
 * given the current default gas price which will be determined by the x latest blocks
 * median gas price.
 */
export type GasPriceAdjustor = (defaultGasPrice: BigNumber) => Promise<BigNumber | string>;
