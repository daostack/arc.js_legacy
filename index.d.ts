import * as BigNumber from "bignumber.js";
import * as Web3 from "web3";

/* tslint:disable:max-line-length */

declare module "@daostack/arc.js" {
  /*******************************
   * Arc contract information as contained in ArcDeployedContractNames (see settings)
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
   * Base or actual type returned by all contract wrapper methods that generate a transaction.
   */
  export interface ArcTransactionResult {
    tx: TransactionReceiptTruffle;
    /**
     * Return a value from the transaction logs.
     * @param valueName - The name of the property whose value we wish to return
     * @param eventName - Name of the event in whose log we are to look for the value
     * @param index - Index of the log in which to look for the value, when eventName is not given.
     * Default is the index of the last log in the transaction.
     */
    getValueFromTx(valueName: string, eventName?: string, index?: number): any;
  }
  /**
   * Base or actual type returned by all contract wrapper methods that generate a transaction and initiate a proposal.
   */
  export interface ArcTransactionProposalResult extends ArcTransactionResult {
    /**
     * unique hash identifying a proposal
     */
    proposalId: string;
  }
  /**
   * Base or actual type returned by all contract wrapper methods that generate a transaction and any other result.
   */
  export interface ArcTransactionDataResult<TData> extends ArcTransactionResult {
    result: TData;
  }

