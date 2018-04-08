import { Address } from "./commonTypes";
import { ContractWrapperBase } from "./contractWrapperBase";
import { ContractWrapperFactory } from "./contractWrapperFactory.js";
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
  allWrappers: Array<ContractWrapperBase>;
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
  public static factories: ArcWrapperFactories = {} as ArcWrapperFactories;

  /**
   * Map of contract wrappers keyed by address.  For example:
   *
   * `const wrapper = WrapperService.wrappersByAddress.get(anAddress);`
   *
   * Currently only returns the wrappers for contracts that were deployed by the running
   * version of Arc.js.
   */
  public static wrappersByAddress: Map<Address, ContractWrapperBase> = new Map<Address, ContractWrapperBase>();

  /**
   * initialize() must be called before any of the static properties will have values.
   * It is called by ArcInitialize(), which in tur must be invoked by any application using Arc.js.
   *
   * @param options
   */
  public static async initialize(options?: WrapperServiceInitializeOptions): Promise<void> {
    LoggingService.debug("WrapperService: initializing");
    /**
     * Deployed contract wrappers by name.
     */
    const filter = (options && options.filter) ?
      Object.assign({}, WrapperService.noWrappersFilter, options.filter) :
      WrapperService.allWrappersFilter;

    /* tslint:disable:max-line-length */
    WrapperService.wrappers.AbsoluteVote = filter.AbsoluteVote ? await AbsoluteVoteFactory.deployed() : null;
    WrapperService.wrappers.ContributionReward = filter.ContributionReward ? await ContributionRewardFactory.deployed() : null;
    WrapperService.wrappers.DaoCreator = filter.DaoCreator ? await DaoCreatorFactory.deployed() : null;
    WrapperService.wrappers.GenesisProtocol = filter.GenesisProtocol ? await GenesisProtocolFactory.deployed() : null;
    WrapperService.wrappers.GlobalConstraintRegistrar = filter.GlobalConstraintRegistrar ? await GlobalConstraintRegistrarFactory.deployed() : null;
    WrapperService.wrappers.SchemeRegistrar = filter.SchemeRegistrar ? await SchemeRegistrarFactory.deployed() : null;
    WrapperService.wrappers.TokenCapGC = filter.TokenCapGC ? await TokenCapGCFactory.deployed() : null;
    WrapperService.wrappers.UpgradeScheme = filter.UpgradeScheme ? await UpgradeSchemeFactory.deployed() : null;
    WrapperService.wrappers.VestingScheme = filter.VestingScheme ? await VestingSchemeFactory.deployed() : null;
    WrapperService.wrappers.VoteInOrganizationScheme = filter.VoteInOrganizationScheme ? await VoteInOrganizationSchemeFactory.deployed() : null;
    /* tslint:enable:max-line-length */

    /**
     * Contract wrappers grouped by type
     */
    WrapperService.wrappersByType.allWrappers = Object.values(WrapperService.wrappers) as Array<ContractWrapperBase>;
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
     * factories by name.  This particular way of initializing the object is due to a
     * weird thing in typedocs where it doesn't treat `factories` as a property of `WrapperService`
     * unless we initialize it this way (otherwise it shows up in the "Object Literal" section).
     */
    WrapperService.factories.AbsoluteVote = AbsoluteVoteFactory as ContractWrapperFactory<AbsoluteVoteWrapper>;
    WrapperService.factories.ContributionReward = ContributionRewardFactory as
      ContractWrapperFactory<ContributionRewardWrapper>;
    WrapperService.factories.DaoCreator = DaoCreatorFactory as ContractWrapperFactory<DaoCreatorWrapper>;
    WrapperService.factories.GenesisProtocol = GenesisProtocolFactory as ContractWrapperFactory<GenesisProtocolWrapper>;
    WrapperService.factories.GlobalConstraintRegistrar = GlobalConstraintRegistrarFactory as
      ContractWrapperFactory<GlobalConstraintRegistrarWrapper>;
    WrapperService.factories.SchemeRegistrar = SchemeRegistrarFactory as ContractWrapperFactory<SchemeRegistrarWrapper>;
    WrapperService.factories.TokenCapGC = TokenCapGCFactory as ContractWrapperFactory<TokenCapGCWrapper>;
    WrapperService.factories.UpgradeScheme = UpgradeSchemeFactory as ContractWrapperFactory<UpgradeSchemeWrapper>;
    WrapperService.factories.VestingScheme = VestingSchemeFactory as ContractWrapperFactory<VestingSchemeWrapper>;
    WrapperService.factories.VoteInOrganizationScheme = VoteInOrganizationSchemeFactory as
      ContractWrapperFactory<VoteInOrganizationSchemeWrapper>;
    /**
     * TODO: this should be made aware of previously-deployed GCs
     */
    /* tslint:disable-next-line:forin */
    for (const wrapperName in WrapperService.wrappers) {
      const wrapper = WrapperService.wrappers[wrapperName];
      if (wrapper) {
        WrapperService.wrappersByAddress.set(wrapper.address, wrapper);
      }
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

  private static allWrappersFilter: WrapperFilter = {
    AbsoluteVote: true,
    ContributionReward: true,
    DaoCreator: true,
    GenesisProtocol: true,
    GlobalConstraintRegistrar: true,
    SchemeRegistrar: true,
    TokenCapGC: true,
    UpgradeScheme: true,
    VestingScheme: true,
    VoteInOrganizationScheme: true,
  };

  private static noWrappersFilter: WrapperFilter = {
    AbsoluteVote: false,
    ContributionReward: false,
    DaoCreator: false,
    GenesisProtocol: false,
    GlobalConstraintRegistrar: false,
    SchemeRegistrar: false,
    TokenCapGC: false,
    UpgradeScheme: false,
    VestingScheme: false,
    VoteInOrganizationScheme: false,
  };

}

export class WrapperFilter {
  public AbsoluteVote: boolean = true;
  public ContributionReward: boolean = true;
  public DaoCreator: boolean = true;
  public GenesisProtocol: boolean = true;
  public GlobalConstraintRegistrar: boolean = true;
  public SchemeRegistrar: boolean = true;
  public TokenCapGC: boolean = true;
  public UpgradeScheme: boolean = true;
  public VestingScheme: boolean = true;
  public VoteInOrganizationScheme: boolean = true;
}

export interface WrapperServiceInitializeOptions {
  /**
   * Option filter to only initialize the contracts whose name is set to true.
   * Any that are omitted or set to false here will appear as `null` in
   * WrapperService.wrappers and WrapperService.wrappersByType,
   * and will not be available in WrapperService.wrappersByAddress.
   * But their factories will still be available in WrapperService.factories.
   */
  filter?: WrapperFilter;
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
