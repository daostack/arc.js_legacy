import { Utils } from "./utils";

/**
 * These are uninitialized instances of ExtendTruffleContract,
 * effectively class factories.
 */
import { AbsoluteVote } from "./contracts/absoluteVote.js";
import { ContributionReward } from "./contracts/contributionreward.js";
import { DaoCreator } from "./contracts/daocreator.js";
import { GlobalConstraintRegistrar } from "./contracts/globalconstraintregistrar.js";
import { SchemeRegistrar } from "./contracts/schemeregistrar.js";
import { TokenCapGC } from "./contracts/tokenCapGC.js";
import { UpgradeScheme } from "./contracts/upgradescheme.js";
import { VestingScheme } from "./contracts/vestingscheme.js";
import { VoteInOrganizationScheme } from "./contracts/voteInOrganizationScheme.js";

const UController = Utils.requireContract("UController");

export async function getDeployedContracts() {
  /**
   * These are deployed contract instances represented by their respective Arc
   * javascript wrappers (ExtendTruffleContract).
   *
   * `deployed()` is a static method on each of those classes.
   **/
  const absoluteVote = await AbsoluteVote.deployed();
  const contributionReward = await ContributionReward.deployed();
  const daoCreator = await DaoCreator.deployed();
  const globalConstraintRegistrar = await GlobalConstraintRegistrar.deployed();
  const schemeRegistrar = await SchemeRegistrar.deployed();
  const tokenCapGC = await TokenCapGC.deployed();
  const upgradeScheme = await UpgradeScheme.deployed();
  const uController = await UController.deployed();
  const vestingScheme = await VestingScheme.deployed();
  const voteInOrganizationScheme = await VoteInOrganizationScheme.deployed();

  /**
   * `contract` here is an uninitialized instance of ExtendTruffleContract,
   * basically the class factory.
   * Calling contract.at() (a static method on the class) will return a
   * the properly initialized instance of ExtendTruffleContract.
   */
  const contracts = {
    AbsoluteVote: {
      contract: AbsoluteVote,
      address: absoluteVote.address,
    },
    ContributionReward: {
      contract: ContributionReward,
      address: contributionReward.address,
    },
    DaoCreator: {
      contract: DaoCreator,
      address: daoCreator.address,
    },
    GlobalConstraintRegistrar: {
      contract: GlobalConstraintRegistrar,
      address: globalConstraintRegistrar.address,
    },
    SchemeRegistrar: {
      contract: SchemeRegistrar,
      address: schemeRegistrar.address,
    },
    TokenCapGC: {
      contract: TokenCapGC,
      address: tokenCapGC.address,
    },
    UpgradeScheme: {
      contract: UpgradeScheme,
      address: upgradeScheme.address,
    },
    UController: {
      contract: UController,
      address: uController.address,
    },
    VestingScheme: {
      contract: VestingScheme,
      address: vestingScheme.address,
    },
    VoteInOrganizationScheme: {
      contract: VoteInOrganizationScheme,
      address: voteInOrganizationScheme.address,
    }
  };

  return {
    allContracts: contracts,
    schemes: [
      contracts.SchemeRegistrar
      , contracts.UpgradeScheme
      , contracts.GlobalConstraintRegistrar
      , contracts.ContributionReward
      , contracts.VestingScheme
      , contracts.VoteInOrganizationScheme
    ],
    votingMachines: [
      contracts.AbsoluteVote
    ],
    globalConstraints: [
      contracts.TokenCapGC
    ]
  };
}
