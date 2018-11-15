import { promisify } from "es6-promisify";
import { Address } from "./commonTypes";
import { IContractWrapper, IContractWrapperFactory, IUniversalSchemeWrapper } from "./iContractWrapperBase";
import { LoggingService } from "./loggingService";
import { Utils } from "./utils";
import {
  AbsoluteVoteFactory,
  AbsoluteVoteWrapper
} from "./wrappers/absoluteVote";
import {
  Auction4ReputationFactory,
  Auction4ReputationWrapper
} from "./wrappers/auction4Reputation";
import {
  ContributionRewardFactory,
  ContributionRewardWrapper
} from "./wrappers/contributionReward";
import {
  DaoCreatorFactory,
  DaoCreatorWrapper
} from "./wrappers/daoCreator";
import {
  DaoTokenFactory,
  DaoTokenWrapper
} from "./wrappers/daoToken";
import {
  ExternalLocking4ReputationFactory,
  ExternalLocking4ReputationWrapper
} from "./wrappers/externalLocking4Reputation";
import {
  FixedReputationAllocationFactory,
  FixedReputationAllocationWrapper
} from "./wrappers/fixedReputationAllocation";
import {
  GenesisProtocolFactory,
  GenesisProtocolWrapper
} from "./wrappers/genesisProtocol";
import {
  GlobalConstraintRegistrarFactory,
  GlobalConstraintRegistrarWrapper
} from "./wrappers/globalConstraintRegistrar";
import {
  IntVoteInterfaceFactory,
  IntVoteInterfaceWrapper
} from "./wrappers/intVoteInterface";
import {
  LockingEth4ReputationFactory,
  LockingEth4ReputationWrapper
} from "./wrappers/lockingEth4Reputation";
import {
  LockingToken4ReputationFactory,
  LockingToken4ReputationWrapper
} from "./wrappers/lockingToken4Reputation";
import {
  MintableTokenFactory,
  MintableTokenWrapper
} from "./wrappers/mintableToken";
import {
  RedeemerFactory,
  RedeemerWrapper
} from "./wrappers/redeemer";
import {
  ReputationFactory,
  ReputationWrapper
} from "./wrappers/reputation";
import {
  SchemeRegistrarFactory,
  SchemeRegistrarWrapper
} from "./wrappers/schemeRegistrar";
import {
  StandardTokenFactory,
  StandardTokenWrapper
} from "./wrappers/standardToken";
import {
  TokenCapGCFactory,
  TokenCapGCWrapper
} from "./wrappers/tokenCapGC";
import {
  UpgradeSchemeFactory,
  UpgradeSchemeWrapper
} from "./wrappers/upgradeScheme";
import {
  VestingSchemeFactory,
  VestingSchemeWrapper
} from "./wrappers/vestingScheme";
import {
  VoteInOrganizationSchemeFactory,
  VoteInOrganizationSchemeWrapper
} from "./wrappers/voteInOrganizationScheme";

/* tslint:disable:max-line-length */

/**
 * An object with property names being a contract key and property value as the
 * corresponding wrapper factory (IContractWrapperFactory<TWrapper).
 */
