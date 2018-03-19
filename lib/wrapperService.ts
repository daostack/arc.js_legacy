import { ContractWrapperBase } from "./contractWrapperBase";
import { AbsoluteVote } from "./wrappers/absoluteVote.js";
import { ContributionReward } from "./wrappers/contributionreward.js";
import { DaoCreator } from "./wrappers/daocreator.js";
import { GenesisProtocol } from "./wrappers/genesisProtocol.js";
import { GlobalConstraintRegistrar } from "./wrappers/globalconstraintregistrar.js";
import { SchemeRegistrar } from "./wrappers/schemeregistrar.js";
import { TokenCapGC } from "./wrappers/tokenCapGC.js";
import { UpgradeScheme } from "./wrappers/upgradescheme.js";
import { VestingScheme } from "./wrappers/vestingscheme.js";
import { VoteInOrganizationScheme } from "./wrappers/voteInOrganizationScheme.js";

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

export class WrapperService {

  public static wrappers: ArcDeployedContracts;

  public static async getDeployedContracts(): Promise<ArcDeployedContracts> {

    if (!WrapperService.wrappers) {
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

      WrapperService.wrappers = {
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
    return WrapperService.wrappers;
  }

  /**
   * Returns an Arc.js contract wrapper or undefined if not found.
   * @param contract - name of an Arc contract, like "SchemeRegistrar"
   * @param address - optional
   */
  public static async getContractWrapper(contract: string, address?: string)
    : Promise<ContractWrapperBase | undefined> {
    const wrapperService = await WrapperService.getDeployedContracts();
    const contractInfo = wrapperService.allContracts[contract];
    if (!contractInfo) {
      return undefined;
    }
    return contractInfo.contract.at(address ? address : contractInfo.address)
      .then((resultingContract: ContractWrapperBase) => resultingContract, () => undefined);
  }
}
