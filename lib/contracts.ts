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
import { ContractWrapperBase } from "./contractWrapperBase";

/*******************************
 * Arc contract information as contained in ArcDeployedContractNames
 */
export interface ArcContractInfo {
  /**
   * ContractWrapperFactory that has static methods that return the contract wrapper.
   */
  contract: any;
  /**
   * address of the instance deployed by Arc.
   * Calling contract.at() (a static method on ContractWrapperFactory) will return
   * the fully hydrated instance of the wrapper class.
   */
  address: string;
}

/**
 * An object with property names being a contract key and property value as the
 * corresponding ArcContractInfo.  Includes the set of contracts that have wrappers in Arc.js.
 */
export interface ArcDeployedContractNames {
  AbsoluteVote: ArcContractInfo;
  ContributionReward: ArcContractInfo;
  DaoCreator: ArcContractInfo;
  GenesisProtocol: ArcContractInfo;
  GlobalConstraintRegistrar: ArcContractInfo;
  SchemeRegistrar: ArcContractInfo;
  TokenCapGC: ArcContractInfo;
  UpgradeScheme: ArcContractInfo;
  VestingScheme: ArcContractInfo;
  VoteInOrganizationScheme: ArcContractInfo;
}

/**
 * ArcDeployedContractNames, and those contracts organized by type.
 * Call it.at(it.address) to get contract wrapper
 */
export interface ArcDeployedContracts {
  /**
   * All wrapped contracts
   */
  allContracts: ArcDeployedContractNames;
  /**
   * All wrapped schemes
   */
  schemes: Array<ArcContractInfo>;
  /**
   * All wrapped voting machines
   */
  votingMachines: Array<ArcContractInfo>;
  /**
   * All wrapped global constraints
   */
  globalConstraints: Array<ArcContractInfo>;
}

export class Contracts {

  public static contracts: ArcDeployedContracts;

  public static async getDeployedContracts(): Promise<ArcDeployedContracts> {

    if (!Contracts.contracts) {
      /**
       * These are the contract wrapper instances deployed by Arc.js.
       */
      const absoluteVote = await AbsoluteVote.deployed();
      const genesisProtocol = await GenesisProtocol.deployed();
      const contributionReward = await ContributionReward.deployed();
      const daoCreator = await DaoCreator.deployed();
      const globalConstraintRegistrar = await GlobalConstraintRegistrar.deployed();
      const schemeRegistrar = await SchemeRegistrar.deployed();
      const tokenCapGC = await TokenCapGC.deployed();
      const upgradeScheme = await UpgradeScheme.deployed();
      const vestingScheme = await VestingScheme.deployed();
      const voteInOrganizationScheme = await VoteInOrganizationScheme.deployed();

      /**
       * `contract` here is the ContractWrapperFactory
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
   * Returns an Arc.js contract wrapper or undefined if not found.
   * @param contract - name of an Arc contract, like "SchemeRegistrar"
   * @param address - optional
   */
  public static async getContractWrapper(contract: string, address?: string)
    : Promise<ContractWrapperBase | undefined> {
    const contracts = await Contracts.getDeployedContracts();
    const contractInfo = contracts.allContracts[contract];
    if (!contractInfo) {
      return undefined;
    }
    return contractInfo.contract.at(address ? address : contractInfo.address)
      .then((resultingContract: ContractWrapperBase) => resultingContract, () => undefined);
  }
}