export interface ArcWrapperFactories {
  AbsoluteVote: IContractWrapperFactory<AbsoluteVoteWrapper>;
  ContributionReward: IContractWrapperFactory<ContributionRewardWrapper>;
  DaoCreator: IContractWrapperFactory<DaoCreatorWrapper>;
  DaoToken: IContractWrapperFactory<DaoTokenWrapper>;
  GenesisProtocol: IContractWrapperFactory<GenesisProtocolWrapper>;
  GlobalConstraintRegistrar: IContractWrapperFactory<GlobalConstraintRegistrarWrapper>;
  IntVoteInterface: IContractWrapperFactory<IntVoteInterfaceWrapper>;
  LockingEth4Reputation: IContractWrapperFactory<LockingEth4ReputationWrapper>;
  LockingToken4Reputation: IContractWrapperFactory<LockingToken4ReputationWrapper>;
  Auction4Reputation: IContractWrapperFactory<Auction4ReputationWrapper>;
  FixedReputationAllocation: IContractWrapperFactory<FixedReputationAllocationWrapper>;
  ExternalLocking4Reputation: IContractWrapperFactory<ExternalLocking4ReputationWrapper>;
  MintableToken: IContractWrapperFactory<MintableTokenWrapper>;
  Redeemer: IContractWrapperFactory<RedeemerWrapper>;
  Reputation: IContractWrapperFactory<ReputationWrapper>;
  SchemeRegistrar: IContractWrapperFactory<SchemeRegistrarWrapper>;
  StandardToken: IContractWrapperFactory<StandardTokenWrapper>;
  TokenCapGC: IContractWrapperFactory<TokenCapGCWrapper>;
  UpgradeScheme: IContractWrapperFactory<UpgradeSchemeWrapper>;
  VestingScheme: IContractWrapperFactory<VestingSchemeWrapper>;
  VoteInOrganizationScheme: IContractWrapperFactory<VoteInOrganizationSchemeWrapper>;
}

/**
 * An object with property names being an Arc contract name and then property value being the
 * corresponding wrapper.  Only deployed wrappers are included here.  Other wrappers
 * may be obtained via their factory.  See also ArcSchemeWrappers.
 */
export interface ArcWrappers {
  AbsoluteVote: AbsoluteVoteWrapper;
  ContributionReward: ContributionRewardWrapper;
  DaoCreator: DaoCreatorWrapper;
  GenesisProtocol: GenesisProtocolWrapper;
  GlobalConstraintRegistrar: GlobalConstraintRegistrarWrapper;
  Redeemer: RedeemerWrapper;
  SchemeRegistrar: SchemeRegistrarWrapper;
  TokenCapGC: TokenCapGCWrapper;
  UpgradeScheme: UpgradeSchemeWrapper;
  VestingScheme: VestingSchemeWrapper;
  VoteInOrganizationScheme: VoteInOrganizationSchemeWrapper;
}

/**
 * An object with property names being an Arc contract name and the property value being the
 * corresponding contract non-universal contract wrapper factory.
 */
export interface ArcNonUniversalSchemeWrapperFactories {
  LockingEth4Reputation: IContractWrapperFactory<LockingEth4ReputationWrapper>;
  LockingToken4Reputation: IContractWrapperFactory<LockingToken4ReputationWrapper>;
  Auction4Reputation: IContractWrapperFactory<Auction4ReputationWrapper>;
  FixedReputationAllocation: IContractWrapperFactory<FixedReputationAllocationWrapper>;
  ExternalLocking4Reputation: IContractWrapperFactory<ExternalLocking4ReputationWrapper>;
}

/**
 * An object with property names being an Arc contract name and the property value being the
 * corresponding universal contract wrapper factory.
 */
export interface ArcUniversalSchemeWrapperFactories {
  ContributionReward: IContractWrapperFactory<ContributionRewardWrapper>;
  GlobalConstraintRegistrar: IContractWrapperFactory<GlobalConstraintRegistrarWrapper>;
  SchemeRegistrar: IContractWrapperFactory<SchemeRegistrarWrapper>;
  UpgradeScheme: IContractWrapperFactory<UpgradeSchemeWrapper>;
  VestingScheme: IContractWrapperFactory<VestingSchemeWrapper>;
  VoteInOrganizationScheme: IContractWrapperFactory<VoteInOrganizationSchemeWrapper>;
}

/**
 * An object with property names being an Arc contract name and the property value being the
 * corresponding contract wrapper factory.  Includes both universal and non-universal factories.
 */
export interface ArcSchemeWrapperFactories
  extends ArcNonUniversalSchemeWrapperFactories, ArcUniversalSchemeWrapperFactories {
}

/**
 * Arc.js wrapper factories grouped by type.
 */
