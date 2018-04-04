"use strict";
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(((resolve, reject) => {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : new P(((resolve) => { resolve(result.value); })).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  }));
};
const __generator = (this && this.__generator) || function (thisArg, body) {
  let _ = { label: 0, sent: function() { if (t[0] & 1) {throw t[1];} return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) {throw new TypeError("Generator is already executing.");}
    while (_) {try {
      if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) {return t;}
      if (y = 0, t) {op = [0, t.value];}
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) {_.ops.pop();}
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }}
    if (op[0] & 5) {throw op[1];} return { value: op[0] ? op[1] : void 0, done: true };
  }
};
const _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
const configService_1 = require("../lib/configService");
const computeGasLimit = require("../gasLimits.js").computeGasLimit;
const commonTypes_1 = require("../lib/commonTypes");
/**
 * Migration callback
 */
module.exports = function (deployer) { return __awaiter(_this, void 0, void 0, function () {
  const _this = this;
  let network, founders, gasAmount, AbsoluteVote, Avatar, ContributionReward, DaoCreator, ExecutableTest, GlobalConstraintRegistrar, SchemeRegistrar, SimpleICO, TokenCapGC, UController, UpgradeScheme, VestingScheme, VoteInOrganizationScheme, GenesisProtocol, ControllerCreator, orgName, tokenName, tokenSymbol, orgNativeTokenFee, defaultVotingMachineParams, schemeRegistrarPermissions, globalConstraintRegistrarPermissions, upgradeSchemePermissions, contributionRewardPermissions, genesisProtocolPermissions;
  return __generator(this, (_a) => {
    network = configService_1.ConfigService.get("network") || "ganache";
    founders = require("./founders.json").founders[network];
    gasAmount = computeGasLimit(founders.length);
    /* eslint-disable no-console */
    console.log("Deploying to " + network + ", gasLimit: " + gasAmount + ",  " + founders.length + " founders");
    AbsoluteVote = artifacts.require("AbsoluteVote.sol");
    Avatar = artifacts.require("Avatar.sol");
    ContributionReward = artifacts.require("ContributionReward.sol");
    DaoCreator = artifacts.require("DaoCreator.sol");
    ExecutableTest = artifacts.require("ExecutableTest.sol");
    GlobalConstraintRegistrar = artifacts.require("GlobalConstraintRegistrar.sol");
    SchemeRegistrar = artifacts.require("SchemeRegistrar.sol");
    SimpleICO = artifacts.require("SimpleICO.sol");
    TokenCapGC = artifacts.require("TokenCapGC.sol");
    UController = artifacts.require("UController.sol");
    UpgradeScheme = artifacts.require("UpgradeScheme.sol");
    VestingScheme = artifacts.require("VestingScheme.sol");
    VoteInOrganizationScheme = artifacts.require("VoteInOrganizationScheme.sol");
    GenesisProtocol = artifacts.require("GenesisProtocol.sol");
    ControllerCreator = artifacts.require("ControllerCreator.sol");
    orgName = "Genesis";
    tokenName = "Gen";
    tokenSymbol = "GEN";
    orgNativeTokenFee = 0;
    defaultVotingMachineParams = {
      preBoostedVoteRequiredPercentage: 50,
      preBoostedVotePeriodLimit: 5184000,
      boostedVotePeriodLimit: 604800,
      thresholdConstA: web3.toWei(2),
      thresholdConstB: 10,
      minimumStakingFee: 0,
      quietEndingPeriod: 7200,
      proposingRepRewardConstA: web3.toWei(5),
      proposingRepRewardConstB: web3.toWei(5),
      stakerFeeRatioForVoters: 1,
      votersReputationLossRatio: 1,
      votersGainRepRatioFromLostRep: 80 // percentage of how much rep correct voters get from incorrect voters who lost rep
    };
    schemeRegistrarPermissions = commonTypes_1.SchemePermissions.toString(commonTypes_1.DefaultSchemePermissions.SchemeRegistrar);
    globalConstraintRegistrarPermissions = commonTypes_1.SchemePermissions.toString(commonTypes_1.DefaultSchemePermissions.GlobalConstraintRegistrar);
    upgradeSchemePermissions = commonTypes_1.SchemePermissions.toString(commonTypes_1.DefaultSchemePermissions.UpgradeScheme);
    contributionRewardPermissions = commonTypes_1.SchemePermissions.toString(commonTypes_1.DefaultSchemePermissions.ContributionReward);
    genesisProtocolPermissions = commonTypes_1.SchemePermissions.toString(commonTypes_1.DefaultSchemePermissions.GenesisProtocol);
    console.log("******* schemeRegistrarPermissions: " + schemeRegistrarPermissions);
    /**
         * Apparently we must wrap the first deploy call in a `then` to avoid
         * what seems to be race conditions during deployment.
         */
    deployer.deploy(ControllerCreator).then(() => { return __awaiter(_this, void 0, void 0, function () {
      let controllerCreator, daoCreatorInst, universalControllerInst, tx, AvatarInst, nativeTokenAddress, genesisProtocolInst, schemeRegistrarInst, upgradeSchemeInst, globalConstraintRegistrarInst, contributionRewardInst, genesisProtocolParams, schemeRegisterParams, schemeGCRegisterParams, schemeUpgradeParams, contributionRewardParams, schemesArray, paramsArray, permissionArray;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0: return [4 /*yield*/, ControllerCreator.deployed()];
          case 1:
            controllerCreator = _a.sent();
            return [4 /*yield*/, deployer.deploy(DaoCreator, controllerCreator.address)];
          case 2:
            _a.sent();
            return [4 /*yield*/, DaoCreator.deployed(controllerCreator.address)];
          case 3:
            daoCreatorInst = _a.sent();
            return [4 /*yield*/, deployer.deploy(UController, { gas: gasAmount })];
          case 4:
            _a.sent();
            return [4 /*yield*/, UController.deployed()];
          case 5:
            universalControllerInst = _a.sent();
            return [4 /*yield*/, daoCreatorInst.forgeOrg(orgName, tokenName, tokenSymbol, founders.map((f) => { return f.address; }), founders.map((f) => { return web3.toWei(f.tokens); }), founders.map((f) => { return web3.toWei(f.reputation); }), universalControllerInst.address, web3.toWei(100000000), // token cap of one hundred million GEN, in Wei
              { gas: gasAmount })];
          case 6:
            tx = _a.sent();
            return [4 /*yield*/, Avatar.at(tx.logs[0].args._avatar)];
          case 7:
            AvatarInst = _a.sent();
            return [4 /*yield*/, AvatarInst.nativeToken()];
          case 8:
            nativeTokenAddress = _a.sent();
            /**
                         * The voting machine.  GenesisProtocol must be deployed as a scheme if it is
                         * to be used by schemes as a voting machine, which is what all of the
                         * Genesis schemes do.
                         */
            return [4 /*yield*/, deployer.deploy(GenesisProtocol, nativeTokenAddress)];
          case 9:
            /**
                         * The voting machine.  GenesisProtocol must be deployed as a scheme if it is
                         * to be used by schemes as a voting machine, which is what all of the
                         * Genesis schemes do.
                         */
            _a.sent();
            return [4 /*yield*/, GenesisProtocol.deployed()];
          case 10:
            genesisProtocolInst = _a.sent();
            /**
                         * The rest of the Genesis DAO's schemes
                         */
            return [4 /*yield*/, deployer.deploy(SchemeRegistrar)];
          case 11:
            /**
                         * The rest of the Genesis DAO's schemes
                         */
            _a.sent();
            return [4 /*yield*/, SchemeRegistrar.deployed()];
          case 12:
            schemeRegistrarInst = _a.sent();
            return [4 /*yield*/, deployer.deploy(UpgradeScheme)];
          case 13:
            _a.sent();
            return [4 /*yield*/, UpgradeScheme.deployed()];
          case 14:
            upgradeSchemeInst = _a.sent();
            return [4 /*yield*/, deployer.deploy(GlobalConstraintRegistrar)];
          case 15:
            _a.sent();
            return [4 /*yield*/, GlobalConstraintRegistrar.deployed()];
          case 16:
            globalConstraintRegistrarInst = _a.sent();
            return [4 /*yield*/, deployer.deploy(ContributionReward)];
          case 17:
            _a.sent();
            return [4 /*yield*/, ContributionReward.deployed()];
          case 18:
            contributionRewardInst = _a.sent();
            return [4 /*yield*/, genesisProtocolInst.getParametersHash([
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
              defaultVotingMachineParams.votersGainRepRatioFromLostRep
            ])];
          case 19:
            genesisProtocolParams = _a.sent();
            return [4 /*yield*/, genesisProtocolInst.setParameters([
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
              defaultVotingMachineParams.votersGainRepRatioFromLostRep
            ])];
          case 20:
            _a.sent();
            /**
                         * Set/get the Genesis DAO's scheme parameters, using the GenesisProtocol voting machine
                         * parameters that we just obtained above.
                         */
            return [4 /*yield*/, schemeRegistrarInst.setParameters(genesisProtocolParams, genesisProtocolParams, genesisProtocolInst.address)];
          case 21:
            /**
                         * Set/get the Genesis DAO's scheme parameters, using the GenesisProtocol voting machine
                         * parameters that we just obtained above.
                         */
            _a.sent();
            return [4 /*yield*/, schemeRegistrarInst.getParametersHash(genesisProtocolParams, genesisProtocolParams, genesisProtocolInst.address)];
          case 22:
            schemeRegisterParams = _a.sent();
            return [4 /*yield*/, globalConstraintRegistrarInst.setParameters(genesisProtocolParams, genesisProtocolInst.address)];
          case 23:
            _a.sent();
            return [4 /*yield*/, globalConstraintRegistrarInst.getParametersHash(genesisProtocolParams, genesisProtocolInst.address)];
          case 24:
            schemeGCRegisterParams = _a.sent();
            return [4 /*yield*/, upgradeSchemeInst.setParameters(genesisProtocolParams, genesisProtocolInst.address)];
          case 25:
            _a.sent();
            return [4 /*yield*/, upgradeSchemeInst.getParametersHash(genesisProtocolParams, genesisProtocolInst.address)];
          case 26:
            schemeUpgradeParams = _a.sent();
            return [4 /*yield*/, contributionRewardInst.setParameters(orgNativeTokenFee, genesisProtocolParams, genesisProtocolInst.address)];
          case 27:
            _a.sent();
            return [4 /*yield*/, contributionRewardInst.getParametersHash(orgNativeTokenFee, genesisProtocolParams, genesisProtocolInst.address)];
          case 28:
            contributionRewardParams = _a.sent();
            schemesArray = [
              schemeRegistrarInst.address,
              globalConstraintRegistrarInst.address,
              upgradeSchemeInst.address,
              contributionRewardInst.address,
              genesisProtocolInst.address
            ];
            paramsArray = [
              schemeRegisterParams,
              schemeGCRegisterParams,
              schemeUpgradeParams,
              contributionRewardParams,
              genesisProtocolParams
            ];
            permissionArray = [
              schemeRegistrarPermissions,
              globalConstraintRegistrarPermissions,
              upgradeSchemePermissions,
              contributionRewardPermissions,
              genesisProtocolPermissions
            ];
            return [4 /*yield*/, daoCreatorInst.setSchemes(AvatarInst.address, schemesArray, paramsArray, permissionArray)];
          case 29:
            _a.sent();
            /**
                         * Deploy the other universal schemes, voting machines and global constraints
                         */
            return [4 /*yield*/, deployer.deploy(AbsoluteVote)];
          case 30:
            /**
                         * Deploy the other universal schemes, voting machines and global constraints
                         */
            _a.sent();
            return [4 /*yield*/, deployer.deploy(SimpleICO)];
          case 31:
            _a.sent();
            return [4 /*yield*/, deployer.deploy(TokenCapGC)];
          case 32:
            _a.sent();
            return [4 /*yield*/, deployer.deploy(VestingScheme)];
          case 33:
            _a.sent();
            return [4 /*yield*/, deployer.deploy(VoteInOrganizationScheme)];
          case 34:
            _a.sent();
            return [4 /*yield*/, deployer.deploy(ExecutableTest)];
          case 35:
            _a.sent();
            return [2 /*return*/];
        }
      });
    }); });
    return [2 /*return*/];
  });
}); };