  /**
   * returned by the create method in VestingScheme
   */
  export interface ArcTransactionAgreementResult extends ArcTransactionResult {
    agreementId: number;
  }
  /**
   * An object with property names being a contract key and property value as the corresponding ArcContractInfo.
   * For all contracts deployed by Arc.js.
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
    schemes: Array<ArcContractInfo>;
    /**
     * All deployed voting machines
     */
    votingMachines: Array<ArcContractInfo>;
    /**
     * All deployed global constraints
     */
    globalConstraints: Array<ArcContractInfo>;
  }

  /********************************
   * Config
   */
  export class Config { public static get(key: string): any; public static set(key: string, value: any): void; }

  /********************************
   * contracts
   */
  export class Contracts {
    public static getDeployedContracts(): ArcDeployedContracts;
    /**
     * Returns an Arc.js scheme wrapper, or undefined if not found
     * @param contract - name of an Arc scheme, like "SchemeRegistrar"
     * @param address - optional
     */
    public static getScheme(contract: string, address?: string): Promise<ExtendTruffleScheme | undefined>;
  }

  /********************************
   * utils
   */

  export class Utils {
    /**
     * Returns TruffleContract given the name of the contract (like "SchemeRegistrar"), or undefined
     * if not found or any other error occurs.
     * @param contractName like "SchemeRegistrar"
     */
    public static requireContract(
      contractName: string
    ): any;

    public static getWeb3(): Web3;

    public static getValueFromLogs(
      tx: TransactionReceiptTruffle,
      arg: string,
      eventName?: string,
      index?: number
    ): string;

    public static getDefaultAccount(): any;
  }

  /********************************
  * ExtendTruffleContract
  */
  export interface TransactionLog {
    address: string;
    blockHash: string;
    blockNumber: number;
    data: string;
    logIndex: number;
    topics: Array<string>;
    transactionHash: string;
    transactionIndex: number;
    type: string;
  }

  export interface TransactionLogTruffle {
    address: string;
    args: any;
    blockHash: string;
    blockNumber: number;
    event: string;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    type: string;
  }

  export interface TransactionReceiptTruffle {
    transactionHash: string;
    logs: Array<TransactionLogTruffle>;
    receipt: TransactionReceipt;
    /**
     * address of the transaction
     */
    tx: string;
  }

  export class ExtendTruffleContract {
    /**
     * Instantiate the class.  This will migrate a new instance of the contract to the net.
     */
    public static new(): any;
    /**
     * Instantiate the class as it was migrated to the given address on
     * the current network.
     * @param address
     */
    public static at(address: string): any;
    /**
     * Instantiate the class as it was migrated by Arc.js on the given network.
     */
    public static deployed(): any;
    /**
     * The underlying truffle contract object
     */
    public contract: any;
    /**
     * the address of the deployed contract
     */
    public address: string;
    /**
     * Call setParameters on this contract.
     * Returns promise of ArcTransactionDataResult<Hash> where Result is the parameters hash.
     * @param {Promise<ArcTransactionDataResult<Hash>>} params -- object with properties
     * whose names are expected by the scheme to correspond to parameters.
     * Currently all params are required, contract wrappers do not as yet apply default values.
     */
    public setParams(params: any): Promise<ArcTransactionDataResult<Hash>>;
  }

  export class ExtendTruffleScheme extends ExtendTruffleContract {
    /**
     * Returns a string containing an 8-digit hex number representing the minimum
     * permissions that the scheme may have, as follows:
     *
     * 1st bit: Scheme is registered (a scheme always gets this bit when registered to a DAO)
     * 2nd bit: Scheme can register other schemes
     * 3th bit: Scheme can add/remove global constraints
     * 4rd bit: Scheme can upgrade the controller
     *
     * Example:  "0x00000003" has the 1st and 2nd bits set.
     */
    public getDefaultPermissions(overrideValue?: string): string;
  }

  export type Hash = string;
  export type Address = string;

  export type EventCallback<TArgs> =
    (
      err: Error,
      result: Array<DecodedLogEntryEvent<TArgs>>
    ) => void;

  interface TransactionReceipt {
    blockHash: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    from: string;
    to: string;
    status: null | string | 0 | 1;
    cumulativeGasUsed: number;
    gasUsed: number;
    contractAddress: string | null;
    logs: Array<LogEntry>;
  }

  /**
   * The generic type of every handler function that returns an event.  See this
   * web3 documentation article for more information:
   * https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events
   *
   * argsFilter - contains the return values by which you want to filter the logs, e.g.
   * {'valueA': 1, 'valueB': [myFirstAddress, mySecondAddress]}
   * By default all filter  values are set to null which means that they will match
   * any event of given type sent from this contract.  Default is {}.
   *
   * filterObject - Additional filter options.  Typically something like { from: "latest" }.
   *
   * callback - (optional) If you pass a callback it will immediately
   * start watching.  Otherwise you will need to call .get or .watch.
   */
  export type EventFetcherFactory<TArgs> =
    (
      argFilter: any,
      filterObject: FilterObject,
      callback?: EventCallback<TArgs>
    ) => EventFetcher<TArgs>;

  export type EventFetcherHandler<TArgs> =
    (
      callback: EventCallback<TArgs>
    ) => void;

  /**
   * returned by EventFetcherFactory<TArgs> which is created by eventWrapperFactory.
   */
  export interface EventFetcher<TArgs> {
    get: EventFetcherHandler<TArgs>;
    watch: EventFetcherHandler<TArgs>;
    stopWatching(): void;
  }

  type LogTopic = null | string | Array<string>;

  interface FilterObject {
    fromBlock?: number | string;
    toBlock?: number | string;
    address?: string;
    topics?: Array<LogTopic>;
  }

  interface LogEntry {
    logIndex: number | null;
    transactionIndex: number | null;
    transactionHash: string;
    blockHash: string | null;
    blockNumber: number | null;
    address: string;
    data: string;
    topics: Array<string>;
  }

  interface LogEntryEvent extends LogEntry {
    removed: boolean;
  }

  interface DecodedLogEntry<TArgs> extends LogEntryEvent {
    event: string;
    args: TArgs;
  }

  interface DecodedLogEntryEvent<TArgs> extends DecodedLogEntry<TArgs> {
    removed: boolean;
  }

  /*******************
   * common event result interfaces
   */
  export interface NewProposalEventResult {
    _numOfChoices: number;
    _paramsHash: Hash;
    /**
     * indexed
     */
    _proposalId: Hash;
    _proposer: Address;
  }

  /**
   * fired by voting machines
   */
  export interface ExecuteProposalEventResult {
    _decision: number;
    /**
     * indexed
     */
    _proposalId: Hash;
  }

  export interface VoteProposalEventResult {
    /**
     * indexed
     */
    _proposalId: Hash;
    _reputation: BigNumber.BigNumber;
    _vote: number;
    /**
     * indexed
     */
    _voter: Address;
  }

  export interface RedeemReputationEventResult {
    _amount: BigNumber.BigNumber;
    /**
     * indexed
     */
    _avatar: Address;
    /**
     * indexed
     */
    _beneficiary: Address;
    /**
     * indexed
     */
    _proposalId: Hash;
  }

  export interface ProposalDeletedEventResult {
    /**
     * indexed
     */
    _avatar: Address;
    /**
     * indexed
     */
    _proposalId: Hash;
  }

  /**
   * fired by schemes
   */
  export interface ProposalExecutedEventResult {
    /**
     * indexed
     */
    _avatar: Address;
    _param: number;
    /**
     * indexed
     */
    _proposalId: Hash;
  }

  export interface StandardSchemeParams {
    voteParametersHash: string;
    votingMachine: string; // address
  }

  /********************************
   * AbsoluteVote
   */
  export interface CancelProposalEventResult {
    /**
     * indexed
     */
    _proposalId: Hash;
  }

  export interface CancelVotingEventResult {
    /**
     * indexed
     */
    _proposalId: Hash;
    _voter: Address;
  }

  export interface AbsoluteVoteParams {
    ownerVote?: boolean;
    reputation: string;
    votePerc?: number;
  }

  export class AbsoluteVote extends ExtendTruffleScheme {
    public static new(): AbsoluteVote;
    public static at(address: string): AbsoluteVote;
    public static deployed(): AbsoluteVote;

    public NewProposal: EventFetcherFactory<NewProposalEventResult>;
    public CancelProposal: EventFetcherFactory<CancelProposalEventResult>;
    public ExecuteProposal: EventFetcherFactory<ExecuteProposalEventResult>;
    public VoteProposal: EventFetcherFactory<VoteProposalEventResult>;
    public CancelVoting: EventFetcherFactory<CancelVotingEventResult>;

    public vote(options: VoteConfig): Promise<ArcTransactionResult>;
    public setParams(params: AbsoluteVoteParams): Promise<ArcTransactionDataResult<Hash>>;
  }

  /********************************
   * DaoCreator
   */
  export interface FounderConfig {
    /**
     * Founders' address
     */
    address: string;
    /**
     * string | BigNumber array of token amounts to be awarded to each founder.
     * Should be given in Wei.
     */
    tokens: string | BigNumber.BigNumber;
    /**
     * string | BigNumber array of reputation amounts to be awarded to each founder.
     * Should be given in Wei.
     */
    reputation: string | BigNumber.BigNumber;
  }

  export interface NewDaoVotingMachineConfig {
    /**
     * Optional Reputation address.
     * Default is the new DAO's native reputation.
     */
    reputation?: string;
    /**
     * Optional VotingMachine name
     * Default is AbsoluteVote
     */
    votingMachineName?: string;
    /**
     * Optional VotingMachine address
     * Default is that of AbsoluteVote
     */
    votingMachine?: string;
    /**
     * You can add your voting-machine-specific parameters here, like ownerVote, votePerc, etc
     */
    [x: string]: any;
  }

  /**
   * options for DaoCreator.forgeOrg
   */
  export interface ForgeOrgConfig {
    /**
     * The name of the new DAO.
     */
    name: string;
    /**
     * The name of the token to be associated with the DAO
     */
    tokenName: string;
    /**
     * The symbol of the token to be associated with the DAO
     */
    tokenSymbol: string;
    /**
     * Optional array describing founders.
     * Default is [].
     */
    founders: Array<FounderConfig>;
    /**
     * true to use the UniversalController contract, false to instantiate and use a new Controller contract.
     * The default is true.
     */
    universalController?: boolean;
  }

  /**
   * Configuration of an Arc scheme that you want to automatically register with a new DAO.
   */
  export interface SchemeConfig {
    /**
     * The name of the Arc scheme.  It must be an Arc scheme.
     */
    name: string;
    /**
     * Scheme address if you don't want to use the scheme supplied in this release of Arc.js.
     */
    address?: string;
    /**
     * Extra permissions on the scheme.  The minimum permissions for the scheme
     * will be enforced (or'd with anything you supply).
     * See ExtendTruffleContract.getDefaultPermissions for what this string
     * should look like.
     */
    permissions?: string;
    /**
     * Optional votingMachine parameters if you have not supplied them in NewDaoConfig or want to override them.
     * Note it costs more gas to add them here.
     *
     * New schemes will be created with these parameters and the DAO's native reputation contract.
     *
     * Defaults are the Arc.js-deployed AbsoluteVote, the Arc.js-deployed Reputation, votePerc 50%, ownerVote true
     */
    votingMachineParams?: NewDaoVotingMachineConfig;
    /**
     * Other scheme parameters, any params besides those already provided in votingMachineParams.
     * For example, ContributionReward requires orgNativeTokenFee.
     *
     * Default is {}
     */
    additionalParams?: any;
  }

  export interface SchemesConfig {
    /**
     * default votingMachine parameters if you have not configured a scheme that you want to register with the
     * new DAO with its own voting parameters.
     *
     * New schemes will be created these parameters.
     *
     * Defaults are described in NewDaoVotingMachineConfig.
     */
    votingMachineParams?: NewDaoVotingMachineConfig;
    /**
     * Any Arc schemes you would like to automatically register with the new DAO.
     * Non-Arc schemes are not allowed here.  You may add them later in your application's workflow
     * using SchemeRegistrar.
     */
    schemes?: Array<SchemeConfig>;
  }

  export interface SetSchemesConfig extends SchemesConfig {
    /**
     * avatar address
     */
    avatar: string;
  }

  export interface NewOrgEventResult {
    _avatar: Address;
  }
  export interface InitialSchemesSetEventResult {
    _avatar: Address;
  }

  export class DaoCreator extends ExtendTruffleScheme {
    public static new(): DaoCreator;
    public static at(address: string): DaoCreator;
    public static deployed(): DaoCreator;
    public NewOrg: EventFetcherFactory<NewOrgEventResult>;
    public InitialSchemesSet: EventFetcherFactory<InitialSchemesSetEventResult>;
    /**
     * Create a new DAO
     * @param {ForgeOrgConfig} options
     */
    public forgeOrg(options: ForgeOrgConfig): Promise<ArcTransactionResult>;
    /**
     * Register schemes with newly-created DAO.
     * Can only be invoked by the agent that created the DAO
     * via forgeOrg, and at that, can only be called one time.
     * @param {SetSchemesConfig} options
     */
    public setSchemes(options: SetSchemesConfig): Promise<ArcTransactionResult>;
  }

  /********************************
    * DAO
    */
  export interface NewDaoConfig extends ForgeOrgConfig {
    /**
     * The DaoCreator to use.  Default is the DaoCreator supplied in this release of Arc.js.
     */
    daoCreator?: string;
  }

  /**
   * Returned from DAO.getSchemes
   */
  export interface DaoSchemeInfo {
    /**
     * Arc scheme name.  Will be undefined if not an Arc scheme.
     */
    name?: string;
    /**
     * Scheme address
     */
    address: string;
    /**
     * The scheme's permissions.
     * See ExtendTruffleContract.getDefaultPermissions for what this string
     * looks like.
     */
    permissions: string;
  }

  /********************************
   * Returned from DAO.getGlobalConstraints
   */
  export interface DaoGlobalConstraintInfo {
    name: string;
    address: string;
    paramsHash: string;
  }

  export class DAO {
    /**
     * Migrate a new DAO to the current network, returning the corresponding DAO instance.
     * @param options
     */
    public static new(options: NewDaoConfig & SchemesConfig): Promise<DAO>;

    /**
     * Return an instance of DAO representing the migrated DAO at the given address
     * @param avatarAddress
     */
    public static at(avatarAddress: string): Promise<DAO>;
    /**
     * Returns promise of the DAOstack Genesis avatar address, or undefined if not found
     * @param daoCreatorAddress - Optional address of DaoCreator to use
     */
    public static getGenesisDao(daoCreatorAddress?: string): Promise<string | undefined>;
    /**
     * Avatar truffle contract
     */
    public avatar: any;
    /**
     * Controller truffle contract
     */
    public controller: any;
    /**
     * DAOToken truffle contract
     */
    public token: any;
    /**
     * Reputation truffle contract
     */
    public reputation: any;
    /**
     * has a universal Controller
     */
    public hasUController: boolean;
    /**
     * returns schemes currently registered into this DAO, as Array<DaoSchemeInfo>
     * @param contractName like "SchemeRegistrar"
     */
    public getSchemes(contractName?: string): Promise<Array<DaoSchemeInfo>>;
    /**
     * Returns global constraints currently registered into this DAO, as Array<DaoGlobalConstraintInfo>
     * @param contractName like "TokenCapGC"
     */
    public getGlobalConstraints(contractName?: string): Promise<Array<DaoGlobalConstraintInfo>>;
    /**
     * Returns an Arc.js scheme wrapper, or undefined if not found
     * @param contract - name of an Arc scheme, like "SchemeRegistrar"
     * @param address - optional
     */
    public getScheme(
      contractName: string,
      address?: string
    ): Promise<ExtendTruffleScheme | undefined>;

    /**
     * returns whether the scheme with the given address is registered to this DAO's controller
     */
    public isSchemeRegistered(schemeAddress: string): Promise<boolean>;
    /**
     * The DAO name, from the Avatar
     */
    public getName(): Promise<string>;

    /**
     * The native token name
     */
    public getTokenName(): Promise<string>;

    /**
     * The native token symbol
     */
    public getTokenSymbol(): Promise<string>;
    /**
     * Given a scheme wrapper, returns an array of the scheme's parameter values.
     * The order of values in the array corresponds to the
     * order in which they are defined in the structure in which they
     * are stored in the scheme contract.
     * @param {string} schemeAddress
     */
    public getSchemeParameters(scheme: ExtendTruffleContract): Promise<Array<any>>;
  }

  /********************************
   * GlobalConstraintRegistrar
   */
  export interface ProposeToAddModifyGlobalConstraintParams {
    /**
     * avatar address
     */
    avatar: string;
    /**
     *  the address of the global constraint to add
     */
    globalConstraint: string;
    /**
     * hash of the parameters of the global contraint
     */
    globalConstraintParametersHash: string;
    /**
     * voting machine to use when voting to remove the global constraint
     */
    votingMachineHash: string;
  }

  export interface ProposeToRemoveGlobalConstraintParams {
    /**
     * avatar address
     */
    avatar: string;
    /**
     *  the address of the global constraint to remove
     */
    globalConstraint: string;
  }

  export interface NewGlobalConstraintsProposalEventResult {
    /**
     * indexed
     */
    _avatar: Address;
    /**
     * indexed
     */
    _intVoteInterface: Address;
    _gc: Address;
    _params: Hash;
    /**
     * indexed
     */
    _proposalId: Hash;
    _voteToRemoveParams: Hash;
  }

  export interface RemoveGlobalConstraintsProposalEventResult {
    /**
     * indexed
     */
    _avatar: Address;
    _gc: Address;
    /**
     * indexed
     */
    _intVoteInterface: Address;
    /**
     * indexed
     */
    _proposalId: Hash;
  }

  export class GlobalConstraintRegistrar extends ExtendTruffleScheme {
    public static new(): GlobalConstraintRegistrar;

    public static at(address: string): GlobalConstraintRegistrar;
    public static deployed(): GlobalConstraintRegistrar;
    public NewGlobalConstraintsProposal: EventFetcherFactory<NewGlobalConstraintsProposalEventResult>;
    public RemoveGlobalConstraintsProposal: EventFetcherFactory<RemoveGlobalConstraintsProposalEventResult>;
    public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult>;
    public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult>;

    /**
     *  propose to add or modify a global constraint
     * @param options ProposeToAddModifyGlobalConstraintParams
     */
    public proposeToAddModifyGlobalConstraint(
      options: ProposeToAddModifyGlobalConstraintParams
    ): Promise<ArcTransactionProposalResult>;
    /**
     * propose to remove a global constraint
     * @param options ProposeToRemoveGlobalConstraintParams
     */
    public proposeToRemoveGlobalConstraint(
      options: ProposeToRemoveGlobalConstraintParams
    ): Promise<ArcTransactionProposalResult>;

    public setParams(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>>;
  }

  /********************************
   * SchemeRegistrar
   */
  export interface ProposeToAddModifySchemeParams {
    /**
     * avatar address
     */
    avatar: string;
    /**
     * scheme address
     */
    scheme: string;
    /**
     * scheme identifier, like "SchemeRegistrar" or "ContributionReward".
     * pass null if registering a non-arc scheme
     */
    schemeName?: string | null;
    /**
     * hash of scheme parameters. These must be already registered with the new scheme.
     */
    schemeParametersHash: string;
    /**
     * true if the given scheme is able to register/unregister/modify schemes.
     *
     * isRegistering should only be supplied when schemeName is not given (and thus the scheme is non-Arc).
     * Otherwise we determine its value based on scheme and schemeName.
     */
    isRegistering?: boolean | null;
  }

  export interface ProposeToRemoveSchemeParams {
    /**
     * avatar address
     */
    avatar: string;
    /**
     *  the address of the global constraint to remove
     */
    scheme: string;
  }

  export interface NewSchemeProposalEventResult {
    /**
     * indexed
     */
    _avatar: Address;
    /**
     * indexed
     */
    _intVoteInterface: Address;
    _isRegistering: boolean;
    _parametersHash: Hash;
    /**
     * indexed
     */
    _proposalId: Hash;
    _scheme: Address;
  }

  export interface RemoveSchemeProposalEventResult {
    /**
     * indexed
     */
    _avatar: Address;
    /**
     * indexed
     */
    _intVoteInterface: Address;
    /**
     * indexed
     */
    _proposalId: Hash;
    _scheme: Address;
  }

  export class SchemeRegistrar extends ExtendTruffleScheme {
    public static new(): SchemeRegistrar;
    public static at(address: string): SchemeRegistrar;
    public static deployed(): SchemeRegistrar;
    public NewSchemeProposal: EventFetcherFactory<NewSchemeProposalEventResult>;
    public RemoveSchemeProposal: EventFetcherFactory<RemoveSchemeProposalEventResult>;
    public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult>;
    public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult>;
    /**
     *  propose to add or modify a scheme
     * @param options ProposeToAddModifySchemeParams
     */
    public proposeToAddModifyScheme(
      options: ProposeToAddModifySchemeParams
    ): Promise<ArcTransactionProposalResult>;
    /**
     * propose to remove a scheme
     * @param options ProposeToRemoveSchemeParams
     */
    public proposeToRemoveScheme(
      options: ProposeToRemoveSchemeParams
    ): Promise<ArcTransactionProposalResult>;

    public setParams(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>>;
  }

  /********************************
   * UpgradeScheme
   */
  export interface ProposeUpgradingSchemeParams {
    /**
     * avatar address
     */
    avatar: string;
    /**
     *  upgrading scheme address
     */
    scheme: string;
    /**
     * hash of the parameters of the upgrading scheme. These must be already registered with the new scheme.
     */
    schemeParametersHash: string;
  }

  export interface ProposeControllerParams {
    /**
     * avatar address
     */
    avatar: string;
    /**
     *  controller address
     */
    controller: string;
  }

  export interface NewUpgradeProposalEventResult {
    /**
     * indexed
     */
    _avatar: Address;
    /**
     * indexed
     */
    _intVoteInterface: Address;
    _newController: Address;
    /**
     * indexed
     */
    _proposalId: Hash;
  }

  export interface ChangeUpgradeSchemeProposalEventResult {
    /**
     * indexed
     */
    _avatar: Address;
    /**
     * indexed
     */
    _intVoteInterface: Address;
    _params: Hash;
    /**
     * indexed
     */
    _proposalId: Hash;
    newUpgradeScheme: Address;
  }

  export class UpgradeScheme extends ExtendTruffleScheme {
    public static new(): UpgradeScheme;
    public static at(address: string): UpgradeScheme;
    public static deployed(): UpgradeScheme;
    public NewUpgradeProposal: EventFetcherFactory<NewUpgradeProposalEventResult>;
    public ChangeUpgradeSchemeProposal: EventFetcherFactory<ChangeUpgradeSchemeProposalEventResult>;
    public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult>;
    public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult>;
    /**
     * propose to replace this UpgradingScheme
     * @param options ProposeUpgradingSchemeParams
     */
    public proposeUpgradingScheme(
      options: ProposeUpgradingSchemeParams
    ): Promise<ArcTransactionProposalResult>;
    /**
     * propose to replace this DAO's controller
     * @param options ProposeControllerParams
     */
    public proposeController(
      options: ProposeControllerParams
    ): Promise<ArcTransactionProposalResult>;

    public setParams(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>>;
  }

  /********************************
   * ContributionReward
   */
  export interface ContributionRewardParams extends StandardSchemeParams {
    orgNativeTokenFee: BigNumber.BigNumber | string;
  }

  export interface ProposeContributionParams {
    /**
     * avatar address
     */
    avatar: string;
    /**
     * description of the constraint
     */
    description: string;
    /**
     * Amount of reputation change requested, per period.
     * Can be negative.  In Wei. Default is 0;
     */
    reputationChange?: BigNumber.BigNumber | string;
    /**
     * Reward in tokens per period, in the DAO's native token.
     * Must be >= 0.
     * In Wei. Default is 0;
     */
    nativeTokenReward?: BigNumber.BigNumber | string;
    /**
     * Reward per period, in ethers.
     * Must be >= 0.
     * In Wei. Default is 0;
     */
    ethReward?: BigNumber.BigNumber | string;
    /**
     * Reward per period in the given external token.
     * Must be >= 0.
     * In Wei. Default is 0;
     */
    externalTokenReward?: BigNumber.BigNumber | string;
    /**
     * The number of blocks in a period.
     * Must be > 0.
     */
    periodLength: number;
    /**
     * Maximum number of periods that can be paid out.
     * Must be > 0.
     */
    numberOfPeriods: number;
    /**
     * The address of the external token (for externalTokenReward)
     * Only required when externalTokenReward is non-zero.
     */
    externalToken?: string;
    /**
     *  beneficiary address
     */
    beneficiary: string;
  }

  export interface ContributionRewardRedeemResult {
    /**
     * true if reputation changed
     */
    reputation: boolean;
    /**
     * true if native tokens were rewarded
     */
    nativeTokens: boolean;
    /**
     * true if ethers were rewarded
     */
    ethers: boolean;
    /**
     * true if external tokens were rewarded
     */
    externalTokens: boolean;
  }

  export interface ContributionRewardRedeemParams {
    /**
     * The reward proposal
     */
    proposalId: string;
    /**
     * The avatar under which the proposal was made
     */
    avatar: string;
    /**
     * true to credit/debit reputation
     * Default is false
     */
    reputation?: boolean;
    /**
     * true to reward native tokens
     * Default is false
     */
    nativeTokens?: boolean;
    /**
     * true to reward ethers
     * Default is false
     */
    ethers?: boolean;
    /**
     * true to reward external tokens
     * Default is false
     */
    externalTokens?: boolean;
  }

  export interface NewContributionProposalEventResult {
    /**
     * indexed
     */
    _avatar: Address;
    _beneficiary: Address;
    _contributionDescription: Hash;
    _externalToken: Address;
    /**
     * indexed
     */
    _intVoteInterface: Address;
    /**
     * indexed
     */
    _proposalId: Hash;
    _reputationChange: BigNumber.BigNumber;
    _rewards: Array<BigNumber.BigNumber>;
  }

  export interface RedeemEtherEventResult {
    _amount: BigNumber.BigNumber;
    /**
     * indexed
     */
    _avatar: Address;
    /**
     * indexed
     */
    _beneficiary: Address;
    /**
     * indexed
     */
    _proposalId: Hash;
  }

  export interface RedeemNativeTokenEventResult {
    _amount: BigNumber.BigNumber;
    /**
     * indexed
     */
    _avatar: Address;
    /**
     * indexed
     */
    _beneficiary: Address;
    /**
     * indexed
     */
    _proposalId: Hash;
  }

  export interface RedeemExternalTokenEventResult {
    _amount: BigNumber.BigNumber;
    /**
     * indexed
     */
    _avatar: Address;
    /**
     * indexed
     */
    _beneficiary: Address;
    /**
     * indexed
     */
    _proposalId: Hash;
  }

  export interface ContributionRewardSpecifiedRedemptionParams {
    /**
     * The avatar under which the proposal was made
     */
    avatar: string;
    /**
     * The reward proposal
     */
    proposalId: string;
  }

  export interface ContributionProposal {
    beneficiary: string;
    contributionDescriptionHash: string;
    ethReward: BigNumber.BigNumber;
    executionTime: number;
    externalToken: string;
    externalTokenReward: BigNumber.BigNumber;
    nativeTokenReward: BigNumber.BigNumber;
    numberOfPeriods: number;
    periodLength: number;
    proposalId: Hash;
    redeemedPeriods: Array<number>;
    reputationChange: BigNumber.BigNumber;
  }

  export interface ProposalRewards {
    ethReward: BigNumber.BigNumber;
    ethUnredeemedReward: BigNumber.BigNumber;
    externalTokenReward: BigNumber.BigNumber;
    externalUnredeemedTokenReward: BigNumber.BigNumber;
    nativeTokenReward: BigNumber.BigNumber;
    nativeUnredeemedTokenReward: BigNumber.BigNumber;
    proposalId: Hash;
    reputationChange: BigNumber.BigNumber;
    reputationUnredeemedChange: BigNumber.BigNumber;
  }

  export interface GetDaoProposalsParams {
    /**
     * The avatar under which the proposals were created
     */
    avatar: string;
    /**
     * Optionally filter on the given proposalId
     */
    proposalId?: string;
  }

  export interface GetBeneficiaryRewards {
    /**
     * The avatar under which the proposals were created
     */
    avatar: string;
    /**
     * The agent who is to receive the rewards
     */
    beneficiary: string;
    /**
     * Optionally filter on the given proposalId
     */
    proposalId?: string;
  }

  export class ContributionReward extends ExtendTruffleScheme {
    public static new(): ContributionReward;
    public static at(address: string): ContributionReward;
    public static deployed(): ContributionReward;
    public NewContributionProposal: EventFetcherFactory<NewContributionProposalEventResult>;
    public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult>;
    public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult>;
    public RedeemReputation: EventFetcherFactory<RedeemReputationEventResult>;
    public RedeemEther: EventFetcherFactory<RedeemEtherEventResult>;
    public RedeemNativeToken: EventFetcherFactory<RedeemNativeTokenEventResult>;
    public RedeemExternalToken: EventFetcherFactory<RedeemExternalTokenEventResult>;
    /**
     * propose to make a contribution
     * @param options ProposeContributionParams
     */
    public proposeContributionReward(
      options: ProposeContributionParams
    ): Promise<ArcTransactionProposalResult>;

    /**
     * Redeem reward for proposal
     */
    public redeemContributionReward(options: ContributionRewardRedeemParams): Promise<ArcTransactionResult>;
    public redeemNativeToken(options: ContributionRewardSpecifiedRedemptionParams): Promise<ArcTransactionResult>;
    public redeemEther(options: ContributionRewardSpecifiedRedemptionParams): Promise<ArcTransactionResult>;
    public redeemReputation(options: ContributionRewardSpecifiedRedemptionParams): Promise<ArcTransactionResult>;
    public redeemExternalToken(options: ContributionRewardSpecifiedRedemptionParams): Promise<ArcTransactionResult>;

    public getDaoProposals(options: GetDaoProposalsParams): Promise<Array<ContributionProposal>>;
    public getBeneficiaryRewards(options: GetBeneficiaryRewards): Promise<Array<ProposalRewards>>;

    public setParams(params: ContributionRewardParams): Promise<ArcTransactionDataResult<Hash>>;
  }

  /********************************
   * VestingScheme
   */
  export interface CommonVestingAgreementConfig {
    /**
     * Address of the recipient of the proposed agreement.
     */
    beneficiary: string;
    /**
     * Where to send the tokens in case of cancellation
     */
    returnOnCancelAddress: string;
    /**
     * Optional ethereum block number at which the agreement starts.
     * Default is the current block number.
     * Must be greater than or equal to zero.
     */
    startingBlock: number;
    /**
     * The number of tokens to pay per period.
     * Period is calculated as (number of blocks / periodLength).
     * Should be expressed in Wei.
     * Must be greater than zero.
     */
    amountPerPeriod: BigNumber.BigNumber | string;
    /**
     * number of blocks in a period.
     * Must be greater than zero.
     */
    periodLength: number;
    /**
     * maximum number of periods that can be paid out.
     * Must be greater than zero.
     */
    numOfAgreedPeriods: number;
    /**
     * The minimum number of periods that must pass before the beneficiary
     * may collect tokens under the agreement.
     * Must be greater than or equal to zero.
     */
    cliffInPeriods: number;
    /**
     * The number of signatures required to cancel agreement.
     * See signToCancel.
     */
    signaturesReqToCancel: number;
    /**
     * An array of addresses of those who will be allowed to sign to cancel an agreement.
     * The length of this array must be greater than or equal to signaturesReqToCancel.
     */
    signers: Array<string>;
  }

  export interface CreateVestingAgreementConfig extends CommonVestingAgreementConfig {
    /**
     * The address of the token that will be used to pay for the creation of the agreement.
     * The caller (msg.Sender) must have the funds to pay in that token.
     */
    token: string;
  }

  export interface ProposeVestingAgreementConfig extends CommonVestingAgreementConfig {
    /**
     * The address of the avatar in which the proposal is being be made.
     */
    avatar: string;
  }

  export interface SignToCancelVestingAgreementConfig {
    /**
     * the agreementId
     */
    agreementId: number;
  }

  export interface RevokeSignToCancelVestingAgreementConfig {
    /**
     * the agreementId
     */
    agreementId: number;
  }

  export interface CollectVestingAgreementConfig {
    /**
     * the agreementId
     */
    agreementId: number;
  }

  export interface AgreementProposalEventResult {
    /**
     * indexed
     */
    _avatar: Address;
    _proposalId: Hash;
  }

  export interface NewVestedAgreementEventResult {
    /**
     * indexed
     */
    _agreementId: BigNumber.BigNumber;
  }

  export interface SignToCancelAgreementEventResult {
    /**
     * indexed
     */
    _agreementId: BigNumber.BigNumber;
    /**
     * indexed
     */
    _signer: Address;
  }

  export interface RevokeSignToCancelAgreementEventResult {
    /**
     * indexed
     */
    _agreementId: BigNumber.BigNumber;
    /**
     * indexed
     */
    _signer: Address;
  }

  export interface AgreementCancelEventResult {
    /**
     * indexed
     */
    _agreementId: BigNumber.BigNumber;
  }

  export interface CollectEventResult {
    /**
     * indexed
     */
    _agreementId: BigNumber.BigNumber;
  }

  export class VestingScheme extends ExtendTruffleScheme {
    public static new(): VestingScheme;
    public static at(address: string): VestingScheme;
    public static deployed(): VestingScheme;
    public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult>;
    public AgreementProposal: EventFetcherFactory<AgreementProposalEventResult>;
    public NewVestedAgreement: EventFetcherFactory<NewVestedAgreementEventResult>;
    public SignToCancelAgreement: EventFetcherFactory<SignToCancelAgreementEventResult>;
    public RevokeSignToCancelAgreement: EventFetcherFactory<RevokeSignToCancelAgreementEventResult>;
    public AgreementCancel: EventFetcherFactory<AgreementCancelEventResult>;
    public Collect: EventFetcherFactory<CollectEventResult>;
    /**
     * Propose a new vesting agreement. The required funds will be minted to the vesting scheme on approval of the proposal.
     * @param {ProposeVestingAgreementConfig} options
     */
    public propose(options: ProposeVestingAgreementConfig): Promise<ArcTransactionProposalResult>;
    /**
     * Create a new vesting agreement, without a vote.
     * The caller (msg.Sender) pays the vesting scheme for the creation of the agreement.
     * @param {CreateVestingAgreementConfig} options
     */
    public create(options: CreateVestingAgreementConfig): Promise<ArcTransactionAgreementResult>;
    /**
     * Sign to cancel a vesting agreement.
     * @param {SignToCancelVestingAgreementConfig} options
     */
    public signToCancel(options: SignToCancelVestingAgreementConfig): Promise<ArcTransactionResult>;
    /**
     * Revoke vote for cancelling a vesting agreement
     * @param {RevokeSignToCancelVestingAgreementConfig} options
     */
    public revokeSignToCancel(options: RevokeSignToCancelVestingAgreementConfig): Promise<ArcTransactionResult>;
    /**
     * Collects for a beneficiary, according to the agreement
     * The caller (msg.Sender) pays the beneficiary the accrued amount of tokens.
     * @param {CollectVestingAgreementConfig} options
     */
    public collect(options: CollectVestingAgreementConfig): Promise<ArcTransactionResult>;

    public setParams(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>>;
  }

  /********************************
   * VoteInOrganizationScheme
   */
  export interface VoteInOrganizationProposeVoteConfig {
    /**
     * Avatar whose voters are being given the chance to vote on the original proposal.
     */
    avatar: string;
    /**
     * Address of the voting machine used by the original proposal.  The voting machine must
     * implement IntVoteInterface (as defined in Arc).
     */
    originalIntVote: string;
    /**
     * Address of the "original" proposal for which the DAO's vote will cast.
     */
    originalProposalId: string;
  }

  export interface VoteOnBehalfEventResult {
    _params: Array<Hash>;
  }

  export class VoteInOrganizationScheme extends ExtendTruffleScheme {
    public static new(): VoteInOrganizationScheme;
    public static at(address: string): VoteInOrganizationScheme;
    public static deployed(): VoteInOrganizationScheme;
    public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult>;
    public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult>;
    public VoteOnBehalf: EventFetcherFactory<VoteOnBehalfEventResult>;
    /**
     * Create a proposal whose choices look just like a proposal from another DAO.
     * When the vote on this proposal is concluded, the result is sent to the
     * "original" voting machine.
     *
     * This new proposal is thus effectively a proxy for the "original" proposal created
     * by another DAO, but this DAO only gets one vote in the original.
     *
     * @param {VoteInOrganizationProposeVoteConfig} opts
     */
    public proposeVote(options: VoteInOrganizationProposeVoteConfig): Promise<ArcTransactionProposalResult>;

    public setParams(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>>;
  }

  /*******************
   * GenesisProtocol
   */
  export interface GenesisProtocolParams {
    /**
     * the absolute vote percentages bar
     * Must be greater than zero.
     * Default is 50.
     */
    preBoostedVoteRequiredPercentage: number;
    /**
     * the time limit for a proposal to be in an absolute voting mode.
     * TODO: Units? Default?
     * Default is 60.
     */
    preBoostedVotePeriodLimit: number;
    /**
     * the time limit for a proposal to be in an relative voting mode.
     * TODO: Units? Default?
     * Default is 60.
     */
    boostedVotePeriodLimit: number;
    /**
     * TODO: Purpose?
     * Default is 1
     */
    thresholdConstA: number;
    /**
     * TODO: Purpose?
     * Default is 1
     */
    thresholdConstB: number;
    /**
     * GenesisProtocolFormulasInterface address
     */
    governanceFormulasInterface?: string;
    /**
     * Default is 0
     */
    minimumStakingFee: number;
    /**
     * TODO: Purpose?
     * Default is 0
     */
    quietEndingPeriod: number;
    /**
     * TODO: Purpose?
     * Default is 1
     */
    proposingRepRewardConstA: number;
    /**
     * TODO: Purpose?
     * Default is 1
     */
    proposingRepRewardConstB: number;
    /**
     * a value between 0-100
     * TODO: Purpose?
     * Default is 1 (?)
     */
    stakerFeeRatioForVoters: number;
    /**
     * a value between 0-100
     * TODO: Purpose?
     * Default is 10
     */
    votersReputationLossRatio: number;
    /**
     * a value between 0-100
     * TODO: Purpose?
     * Default is 80
     */
    votersGainRepRatioFromLostRep: number;
  }

  /**
   * Javascript version of the Arc ExecutableInterface,
   * for information purposes.
   */
  export interface ExecutableInterface {
    execute(proposalId: number, avatar: string, vote: number): Promise<boolean>;
  }

  export interface ProposeVoteConfig {
    /**
     * The DAO's avatar under which the proposal is being made.
     */
    avatar: string;
    /**
     * address of the agent making the proposal.
     * Default is the current default account.
     */
    proposer: string;
    /**
     * number of choices when voting.  Must be between 1 and 10.
     */
    numOfChoices: number;
    /**
     * GenesisProtocol parameters to apply to this proposal
     */
    paramsHash: string;
    /**
     * contract that implements ExecutableInterface to invoke if/when the vote passes
     */
    executable: string;
  }

  export interface GetVoterInfoResult {
    vote: number;
    reputation: BigNumber.BigNumber;
  }

  export interface GetProposalStatusResult {
    totalVotes: BigNumber.BigNumber;
    totalStakes: BigNumber.BigNumber;
    votersStakes: BigNumber.BigNumber;
  }

  export interface GetScoreThresholdParamsResult {
    thresholdConstA: number;
    thresholdConstB: number;
  }

  export interface GetStakerInfoResult {
    vote: number;
    stake: BigNumber.BigNumber;
  }

  export interface StakeConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
    /**
     * the choice of vote. Can be 1 (YES) or 2 (NO).
     */
    vote: number;
    /**
     * token amount to stake on the outcome resulting in this vote, in Wei
     */
    amount: BigNumber.BigNumber | string;
  }

  export interface VoteConfig {
    /**
     * optional address of agent casting the vote.
     */
    onBehalfOf?: string;
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
    /**
     * the choice of vote. Can be 1 (YES) or 2 (NO).
     */
    vote: number;
  }

  export interface VoteWithSpecifiedAmountsConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
    /**
     * the choice of vote. Can be 1 (YES) or 2 (NO).
     */
    vote: number;
    /**
     * reputation to put behind this vote, in Wei
     */
    reputation: BigNumber.BigNumber | string;
  }

  export interface RedeemConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
    /**
     * agent to whom to award the proposal payoffs
     */
    beneficiary: string;
  }

  export interface ShouldBoostConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
  }

  export interface GetScoreConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
  }

  export interface GetThresholdConfig {
    /**
     * the DAO's avatar address
     */
    avatar: string;
  }

  /**
   * return the amount of tokens to which the staker will be entitled as an outcome of the proposal
   */
  export interface GetRedeemableTokensStakerConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
    /**
     * the staker
     */
    beneficiary: string;
  }

  /**
   * return the amount of reputation to which the proposer will be entitled as an outcome of the proposal
   */
  export interface GetRedeemableReputationProposerConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
  }

  /**
   * return the amount of tokens to which the voter will be entitled as an outcome of the proposal
   */
  export interface GetRedeemableTokensVoterConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
    /**
     * the voter
     */
    beneficiary: string;
  }

  /**
   * return the amount of reputation to which the voter will be entitled as an outcome of the proposal
   */
  export interface GetRedeemableReputationVoterConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
    /**
     * the voter
     */
    beneficiary: string;
  }

  /**
   * return the amount of reputation to which the staker will be entitled as an outcome of the proposal
   */
  export interface GetRedeemableReputationStakerConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
    /**
     * the staker
     */
    beneficiary: string;
  }

  export interface GetNumberOfChoicesConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
  }

  export interface GetVoterInfoConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
    voter: string;
  }

  export interface GetVoteStatusConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
    /**
     * the choice of vote. Can be 1 (YES) or 2 (NO).
     */
    vote: number;
  }

  export interface IsVotableConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
  }

  export interface GetProposalStatusConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
  }

  export interface GetTotalReputationSupplyConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
  }

  export interface GetProposalAvatarConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
  }

  export interface GetScoreThresholdParamsConfig {
    /**
     * the DAO's avatar address
     */
    avatar: string;
  }

  export interface GetStakerInfoConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
    /**
     * address of the staking agent
     */
    staker: string;
  }

  export interface GetVoteStakeConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
    /**
     * the choice of vote. Can be 1 (YES) or 2 (NO).
     */
    vote: number;
  }

  export interface GetWinningVoteConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
  }

  export interface GetStateConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string;
  }

  export interface StakeEventResult {
    _amount: BigNumber.BigNumber;
    /**
     * indexed
     */
    _proposalId: Hash;
    _vote: number;
    /**
     * indexed
     */
    _voter: Address;
  }

  export interface RedeemEventResult {
    _amount: BigNumber.BigNumber;
    /**
     * indexed
     */
    _beneficiary: Address;
    /**
     * indexed
     */
    _proposalId: Hash;
  }

  export class GenesisProtocol extends ExtendTruffleScheme {
    public static new(): GenesisProtocol;
    public static at(address: string): GenesisProtocol;
    public static deployed(): GenesisProtocol;

    public NewProposal: EventFetcherFactory<NewProposalEventResult>;
    public ExecuteProposal: EventFetcherFactory<ExecuteProposalEventResult>;
    public VoteProposal: EventFetcherFactory<VoteProposalEventResult>;
    public Stake: EventFetcherFactory<StakeEventResult>;
    public Redeem: EventFetcherFactory<RedeemEventResult>;
    public RedeemReputation: EventFetcherFactory<RedeemReputationEventResult>;

    public propose(options: ProposeVoteConfig): Promise<ArcTransactionProposalResult>;
    public stake(options: StakeConfig): Promise<ArcTransactionResult>;
    public vote(options: VoteConfig): Promise<ArcTransactionResult>;
    public voteWithSpecifiedAmounts(options: VoteWithSpecifiedAmountsConfig): Promise<ArcTransactionResult>;
    public redeem(options: RedeemConfig): Promise<ArcTransactionResult>;
    public shouldBoost(options: ShouldBoostConfig): Promise<boolean>;
    public getScore(options: GetScoreConfig): Promise<BigNumber.BigNumber>;
    public getThreshold(options: GetThresholdConfig): Promise<BigNumber.BigNumber>;
    public getRedeemableTokensStaker(options: GetRedeemableTokensStakerConfig): Promise<BigNumber.BigNumber>;
    public getRedeemableReputationProposer(options: GetRedeemableReputationProposerConfig): Promise<BigNumber.BigNumber>;
    public getRedeemableTokensVoter(options: GetRedeemableTokensVoterConfig): Promise<BigNumber.BigNumber>;
    public getRedeemableReputationVoter(options: GetRedeemableReputationVoterConfig): Promise<BigNumber.BigNumber>;
    public getRedeemableReputationStaker(options: GetRedeemableReputationStakerConfig): Promise<BigNumber.BigNumber>;
    public getNumberOfChoices(options: GetNumberOfChoicesConfig): Promise<number>;
    public getVoterInfo(options: GetVoterInfoConfig): Promise<GetVoterInfoResult>;
    public getVoteStatus(options: GetVoteStatusConfig): Promise<BigNumber.BigNumber>;
    public isVotable(options: IsVotableConfig): Promise<boolean>;
    public getProposalStatus(options: GetProposalStatusConfig): Promise<GetProposalStatusResult>;
    public getTotalReputationSupply(options: GetTotalReputationSupplyConfig): Promise<BigNumber.BigNumber>;
    public getProposalAvatar(options: GetProposalAvatarConfig): Promise<string>;
    public getScoreThresholdParams(options: GetScoreThresholdParamsConfig): Promise<GetScoreThresholdParamsResult>;
    public getStakerInfo(options: GetStakerInfoConfig): Promise<GetStakerInfoResult>;
    public getVoteStake(options: GetVoteStakeConfig): Promise<BigNumber.BigNumber>;
    public getWinningVote(options: GetWinningVoteConfig): Promise<number>;
    public getState(options: GetStateConfig): Promise<number>;
    public setParams(params: GenesisProtocolParams): Promise<ArcTransactionDataResult<Hash>>;
  }
}
