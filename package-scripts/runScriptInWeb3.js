const env = require("env-variable")();
const webConstructor = require("web3");
const Utils = require("../dist/utils").Utils;
const UtilsInternal = require("../dist/utilsInternal").UtilsInternal;
const promisify = require("es6-promisify").promisify;

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


// const getGpProposals = async () => {

//   const gp = await (await Utils.requireContract("GenesisProtocol")).at("0x125b06f2df3774cf6dc35afa8ec2a783145d1c94");
//   const eventFetcher = gp.NewProposal(
//     {},
//     { fromBlock: 0 });

//   await eventFetcher.get((err, log) => {
//     for (const event of log) {
//       console.log(event);
//     }
//   });
// }

const payPilotParticipants = async () => {

  const DAOToken = await Utils.requireContract("DAOToken");

  // const participants_GEN = [
  //   "0xEbEc8c75c489Ab7FAB3e20ea556a2cf7E0da9B4B",
  //   "0x03C95f9A8242D87D0Fb546A54F23Fe5849F581D5",
  //   "0x49db499e1555380E0Ad02a463CC557087851017F",
  //   "0xB5e407a8e9dfD7dDf2371ae465e3E1D4886418E0",
  //   "0x5928675ad8f2a5ec995d4787829892cb6df4a65b",
  //   "0x7e1a1C5D94E703374699DBF732F97bCdb85b68EF",
  //   "0x4171160dB0e7E2C75A4973b7523B437C010Dd9d4",
  //   "0x7f1d234e281ff8421b2b0650a9b8f85b5d73bd59",
  //   "0xd47cdbb2085975e761ca2b16f4916a94dd984377",
  //   "0x155C176fED833371f7FA02EcF62DAa9FD9C7c5F4",
  //   "0xc2536854fd70e80b57de8372146fc3ca04dde94d",
  //   "0x961d17419736d517754d886aaAcc874711A3ff32",
  //   "0x144c4E5027B69f7798B2B162D924BcAE5c149f15",
  //   "0x0FE3Bb74d170095242b234106A2640B9F537987D",
  //   "0xCb701EDe8E50395833C24401F5aBd9C5681928A0",
  //   "0xEFA21088F3830cD7d9f526eA268f7AabA34F785F",
  //   "0x379383e2d3AB8ce362cffBdD6F13D81213475786",
  //   "0xA75cB02c290E586b010888bd795f0BEB01E1B6a2",
  //   "0x435CD42591cC503a909085c3d3d2899d17032F77",
  //   "0x0017cd246be69d243657400685B3C17c545bfd0F",
  //   "0x7f5731762F2A1DD3224d7f4EbdB289A5c0C8543D",
  //   "0xe7b81Ae742Fdc4Cac5F6280aa91Bc28D6df34a89",
  //   "0xDFD546894bbd4C28572dd66D48D46Ce45Efdf71c",
  //   "0x6ac0A885Ed84F4A2D062c60FB7DaaF504Fc8C47f",
  //   "0x7345E5285b2F5eb9383a484477cFB35c5f512905",
  //   "0xB1BA56Fc6ED94d45CA47CC9E97dF68f3dF772d42",
  //   "0x64EB4dfcC14B96582D8D5095e9894b279E519b4B",
  //   "0xB38698D1Cf896AD6d3bbeF3E6eE6b90a78837a1f",
  //   "0x900d38bf3ae3e72f98f377111a9e9e1413974db4",
  //   "0x346173fA66f95BFA53d4222C09321279365B8A85",
  //   "0x73Db6408abbea97C5DB8A2234C4027C315094936",
  //   "0x0084fb1d84f2359cafd00f92b901c121521d6809",
  //   "0x69019F5DC1F6BDfB7CFAf06A1ca59EbCDFD141F4",
  //   "0x05f468Df35bB2Fb0D98c15A83Ba340d11742A219",
  //   "0x7539A96097e5214DA7336be510cDDD415339949e",
  //   "0x7DA25442a58beD5369C980D785D24284bB5D26Ee",
  //   "0xF16294a979a027F297DAcE2F618Cb57bc4Bf5d16"
  // ];

  const participants_ETH = [
    //"0xEbEc8c75c489Ab7FAB3e20ea556a2cf7E0da9B4B",
    //"0x03C95f9A8242D87D0Fb546A54F23Fe5849F581D5",
    //"0x49db499e1555380E0Ad02a463CC557087851017F",
    //"0xB5e407a8e9dfD7dDf2371ae465e3E1D4886418E0",
    //"0x5928675ad8f2a5ec995d4787829892cb6df4a65b",
    //"0x7e1a1C5D94E703374699DBF732F97bCdb85b68EF",
    //"0x4171160dB0e7E2C75A4973b7523B437C010Dd9d4",
    //"0x7f1d234e281ff8421b2b0650a9b8f85b5d73bd59",
    //"0xd47cdbb2085975e761ca2b16f4916a94dd984377",
    //"0x155C176fED833371f7FA02EcF62DAa9FD9C7c5F4",
    //"0xc2536854fd70e80b57de8372146fc3ca04dde94d",
    //"0x961d17419736d517754d886aaAcc874711A3ff32",
    //"0x144c4E5027B69f7798B2B162D924BcAE5c149f15",
    //"0x0FE3Bb74d170095242b234106A2640B9F537987D",
    //"0xCb701EDe8E50395833C24401F5aBd9C5681928A0",
    //"0xEFA21088F3830cD7d9f526eA268f7AabA34F785F",
    //"0x379383e2d3AB8ce362cffBdD6F13D81213475786",
    //"0xA75cB02c290E586b010888bd795f0BEB01E1B6a2",
    //"0x435CD42591cC503a909085c3d3d2899d17032F77",
    //"0x0017cd246be69d243657400685B3C17c545bfd0F",
    //"0x7f5731762F2A1DD3224d7f4EbdB289A5c0C8543D",
    //"0xe7b81Ae742Fdc4Cac5F6280aa91Bc28D6df34a89",
    //"0xDFD546894bbd4C28572dd66D48D46Ce45Efdf71c",
    //"0x6ac0A885Ed84F4A2D062c60FB7DaaF504Fc8C47f",
    //"0x7345E5285b2F5eb9383a484477cFB35c5f512905",
    //"0xB1BA56Fc6ED94d45CA47CC9E97dF68f3dF772d42",
    //"0x64EB4dfcC14B96582D8D5095e9894b279E519b4B",
    //"0xB38698D1Cf896AD6d3bbeF3E6eE6b90a78837a1f",
    //"0x900d38bf3ae3e72f98f377111a9e9e1413974db4",
    //"0x346173fA66f95BFA53d4222C09321279365B8A85",
    //"0x73Db6408abbea97C5DB8A2234C4027C315094936",
    //"0x0084fb1d84f2359cafd00f92b901c121521d6809",
    //"0x69019F5DC1F6BDfB7CFAf06A1ca59EbCDFD141F4",
    //"0x05f468Df35bB2Fb0D98c15A83Ba340d11742A219",
    //"0x7539A96097e5214DA7336be510cDDD415339949e",
    //"0x7DA25442a58beD5369C980D785D24284bB5D26Ee",
    //"0xF16294a979a027F297DAcE2F618Cb57bc4Bf5d16"
  ];

  // const genToken = await DAOToken.at("0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf");

  // console.log(`got GEN token`);

  for (let i = 0; i < participants_ETH.length; i++) {
    // console.log(`sending to ${p}`);
    let p = participants_ETH[i];

    // console.log(`transferring GENs to ${p}...`);
    // await genToken.transfer(p, web3.toWei(10), { gas: 52538, gasPrice: 3000000000 })
    //   .then(() => {
    //     console.log("Successful transfer");
    //   })
    //   .catch((err) => {
    //     console.log(`failed transfer: ${err.message}`);
    //   });

    await promisify((callback) => {
      console.log(`transferring ETH to ${p}...`);
      web3.eth.sendTransaction({ to: p, value: web3.toWei(.1), gas: 52538, gasPrice: 3000000000 }, callback)
    })()
      .then(() => {
        console.log("Successful transfer");
      })
      .catch((err) => {
        console.log(`failed transfer: ${err.message}`);
      });
    ;

    // seems to avoid the error "Transaction gas price is too low. There is another transaction with same nonce in the queue. Try increasing the gas price or incrementing the nonce"
    console.log(`sleeping...`);
    await UtilsInternal.sleep(30000);
  }
  process.exit(0);
}

payPilotParticipants().then(() => { process.exit(0) });
