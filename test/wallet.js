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
    await web3.eth.sendTransaction({to: wallet.getPublicAddress(), from: accounts[0], value: web3.toWei(2, "ether")});
    let balance = await wallet.getEtherBalance();
    assert.equal(balance, 2.0);

    const toBalanceBefore = await web3.eth.getBalance(accounts[2]);
    await wallet.sendEther(accounts[2], 1);
    balance = await wallet.getEtherBalance();
    assert.equal(balance, 0.99958);
    const toBalanceAfter = await web3.eth.getBalance(accounts[2]);
    assert(toBalanceAfter.equals(toBalanceBefore.plus(web3.toWei(1, "ether"))));
  });

  it('can send and receive org tokens', async function() {
    this.timeout(10000);

    // TODO: easier way to get the private key from the testrpc accounts?
    const wallet1 = Wallet.fromPrivateKey("0x8d4408014d165ec69d8cc9f091d8f4578ac5564f376f21887e98a6d33a6e3549");
    const wallet2 = Wallet.fromPrivateKey("0x2215f0a41dd3bb93f03049514949aaafcf136e6965f4a066d6bf42cc9f75a106");

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