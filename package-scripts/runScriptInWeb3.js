const env = require("env-variable")();
const webConstructor = require("web3");
const Utils = require("../dist/utils").Utils;


let providerConfig;
let provider;

console.log(`providerConfig at: ${env.arcjs_providerConfig}`);
providerConfig = require(env.arcjs_providerConfig);

const HDWalletProvider = require("truffle-hdwallet-provider");
console.log(`Provider: '${providerConfig.providerUrl}'`);
console.log(`Account: '${providerConfig.mnemonic}'`);
provider = new HDWalletProvider(providerConfig.mnemonic, providerConfig.providerUrl);

const web3 = global.web3 = new webConstructor(provider);

// const mintTokens = async () => {
//   const DAOToken = await Utils.requireContract("DAOToken");
//   console.log(`got daotoken`);
//   // then we will create a new token to use for staking
//   const genToken = await DAOToken.at("0x240481418e44558cf9c4b87cd0497a34771749e7");
//   console.log(`got GEN token`);

//   console.log(`minting...`);
//   await genToken.mint("0xB38698D1Cf896AD6d3bbeF3E6eE6b90a78837a1f", web3.toWei(100000));
//   console.log(`done`);
// };


const getGpProposals = async () => {

  const gp = await (await Utils.requireContract("GenesisProtocol")).at("0x125b06f2df3774cf6dc35afa8ec2a783145d1c94");
  const eventFetcher = gp.NewProposal(
    {},
    { fromBlock: 0 });

  await eventFetcher.get((err, log) => {
    for (const event of log) {
      console.log(event);
    }
  });
}

getGpProposals().then(() => { process.exit(0) });
