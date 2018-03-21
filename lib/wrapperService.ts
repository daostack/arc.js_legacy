import { ContractWrapperBase } from "./contractWrapperBase";
import ContractWrapperFactory from "./contractWrapperFactory.js";
import { LoggingService } from "./loggingService";
import { AbsoluteVote, AbsoluteVoteWrapper } from "./wrappers/absoluteVote.js";
import { ContributionReward, ContributionRewardWrapper } from "./wrappers/contributionreward.js";
import { DaoCreator, DaoCreatorWrapper } from "./wrappers/daocreator.js";
import { GenesisProtocol, GenesisProtocolWrapper } from "./wrappers/genesisProtocol.js";
import { GlobalConstraintRegistrar, GlobalConstraintRegistrarWrapper } from "./wrappers/globalconstraintregistrar.js";
import { SchemeRegistrar, SchemeRegistrarWrapper } from "./wrappers/schemeregistrar.js";
import { TokenCapGC, TokenCapGCWrapper } from "./wrappers/tokenCapGC.js";
import { UpgradeScheme, UpgradeSchemeWrapper } from "./wrappers/upgradescheme.js";
import { VestingScheme, VestingSchemeWrapper } from "./wrappers/vestingscheme.js";
import { VoteInOrganizationScheme, VoteInOrganizationSchemeWrapper } from "./wrappers/voteInOrganizationScheme.js";

/**
 * An object with property names being a contract key and property value as the
 * corresponding wrapper factory (ContractWrapperFactory<TWrapper).
 */
export interface ArcWrapperFactories {
  AbsoluteVote: ContractWrapperFactory<AbsoluteVoteWrapper>;
  ContributionReward: ContractWrapperFactory<ContributionRewardWrapper>;
  DaoCreator: ContractWrapperFactory<DaoCreatorWrapper>;
  GenesisProtocol: ContractWrapperFactory<GenesisProtocolWrapper>;
  GlobalConstraintRegistrar: ContractWrapperFactory<GlobalConstraintRegistrarWrapper>;
  SchemeRegistrar: ContractWrapperFactory<SchemeRegistrarWrapper>;
  TokenCapGC: ContractWrapperFactory<TokenCapGCWrapper>;
  UpgradeScheme: ContractWrapperFactory<UpgradeSchemeWrapper>;
  VestingScheme: ContractWrapperFactory<VestingSchemeWrapper>;
  VoteInOrganizationScheme: ContractWrapperFactory<VoteInOrganizationSchemeWrapper>;
}

/**
 * An object with property names being a contract key and property value as the
 * corresponding wrapper.
 */
export interface ArcWrappers {
  AbsoluteVote: AbsoluteVoteWrapper;
  ContributionReward: ContributionRewardWrapper;
  DaoCreator: DaoCreatorWrapper;
  GenesisProtocol: GenesisProtocolWrapper;
  GlobalConstraintRegistrar: GlobalConstraintRegistrarWrapper;
  SchemeRegistrar: SchemeRegistrarWrapper;
  TokenCapGC: TokenCapGCWrapper;
  UpgradeScheme: UpgradeSchemeWrapper;
  VestingScheme: VestingSchemeWrapper;
  VoteInOrganizationScheme: VoteInOrganizationSchemeWrapper;
}

/**
 * Arc.js wrapper factories grouped by type.
 */
export interface ArcWrappersByType {
  /**
   * All wrapped contracts
   */
  allWrappers: ArcWrappers;
  /**
   * All wrapped schemes
   */
  schemes: Array<ContractWrapperBase>;
  /**
   * All wrapped voting machines
   */
  votingMachines: Array<ContractWrapperBase>;
  /**
   * All wrapped global constraints
   */
  globalConstraints: Array<ContractWrapperBase>;
  /**
   * Other types of wrappers
   */
  other: Array<ContractWrapperBase>;
}

/**
 * Service that provides access to Arc.js contract wrapper classes and class factories.
 */
export class WrapperService {

