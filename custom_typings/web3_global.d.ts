/* tslint:disable-next-line:no-reference */
/// <reference path="./web3.d.ts" />
declare module "web3x" {
  import { Web3 } from "web3x";
  global {
    let web3: Web3;
    let accounts: Array<string>;
  }
}