export interface ArcWrappersByType {
  /**
   * All wrapped contracts
   */
  allWrappers: Array<IContractWrapper>;
  /**
   * All wrapped non-universal schemes
   */
  nonUniversalSchemes: Array<IContractWrapper>;
  /**
   * All wrapped universal schemes
   */
  universalSchemes: Array<IUniversalSchemeWrapper>;
  /**
   * All wrapped voting machines
   */
  votingMachines: Array<IContractWrapper>;
  /**
   * All wrapped global constraints
   */
  globalConstraints: Array<IContractWrapper>;
  /**
   * Other types of wrappers
   */
  other: Array<IContractWrapper>;
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
   * Universal scheme contract wrapper factories by name.
   */
  public static universalSchemeFactories: ArcUniversalSchemeWrapperFactories = {} as ArcUniversalSchemeWrapperFactories;
  /**
   * Non-universal scheme contract wrapper factories by name.
   */
  public static nonUniversalSchemeFactories: ArcNonUniversalSchemeWrapperFactories = {} as ArcNonUniversalSchemeWrapperFactories;
  /**
   * All scheme contract wrapper factories by name.
   */
  public static schemeFactories: ArcSchemeWrapperFactories = {} as ArcSchemeWrapperFactories;

  /**
   * Map of contract wrappers keyed by address.  For example:
   *
   * `const wrapper = WrapperService.wrappersByAddress.get(anAddress);`
   *
   * Currently only returns the wrappers for contracts that were deployed by the running
   * version of Arc.js.
   */
  public static wrappersByAddress: Map<Address, IContractWrapper> = new Map<Address, IContractWrapper>();

