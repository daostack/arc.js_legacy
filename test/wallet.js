/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import * as ethers from 'ethers';

import { Wallet } from '../lib/wallet.js';
import * as helpers from './helpers';

describe('Wallet', () => {
  it('creates a new wallet on the blockchain', async function() {
    this.timeout(10000);
    const wallet = Wallet.new();
    assert.equal(wallet.getPublicAddress().length, 42);
    assert.equal(await wallet.getEtherBalance(), 0);
    assert.notEqual(wallet.getMnemonic().length, 0);
  });

  it('can be encrypted and decrypted', async function() {
    this.timeout(10000);
    const wallet = Wallet.new();
    console.log("Encrypt wallet");
    const encryptedJSON = await wallet.encrypt("Passw0rd", (progress) => { process.stdout.write("."); });
    console.log("\n");
    console.log("Decrypting wallet");
    const wallet2 = await Wallet.fromEncrypted(encryptedJSON, "Passw0rd", (progress) => { process.stdout.write(","); });
    assert.equal(wallet.getPublicAddress(), wallet2.getPublicAddress());
  });

  it('can be recovered from a mnemonic', function() {
    this.timeout(10000);
    const wallet = Wallet.new();
    const mnemonic = wallet.getMnemonic();
    const wallet2 = Wallet.fromMnemonic(mnemonic);
    assert.equal(wallet.wallet.privateKey, wallet2.wallet.privateKey);
  });

  it('can send and receive ether', async function() {
    this.timeout(10000);
    const wallet = Wallet.new();
    await web3.eth.sendTransaction({to: wallet.getPublicAddress(), from: accounts[0], value: web3.toWei(100, "ether")});
    let balance = await wallet.getEtherBalance();
    assert.equal(balance, 100.0);

    const toBalanceBefore = await web3.eth.getBalance(accounts[2]);
    await wallet.sendEther(accounts[2], 10);
    balance = await wallet.getEtherBalance();
    assert.equal(balance, 89.99958);
    const toBalanceAfter = await web3.eth.getBalance(accounts[2]);
    assert(toBalanceAfter.equals(toBalanceBefore.plus(web3.toWei(10, "ether"))));
  });

  it('can send and receive org tokens', async function() {
    this.timeout(10000);

    // TODO: easier way to get the private key from the testrpc accounts?
    const wallet1 = Wallet.fromPrivateKey("0x0191ecbd1b150b8a3c27c27010ba51b45521689611e669109e034fd66ae69621");
    const wallet2 = Wallet.fromPrivateKey("0x00f360233e89c65970a41d4a85990ec6669526b2230e867c352130151453180d");

    const orgOptions = {
      founders: [
        {
          address: wallet1.getPublicAddress(),
          tokens: 100,
          reputation: 100
        },
        {
          address: wallet2.getPublicAddress(),
          tokens: 100,
          reputation: 100
        },
      ]
    };
    const org = await helpers.forgeOrganization(orgOptions);
    assert.equal(await wallet1.getOrgTokenBalance(org.avatar.address), 100);

    await wallet1.sendOrgTokens(org.avatar.address, wallet2.getPublicAddress(), 10);
    assert.equal(await wallet1.getOrgTokenBalance(org.avatar.address), 90);
    assert.equal(await wallet2.getOrgTokenBalance(org.avatar.address), 110);
  });

});