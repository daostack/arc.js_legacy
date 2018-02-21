import { AbsoluteVote } from "./contracts/absoluteVote.js";
import { ContributionReward } from "./contracts/contributionreward.js";
import { DaoCreator } from "./contracts/daocreator.js";
import { GenesisProtocol } from "./contracts/genesisProtocol.js";
import { GlobalConstraintRegistrar } from "./contracts/globalconstraintregistrar.js";
import { SchemeRegistrar } from "./contracts/schemeregistrar.js";
import { TokenCapGC } from "./contracts/tokenCapGC.js";
import { UpgradeScheme } from "./contracts/upgradescheme.js";
import { VestingScheme } from "./contracts/vestingscheme.js";
import { VoteInOrganizationScheme } from "./contracts/voteInOrganizationScheme.js";
import { ExtendTruffleContract } from "./ExtendTruffleContract";
import { Utils } from "./utils";

const UController = Utils.requireContract("UController");

/*******************************
 * Arc contract information as contained in ArcDeployedContractNames
 */
export interface ArcContractInfo {
  /**
   * An uninitialized instance of ExtendTruffleContract,
   * basically the class factory with static methods.
   */
  contract: any;
  /**
   * address of the instance deployed by Arc.
   * Calling contract.at() (a static method on ExtendTruffleContract) will return a
   * the properly initialized instance of ExtendTruffleContract.
   */
  address: string;
}

/**
 * An object with property names being a contract key and property value as the corresponding ArcContractInfo.
 * For all deployed contracts exposed by Arc.
 */
export interface ArcDeployedContractNames {
  AbsoluteVote: ArcContractInfo;
  ContributionReward: ArcContractInfo;
  DaoCreator: ArcContractInfo;
  GenesisProtocol: ArcContractInfo;
  GlobalConstraintRegistrar: ArcContractInfo;
  SchemeRegistrar: ArcContractInfo;
  TokenCapGC: ArcContractInfo;
  UController: ArcContractInfo;
  UpgradeScheme: ArcContractInfo;
  VestingScheme: ArcContractInfo;
  VoteInOrganizationScheme: ArcContractInfo;
}

/**
 * ArcDeployedContractNames, and those contracts organized by type.
 * Call it.at(it.address) to get javascript wrapper
 */
export interface ArcDeployedContracts {
  allContracts: ArcDeployedContractNames;
  /**
   * All deployed schemes
   */
  schemes: ArcContractInfo[];
  /**
   * All deployed voting machines
   */
  votingMachines: ArcContractInfo[];
  /**
   * All deployed global constraints
   */
  globalConstraints: ArcContractInfo[];
}

export class Contracts {

  public static contracts: ArcDeployedContracts;

  public static async getDeployedContracts() {

    if (!Contracts.contracts) {
      /**
       * These are deployed contract instances represented by their respective Arc
       * javascript wrappers (ExtendTruffleContract).
       */
      const absoluteVote = await AbsoluteVote.deployed();
      const genesisProtocol = await GenesisProtocol.deployed();
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
       * `contract` here is effectively the class wrapper factory.
       * Calling contract.at() (a static method on the factory) will return a
       * fully hydrated instance of ExtendTruffleContract.
       */
      const contracts = {
        AbsoluteVote: {
          address: absoluteVote.contract.address,
          contract: AbsoluteVote,
        },
        ContributionReward: {
          address: contributionReward.contract.address,
          contract: ContributionReward,
        },
        DaoCreator: {
          address: daoCreator.contract.address,
          contract: DaoCreator,
        },
        GenesisProtocol: {
          address: genesisProtocol.contract.address,
          contract: GenesisProtocol,
        },
        GlobalConstraintRegistrar: {
          address: globalConstraintRegistrar.contract.address,
          contract: GlobalConstraintRegistrar,
        },
        SchemeRegistrar: {
          address: schemeRegistrar.contract.address,
          contract: SchemeRegistrar,
        },
        TokenCapGC: {
          address: tokenCapGC.contract.address,
          contract: TokenCapGC,
        },
        UController: {
          address: uController.address,
          contract: UController,
        },
        UpgradeScheme: {
          address: upgradeScheme.contract.address,
          contract: UpgradeScheme,
        },
        VestingScheme: {
          address: vestingScheme.contract.address,
          contract: VestingScheme,
        },
        VoteInOrganizationScheme: {
          address: voteInOrganizationScheme.contract.address,
          contract: VoteInOrganizationScheme,
        },
      };

      Contracts.contracts = {
        allContracts: contracts,
        globalConstraints: [
          contracts.TokenCapGC,
        ],
        schemes: [
          contracts.SchemeRegistrar,
          contracts.UpgradeScheme,
          contracts.GlobalConstraintRegistrar,
          contracts.ContributionReward,
          contracts.VestingScheme,
          contracts.VoteInOrganizationScheme,
          contracts.GenesisProtocol,
        ],
        votingMachines: [
          contracts.AbsoluteVote
          , contracts.GenesisProtocol,
        ],
      };
    }
    return Contracts.contracts;
  }

  /**
   * Returns an Arc.js scheme wrapper, or undefined if not found
   * @param contract - name of an Arc scheme, like "SchemeRegistrar"
   * @param address - optional
   */
  public static async getScheme(contract: string, address?: string): Promise<ExtendTruffleContract | undefined> {
    const contracts = await Contracts.getDeployedContracts();
    const contractInfo = contracts.allContracts[contract];
    if (!contractInfo) {
      return undefined;
    }
    return contractInfo.contract.at(address ? address : contractInfo.address)
      .then((resultingContract) => resultingContract, () => undefined);
  }
}
