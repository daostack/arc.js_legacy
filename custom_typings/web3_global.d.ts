/* tslint:disable-next-line:no-reference */
/// <reference path="./web3.d.ts" />
declare module "web3" {
  global {
    let web3: Web3;
    let accounts: Array<string>;
  }
}
