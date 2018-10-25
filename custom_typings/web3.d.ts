/* tslint:disable-next-line:no-reference */
/// <reference path="../node_modules/@types/web3/index.d.ts" />

declare module "web3x" {

  import { Web3 as Web3Base } from "web3";
  import { Eth as EthBase } from "web3/eth";
  import { Utils as UtilsBase, Unit } from "web3/utils";
  import BigNumber = require("bn.js");
  import { Callback } from "web3/types";
  import { BlockType } from "web3/eth/types";

  export interface Utils extends UtilsBase {
    fromWei(val: BigNumber, unit?: Unit): BigNumber;
    fromWei(val: string | number, unit?: Unit): string;
  }

  type EthBaseX = { [K in Exclude<keyof EthBase, "getBalance">]: EthBase[K] }

  export interface Eth extends EthBaseX {
    getBalance(
      address: string,
      defaultBlock?: BlockType,
      cb?: Callback<string>
    ): Promise<string>;
  }

  type Web3BaseX = { [K in Exclude<keyof Web3Base, "eth">]: Web3Base[K] }

  // this will force web3.utils to use our interface defined above,
  // while also extending the rest of the original class Web3
  export class Web3 extends Web3Base {
    utils: Utils;
  }
}
