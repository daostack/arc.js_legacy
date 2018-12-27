import { promisify } from "es6-promisify";
import { BlockWithoutTransactionData, FilterResult } from "web3";
import { Address, fnVoid, Hash } from "./commonTypes";
import { Utils, Web3 } from "./utils";

/**
 * Utils not meant to be exported to the public
 */
export class UtilsInternal {

  public static sleep(milliseconds: number): Promise<any> {
    return new Promise((resolve: fnVoid): any => setTimeout(resolve, milliseconds));
  }

  public static ensureArray<T>(arr: Array<T> | T): Array<T> {
    if (!Array.isArray(arr)) {
      arr = [arr];
    }
    return arr;
  }

  /**
   * Returns the last mined block in the chain.
   */
  public static async lastBlock(): Promise<BlockWithoutTransactionData> {
    const web3 = await Utils.getWeb3();
    return promisify((callback: any): any => web3.eth.getBlock("latest", callback))() as any;
  }

  /**
   * Returns the date of the last mined block in the chain.
   */
  public static async lastBlockDate(): Promise<Date> {
    const web3 = await Utils.getWeb3();
    let block;
    do {
      block = await promisify((callback: any): any =>
        web3.eth.getBlock("latest", callback))() as BlockWithoutTransactionData;
    }
    while (!block);

    return new Date(block.timestamp * 1000);
  }

  /**
   * Returns the last mined block in the chain.
   */
  public static async lastBlockNumber(): Promise<number> {
    const web3 = await Utils.getWeb3();
    return promisify(web3.eth.getBlockNumber)();
  }

  /**
   * For environments that don't allow synchronous functions
   * @param filter
   */
  public static stopWatchingAsync(filter: FilterResult): Promise<any> {
    return promisify((callback: any): any => filter.stopWatching(callback))();
  }

  public static getRandomNumber(): number {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  public static getWeb3Sync(): Web3 {
    return (Utils as any).web3;
  }

  public static isNullAddress(address: Address): boolean {
    return !address || !Number.parseInt(address, 16);
  }

  public static isNullHash(hash: Hash): boolean {
    return !hash || !Number.parseInt(hash, 16);
  }

  /**
   * Returns promise of the maximum gasLimit that we dare to ever use, given the
   * current state of the chain.
   */
  public static async computeMaxGasLimit(): Promise<number> {
    const web3 = await Utils.getWeb3();
    return promisify((callback: any) => web3.eth.getBlock("latest", false, callback))()
      .then((block: any) => {
        return block.gasLimit - 100000;
      });
  }
}
