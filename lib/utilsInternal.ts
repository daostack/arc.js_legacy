import { promisify } from "es6-promisify";
import { BlockHeader } from "web3/eth/types";
import { Address, fnVoid, Hash } from "./commonTypes";
import { Utils, Web3 } from "./utils";

/**
 * Utils not meant to be exported to the public
 */
export class UtilsInternal {

  static get NULL_ADDRESS(): Address { return "0x0000000000000000000000000000000000000000"; }
  static get NULL_HASH(): Hash { return "0x0000000000000000000000000000000000000000000000000000000000000000"; }
  static get SOME_HASH(): Hash { return "0x1000000000000000000000000000000000000000000000000000000000000000"; }
  static get SOME_ADDRESS(): Address { return "0x1000000000000000000000000000000000000000"; }

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
  public static async lastBlock(): Promise<BlockHeader> {
    const web3 = await Utils.getWeb3();
    return promisify((callback: any): any => web3.eth.getBlock("latest", callback))() as any;
  }

  /**
   * Returns the date of the last mined block in the chain.
   */
  public static async lastBlockDate(): Promise<Date> {
    const web3 = await Utils.getWeb3();
    const block = await promisify((callback: any): any =>
      web3.eth.getBlock("latest", callback))() as BlockHeader;
    return new Date(block.timestamp * 1000);
  }

  /**
   * Returns the last mined block in the chain.
   */
  public static async lastBlockNumber(): Promise<number> {
    const web3 = await Utils.getWeb3();
    return web3.eth.getBlockNumber();
  }

  /**
   * For environments that don't allow synchronous functions
   * @param filter
   */
  public static stopWatchingAsync(filter: EventWatcher): Promise<any> {
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

  /**
   * Returns promise of the maximum gasLimit that we dare to ever use, given the
   * current state of the chain.
   */
  public static async computeMaxGasLimit(): Promise<number> {
    const web3 = await Utils.getWeb3();
    return await web3.eth.getBlock("latest", false)
      .then((block: any) => {
        return block.gasLimit - 100000;
      });
  }
}

export interface EventWatcher {
  stopWatching(callback?: () => void): void;
}
