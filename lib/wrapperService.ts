import { Address } from "./commonTypes";
import { ContractWrapperBase } from "./contractWrapperBase";
import ContractWrapperFactory from "./contractWrapperFactory.js";
import { LoggingService } from "./loggingService";
import {
  AbsoluteVoteFactory,
  AbsoluteVoteWrapper
} from "./wrappers/absoluteVote.js";
import {
  ContributionRewardFactory,
  ContributionRewardWrapper
} from "./wrappers/contributionreward.js";
import {
  DaoCreatorFactory,
  DaoCreatorWrapper
} from "./wrappers/daocreator.js";
import {
  GenesisProtocolFactory,
  GenesisProtocolWrapper
} from "./wrappers/genesisProtocol.js";
import {
  GlobalConstraintRegistrarFactory,
  GlobalConstraintRegistrarWrapper
} from "./wrappers/globalconstraintregistrar.js";
import {
  SchemeRegistrarFactory,
  SchemeRegistrarWrapper
} from "./wrappers/schemeregistrar.js";
import {
  TokenCapGCFactory,
  TokenCapGCWrapper
} from "./wrappers/tokenCapGC.js";
import {
  UpgradeSchemeFactory,
  UpgradeSchemeWrapper
} from "./wrappers/upgradescheme.js";
import {
  VestingSchemeFactory,
  VestingSchemeWrapper
} from "./wrappers/vestingscheme.js";
import {
  VoteInOrganizationSchemeFactory,
  VoteInOrganizationSchemeWrapper
} from "./wrappers/voteInOrganizationScheme.js";

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
   * Wrappers by name, hydrated with contracts as deployed by the running version of Arc.js.
   */
  public static wrappers: ArcWrappers = {} as ArcWrappers;
  /**
   * Contract wrapper factories grouped by type
   */
  public static wrappersByType: ArcWrappersByType = {} as ArcWrappersByType;
  /**
   * Wrapper factories by name.  Use these when you want to do `.at()` or `.new()`.  You can also
   * use for `deployed()`, but the wrappers for deployed contracts are directly available from the
   * `wrappers` and `wrappersByType` properties.
   */
  public static factories: ArcWrapperFactories = {
    AbsoluteVote: AbsoluteVoteFactory as ContractWrapperFactory<AbsoluteVoteWrapper>,
    ContributionReward: ContributionRewardFactory as ContractWrapperFactory<ContributionRewardWrapper>,
    DaoCreator: DaoCreatorFactory as ContractWrapperFactory<DaoCreatorWrapper>,
    GenesisProtocol: GenesisProtocolFactory as ContractWrapperFactory<GenesisProtocolWrapper>,
    GlobalConstraintRegistrar: GlobalConstraintRegistrarFactory as
      ContractWrapperFactory<GlobalConstraintRegistrarWrapper>,
    SchemeRegistrar: SchemeRegistrarFactory as ContractWrapperFactory<SchemeRegistrarWrapper>,
    TokenCapGC: TokenCapGCFactory as ContractWrapperFactory<TokenCapGCWrapper>,
    UpgradeScheme: UpgradeSchemeFactory as ContractWrapperFactory<UpgradeSchemeWrapper>,
    VestingScheme: VestingSchemeFactory as ContractWrapperFactory<VestingSchemeWrapper>,
    VoteInOrganizationScheme: VoteInOrganizationSchemeFactory as
      ContractWrapperFactory<VoteInOrganizationSchemeWrapper>,
  };

  /**
   * Contract wrappers keyed by address.  For example:
   *
   * `const wrapper = WrapperService.wrappersByAddress.get(anAddress);`
   *
   * Currently only returns wrappers for contracts deployed by the running
   * version of Arc.js.
   */
  public static wrappersByAddress: Map<Address, ContractWrapperBase> = new Map<Address, ContractWrapperBase>();

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
    WrapperService.wrappers.AbsoluteVote = await AbsoluteVoteFactory.deployed();
    WrapperService.wrappers.ContributionReward = await ContributionRewardFactory.deployed();
    WrapperService.wrappers.DaoCreator = await DaoCreatorFactory.deployed();
    WrapperService.wrappers.GenesisProtocol = await GenesisProtocolFactory.deployed();
    WrapperService.wrappers.GlobalConstraintRegistrar = await GlobalConstraintRegistrarFactory.deployed();
    WrapperService.wrappers.SchemeRegistrar = await SchemeRegistrarFactory.deployed();
    WrapperService.wrappers.TokenCapGC = await TokenCapGCFactory.deployed();
    WrapperService.wrappers.UpgradeScheme = await UpgradeSchemeFactory.deployed();
    WrapperService.wrappers.VestingScheme = await VestingSchemeFactory.deployed();
    WrapperService.wrappers.VoteInOrganizationScheme = await VoteInOrganizationSchemeFactory.deployed();

    /**
     * Contract wrappers grouped by type
     */
    WrapperService.wrappersByType.allWrappers = WrapperService.wrappers;
    WrapperService.wrappersByType.globalConstraints = [
      WrapperService.wrappers.TokenCapGC,
    ];
    WrapperService.wrappersByType.other = [
      WrapperService.wrappers.DaoCreator,
    ];
    WrapperService.wrappersByType.schemes = [
      WrapperService.wrappers.ContributionReward,
      WrapperService.wrappers.GenesisProtocol,
      WrapperService.wrappers.GlobalConstraintRegistrar,
      WrapperService.wrappers.SchemeRegistrar,
      WrapperService.wrappers.UpgradeScheme,
      WrapperService.wrappers.VestingScheme,
      WrapperService.wrappers.VoteInOrganizationScheme,
    ];
    WrapperService.wrappersByType.votingMachines = [
      WrapperService.wrappers.AbsoluteVote,
      WrapperService.wrappers.GenesisProtocol,
    ];

    /**
     * TODO: this should be made aware of previously-deployed GCs
     */
    /* tslint:disable-next-line:forin */
    for (const wrapperName in WrapperService.wrappers) {
      const wrapper = WrapperService.wrappers[wrapperName];
      WrapperService.wrappersByAddress.set(wrapper.address, wrapper);
    }
  }

  /**
   * Returns the promise of an Arc.js contract wrapper or undefined if not found.
   *
   * Most useful when you have both contract name and address and wish to most
   * efficiently return the associated wrapper, or undefined when not found.
   *
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

/**
 * for quicker access to the contract wrappers
 */
export const ContractWrappers: ArcWrappers = WrapperService.wrappers;
/**
 * for quicker access to the contract wrapper factories
 */
export const ContractWrapperFactories: ArcWrapperFactories = WrapperService.factories;
/**
 * for quicker access to the contract wrapper types
 */
export const ContractWrappersByType: ArcWrappersByType = WrapperService.wrappersByType;
/**
 * for quicker access to the contract wrappers by address
 */
export const ContractWrappersByAddress: Map<Address, ContractWrapperBase> = WrapperService.wrappersByAddress;