  /**
   * Wrappers by name, hydrated with contracts as deployed by this version of Arc.js.
   */
  public static wrappers: ArcWrappers;
  /**
   * Contract wrapper factories grouped by type
   */
  public static wrappersByType: ArcWrappersByType;
  /**
   * Wrapper factories by name.  Use these when you want to do `.at()` or `.new()`.  You can also
   * use for `deployed()`, but the wrappers for deployed contracts are directly available from the
   * `wrappers` and `wrappersByType` properties.
   */
  public static factories: ArcWrapperFactories = {
    AbsoluteVote: AbsoluteVote as ContractWrapperFactory<AbsoluteVoteWrapper>,
    ContributionReward: ContributionReward as ContractWrapperFactory<ContributionRewardWrapper>,
    DaoCreator: DaoCreator as ContractWrapperFactory<DaoCreatorWrapper>,
    GenesisProtocol: GenesisProtocol as ContractWrapperFactory<GenesisProtocolWrapper>,
    GlobalConstraintRegistrar: GlobalConstraintRegistrar as ContractWrapperFactory<GlobalConstraintRegistrarWrapper>,
    SchemeRegistrar: SchemeRegistrar as ContractWrapperFactory<SchemeRegistrarWrapper>,
    TokenCapGC: TokenCapGC as ContractWrapperFactory<TokenCapGCWrapper>,
    UpgradeScheme: UpgradeScheme as ContractWrapperFactory<UpgradeSchemeWrapper>,
    VestingScheme: VestingScheme as ContractWrapperFactory<VestingSchemeWrapper>,
    VoteInOrganizationScheme: VoteInOrganizationScheme as ContractWrapperFactory<VoteInOrganizationSchemeWrapper>,
  };

  /**
   * initialize() must be called before any of the static properties will have values.
   * It is currently called in ArcInitialize(), which in trun must be invoked by any applicaiton
   * using Arc.js.
   */
  public static async initialize(): Promise<void> {
    LoggingService.debug("WrapperService: initializing");
    /**
     * Deployed contract wrappers by name.
     */
    WrapperService.wrappers = {
      AbsoluteVote: await AbsoluteVote.deployed(),
      ContributionReward: await ContributionReward.deployed(),
      DaoCreator: await DaoCreator.deployed(),
      GenesisProtocol: await GenesisProtocol.deployed(),
      GlobalConstraintRegistrar: await GlobalConstraintRegistrar.deployed(),
      SchemeRegistrar: await SchemeRegistrar.deployed(),
      TokenCapGC: await TokenCapGC.deployed(),
      UpgradeScheme: await UpgradeScheme.deployed(),
      VestingScheme: await VestingScheme.deployed(),
      VoteInOrganizationScheme: await VoteInOrganizationScheme.deployed(),
    };

    /**
     * Contract wrappers grouped by type
     */
    WrapperService.wrappersByType = {
      allWrappers: WrapperService.wrappers,
      globalConstraints: [
        WrapperService.wrappers.TokenCapGC,
      ],
      other: [
        WrapperService.wrappers.DaoCreator,
      ],
      schemes: [
        WrapperService.wrappers.ContributionReward,
        WrapperService.wrappers.GenesisProtocol,
        WrapperService.wrappers.GlobalConstraintRegistrar,
        WrapperService.wrappers.SchemeRegistrar,
        WrapperService.wrappers.UpgradeScheme,
        WrapperService.wrappers.VestingScheme,
        WrapperService.wrappers.VoteInOrganizationScheme,
      ],
      votingMachines: [
        WrapperService.wrappers.AbsoluteVote,
        WrapperService.wrappers.GenesisProtocol,
      ],
    };
  }

  /**
   * Returns the promise of an Arc.js contract wrapper or undefined if not found.
   * @param contractName - name of an Arc contract, like "SchemeRegistrar"
   * @param address - optional
   */
  public static async getContractWrapper(contractName: string, address?: string)
    : Promise<ContractWrapperBase | undefined> {
    const factories = await WrapperService.factories;
    const factory = factories[contractName];
    if (!factory) {
      return undefined;
    }
    if (address) {
      return factory.at(address)
        .then((resultingContract: ContractWrapperBase) => resultingContract, () => undefined);
    } else {
      return Promise.resolve(WrapperService.wrappers[contractName]);
    }
  }
}
