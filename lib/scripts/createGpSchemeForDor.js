/* tslint:disable:no-var-requires */
const env = require("env-variable")();
const webConstructor = require("web3");
const Utils = require("../dist/../utils").Utils;
const UtilsInternal = require("../../dist/utilsInternal").UtilsInternal;
const promisify = require("es6-promisify").promisify;

let providerConfig;
let provider;

console.log(`providerConfig at: ${env.arcjs_providerConfig}`);
providerConfig = require(env.arcjs_providerConfig);

const HDWalletProvider = require("truffle-hdwallet-provider");
console.log(`Provider: '${providerConfig.providerUrl}'`);
console.log(`Account: '${providerConfig.mnemonic}'`);
provider = new HDWalletProvider(providerConfig.mnemonic, providerConfig.providerUrl);

const web3 = (<any>global).web3 = new webConstructor(provider);

console.log(`web3: ${web3}`);

const createGpUsingCustomGenAsStakingToken = async () => {

  const GetDefaultGenesisProtocolParameters = require("../wrappers/genesisProtocol").GetDefaultGenesisProtocolParameters;
  const defaultVotingMachineParams = await GetDefaultGenesisProtocolParameters();

  const GenesisProtocol = await Utils.requireContract("GenesisProtocol");
  const computeMaxGasLimit: any = require("../../gasLimits.js").computeMaxGasLimit;

  // token address of a test DAO created just for this.
  const genesisProtocolInst = await GenesisProtocol.new("0x240481418e44558cf9c4b87cd0497a34771749e7", { gas: await computeMaxGasLimit(web3) });
  console.log(`genesisProtocol address: ${genesisProtocolInst.address}`);

  const genesisProtocolParams = await genesisProtocolInst.getParametersHash(
    [
      defaultVotingMachineParams.preBoostedVoteRequiredPercentage,
      defaultVotingMachineParams.preBoostedVotePeriodLimit,
      defaultVotingMachineParams.boostedVotePeriodLimit,
      defaultVotingMachineParams.thresholdConstA,
      defaultVotingMachineParams.thresholdConstB,
      defaultVotingMachineParams.minimumStakingFee,
      defaultVotingMachineParams.quietEndingPeriod,
      defaultVotingMachineParams.proposingRepRewardConstA,
      defaultVotingMachineParams.proposingRepRewardConstB,
      defaultVotingMachineParams.stakerFeeRatioForVoters,
      defaultVotingMachineParams.votersReputationLossRatio,
      defaultVotingMachineParams.votersGainRepRatioFromLostRep,
      defaultVotingMachineParams.daoBountyConst,
      defaultVotingMachineParams.daoBountyLimit,
    ]
  );

  await genesisProtocolInst.setParameters(
    [
      defaultVotingMachineParams.preBoostedVoteRequiredPercentage,
      defaultVotingMachineParams.preBoostedVotePeriodLimit,
      defaultVotingMachineParams.boostedVotePeriodLimit,
      defaultVotingMachineParams.thresholdConstA,
      defaultVotingMachineParams.thresholdConstB,
      defaultVotingMachineParams.minimumStakingFee,
      defaultVotingMachineParams.quietEndingPeriod,
      defaultVotingMachineParams.proposingRepRewardConstA,
      defaultVotingMachineParams.proposingRepRewardConstB,
      defaultVotingMachineParams.stakerFeeRatioForVoters,
      defaultVotingMachineParams.votersReputationLossRatio,
      defaultVotingMachineParams.votersGainRepRatioFromLostRep,
      defaultVotingMachineParams.daoBountyConst,
      defaultVotingMachineParams.daoBountyLimit,
    ]
  );

  console.log(`genesisProtocol params hash: ${genesisProtocolParams}`);

}

createGpUsingCustomGenAsStakingToken().then(() => { process.exit(0) });
