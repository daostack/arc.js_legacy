import { promisify } from "es6-promisify";
import { FilterResult } from "web3";
import { fnVoid } from "./commonTypes";
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
  public static async lastBlock(): Promise<number> {
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
}
