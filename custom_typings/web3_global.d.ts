/// <reference types="../node_modules/@types/web3" />
/* tslint:disable-next-line:no-reference */
declare module "system" {
  import Web3 = require("web3");
  global {
    let web3: Web3;
    let accounts: Array<string>;
  }
}