  /**
   * initialize() must be called before any of the static properties will have values.
   * It is called by ArcInitialize(), which in tur must be invoked by any application using Arc.js.
   *
   * @param options
   */
  public static async initialize(options: WrapperServiceInitializeOptions = {}): Promise<void> {
    LoggingService.debug("WrapperService: initializing");
    /**
     * Deployed contract wrappers by name.
     */
    const filter = (options.filter) ?
      Object.assign({}, WrapperService.noWrappersFilter, options.filter) :
      WrapperService.allWrappersFilter;

    WrapperService.wrappers.AbsoluteVote = filter.AbsoluteVote ? await AbsoluteVoteFactory.deployed() : null;
    WrapperService.wrappers.ContributionReward = filter.ContributionReward ? await ContributionRewardFactory.deployed() : null;
    WrapperService.wrappers.DaoCreator = filter.DaoCreator ? await DaoCreatorFactory.deployed() : null;
    WrapperService.wrappers.GenesisProtocol = filter.GenesisProtocol ? await GenesisProtocolFactory.deployed() : null;
    WrapperService.wrappers.GlobalConstraintRegistrar = filter.GlobalConstraintRegistrar ? await GlobalConstraintRegistrarFactory.deployed() : null;
    WrapperService.wrappers.Redeemer = filter.Redeemer ? await RedeemerFactory.deployed() : null;
    WrapperService.wrappers.SchemeRegistrar = filter.SchemeRegistrar ? await SchemeRegistrarFactory.deployed() : null;
    WrapperService.wrappers.TokenCapGC = filter.TokenCapGC ? await TokenCapGCFactory.deployed() : null;
    WrapperService.wrappers.UpgradeScheme = filter.UpgradeScheme ? await UpgradeSchemeFactory.deployed() : null;
    WrapperService.wrappers.VestingScheme = filter.VestingScheme ? await VestingSchemeFactory.deployed() : null;
    WrapperService.wrappers.VoteInOrganizationScheme = filter.VoteInOrganizationScheme ? await VoteInOrganizationSchemeFactory.deployed() : null;

    /**
     * Contract wrappers grouped by type
     */
    WrapperService.wrappersByType.allWrappers = Object.values(WrapperService.wrappers) as Array<IContractWrapper>;
    WrapperService.wrappersByType.globalConstraints = [
      WrapperService.wrappers.TokenCapGC,
    ];
    WrapperService.wrappersByType.other = [
      WrapperService.wrappers.DaoCreator,
      WrapperService.wrappers.Redeemer,
    ];
    WrapperService.wrappersByType.nonUniversalSchemes = [
    ];

    WrapperService.wrappersByType.universalSchemes = [
      WrapperService.wrappers.ContributionReward,
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
    WrapperService.factories.AbsoluteVote = AbsoluteVoteFactory as IContractWrapperFactory<AbsoluteVoteWrapper>;
    WrapperService.factories.ContributionReward = ContributionRewardFactory as IContractWrapperFactory<ContributionRewardWrapper>;
    WrapperService.factories.DaoCreator = DaoCreatorFactory as IContractWrapperFactory<DaoCreatorWrapper>;
    WrapperService.factories.DaoToken = DaoTokenFactory as IContractWrapperFactory<DaoTokenWrapper>;
    WrapperService.factories.GenesisProtocol = GenesisProtocolFactory as IContractWrapperFactory<GenesisProtocolWrapper>;
    WrapperService.factories.GlobalConstraintRegistrar = GlobalConstraintRegistrarFactory as IContractWrapperFactory<GlobalConstraintRegistrarWrapper>;
    WrapperService.factories.IntVoteInterface = IntVoteInterfaceFactory as IContractWrapperFactory<IntVoteInterfaceWrapper>;
    WrapperService.factories.LockingEth4Reputation = LockingEth4ReputationFactory as IContractWrapperFactory<LockingEth4ReputationWrapper>;
    WrapperService.factories.LockingToken4Reputation = LockingToken4ReputationFactory as IContractWrapperFactory<LockingToken4ReputationWrapper>;
    WrapperService.factories.Auction4Reputation = Auction4ReputationFactory as IContractWrapperFactory<Auction4ReputationWrapper>;
    WrapperService.factories.FixedReputationAllocation = FixedReputationAllocationFactory as IContractWrapperFactory<FixedReputationAllocationWrapper>;
    WrapperService.factories.ExternalLocking4Reputation = ExternalLocking4ReputationFactory as IContractWrapperFactory<ExternalLocking4ReputationWrapper>;
    WrapperService.factories.MintableToken = MintableTokenFactory as IContractWrapperFactory<MintableTokenWrapper>;
    WrapperService.factories.Redeemer = RedeemerFactory as IContractWrapperFactory<RedeemerWrapper>;
    WrapperService.factories.Reputation = ReputationFactory as IContractWrapperFactory<ReputationWrapper>;
    WrapperService.factories.SchemeRegistrar = SchemeRegistrarFactory as IContractWrapperFactory<SchemeRegistrarWrapper>;
    WrapperService.factories.StandardToken = StandardTokenFactory as IContractWrapperFactory<StandardTokenWrapper>;
    WrapperService.factories.TokenCapGC = TokenCapGCFactory as IContractWrapperFactory<TokenCapGCWrapper>;
    WrapperService.factories.UpgradeScheme = UpgradeSchemeFactory as IContractWrapperFactory<UpgradeSchemeWrapper>;
    WrapperService.factories.VestingScheme = VestingSchemeFactory as IContractWrapperFactory<VestingSchemeWrapper>;
    WrapperService.factories.VoteInOrganizationScheme = VoteInOrganizationSchemeFactory as IContractWrapperFactory<VoteInOrganizationSchemeWrapper>;

    WrapperService.nonUniversalSchemeFactories.LockingEth4Reputation = WrapperService.factories.LockingEth4Reputation;
    WrapperService.nonUniversalSchemeFactories.LockingToken4Reputation = WrapperService.factories.LockingToken4Reputation;
    WrapperService.nonUniversalSchemeFactories.Auction4Reputation = WrapperService.factories.Auction4Reputation;
    WrapperService.nonUniversalSchemeFactories.FixedReputationAllocation = WrapperService.factories.FixedReputationAllocation;
    WrapperService.nonUniversalSchemeFactories.ExternalLocking4Reputation = WrapperService.factories.ExternalLocking4Reputation;

    WrapperService.universalSchemeFactories.ContributionReward = WrapperService.factories.ContributionReward;
    WrapperService.universalSchemeFactories.GlobalConstraintRegistrar = WrapperService.factories.GlobalConstraintRegistrar;
    WrapperService.universalSchemeFactories.SchemeRegistrar = WrapperService.factories.SchemeRegistrar;
    WrapperService.universalSchemeFactories.UpgradeScheme = WrapperService.factories.UpgradeScheme;
    WrapperService.universalSchemeFactories.VestingScheme = WrapperService.factories.VestingScheme;
    WrapperService.universalSchemeFactories.VoteInOrganizationScheme = WrapperService.factories.VoteInOrganizationScheme;

    WrapperService.schemeFactories = Object.assign({}, WrapperService.nonUniversalSchemeFactories, WrapperService.universalSchemeFactories);

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
   * Most useful when you have both contract name and maybe the address and wish to most
   * efficiently return the associated wrapper, or undefined when not found.
   *
   * @param contractName - name of an Arc contract, like "SchemeRegistrar"
   * @param address - optional
   */
  public static async getContractWrapper(contractName: string, address?: string)
    : Promise<IContractWrapper | undefined> {
    const factories = await WrapperService.factories;
    const factory = factories[contractName];
    if (!factory) {
      return undefined;
    }
    if (address) {
      return factory.at(address)
        .then((resultingContract: IContractWrapper) => resultingContract, () => undefined);
    } else {
      return Promise.resolve(WrapperService.wrappers[contractName]);
    }
  }

  /**
   * Confirm the given contract wrapper wraps the same contract as it purports to,
   * and is the one deployed in the running version of Arc.js.
   *
   * This will reject wrappers of different versions of contracts with the same name in Arc.
   * @param contractNameWant
   * @param contractWrapperFound
   */
  public static async confirmContractType(contractWrapperFound: any): Promise<boolean> {

    const contractNameWant = contractWrapperFound.name;

    const web3 = await Utils.getWeb3();

    const deployedWrapperWant = WrapperService.wrappers[contractNameWant];

    const byteCodeWant = await promisify(
      (callback: any): void => web3.eth.getCode(deployedWrapperWant.address, callback))();
    const byteCodeFound = await promisify(
      (callback: any): void => web3.eth.getCode(contractWrapperFound.address, callback))();

    return byteCodeWant === byteCodeFound;
  }

  private static allWrappersFilter: WrapperFilter = {
    AbsoluteVote: true,
    ContributionReward: true,
    DaoCreator: true,
    GenesisProtocol: true,
    GlobalConstraintRegistrar: true,
    Redeemer: true,
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
    Redeemer: false,
    SchemeRegistrar: false,
    TokenCapGC: false,
    UpgradeScheme: false,
    VestingScheme: false,
    VoteInOrganizationScheme: false,
  };
}

export interface WrapperFilter {
  AbsoluteVote?: boolean;
  ContributionReward?: boolean;
  DaoCreator?: boolean;
  GenesisProtocol?: boolean;
  GlobalConstraintRegistrar?: boolean;
  Redeemer?: boolean;
  SchemeRegistrar?: boolean;
  TokenCapGC?: boolean;
  UpgradeScheme?: boolean;
  VestingScheme?: boolean;
  VoteInOrganizationScheme?: boolean;
}

export interface WrapperServiceInitializeOptions {
  /**
   * Optional filter to only initialize the contracts whose name is set to `true`.
   * Any contracts that are omitted or set to `false` here will appear as `null` in
   * `WrapperService.wrappers` and `WrapperService.wrappersByType`,
   * and will not be available in `WrapperService.wrappersByAddress`.
   * But their factories will still be available in `WrapperService.factories`.
   * See [Optimized Contract Loading](/Wrappers.md#optimizedcontractloading) for more information.
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
export const ContractWrappersByAddress: Map<Address, IContractWrapper> = WrapperService.wrappersByAddress;

export const UniversalSchemeFactories: ArcUniversalSchemeWrapperFactories = WrapperService.universalSchemeFactories;
export const NonUniversalSchemeFactories: ArcNonUniversalSchemeWrapperFactories = WrapperService.nonUniversalSchemeFactories;
export const SchemeFactories: ArcSchemeWrapperFactories = WrapperService.schemeFactories;
