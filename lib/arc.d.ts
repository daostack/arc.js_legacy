import * as BigNumber from "bignumber.js";
import * as Web3 from "web3";

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
  export interface ArcTransactionDataResult extends ArcTransactionResult {
    result: any;
  }

  /**
   * returned by the create method in VestingScheme
   */
  export interface ArcTransactionAgreementResult extends ArcTransactionResult {
    agreementId: number;
  }
  /**
     * An object with property names being a contract key and property value as the corresponding ArcContractInfo.
     * For all deployed contracts exposed by Arc.
     */
  export interface ArcDeployedContractNames {
    ContributionReward: ArcContractInfo;
    DaoCreator: ArcContractInfo;
    GlobalConstraintRegistrar: ArcContractInfo;
    SchemeRegistrar: ArcContractInfo;
    SimpleICO: ArcContractInfo;
    UpgradeScheme: ArcContractInfo;
    AbsoluteVote: ArcContractInfo;
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
    getGlobalConstraints: Array<ArcContractInfo>;
  }

  /********************************
   * config.js
   */
  export var config: any;

  /********************************
   * contracts.js
   */
  export function getDeployedContracts(): ArcDeployedContracts;

  /********************************
   * utils.js
   */

  export class Utils {
    /**
     * Returns TruffleContract given the name of the contract (like "SchemeRegistrar"), or undefined
     * if not found or any other error occurs.
     * @param contractName like "SchemeRegistrar"
     */
    static requireContract(
      contractName: string
    ): any;

    static getWeb3(): Web3;

    static getValueFromLogs(
      tx: TransactionReceiptTruffle,
      arg: string,
      eventName?: string,
      index?: number
    ): string;

    static getDefaultAccount(): any;
  }


  /********************************
   * AvatarServive
   */
  export class AvatarService {
    /**
     * AvatarService constructor
     * @param avatarAddress - the avatar address.
     */
    constructor(avatarAddress: string);
    /**
     * Returns the Avatar TruffleContract
     */
    getAvatar(): any;
    /**
     * returns the address of the controller
     */
    getControllerAddress(): string;
    /**
     * Returns a TruffleContract for the controller.  Could be
     * either UController or Controller.  You can know which one
     * by checking the AvatarService instance property `isUController`.
     */
    getController(): any;
    /**
     * Returns the address of the avatar's native reputation.
     */
    getNativeReputationAddress(): string;
    /**
     * Returns the avatar's native reputation TruffleContract.
     */
    getNativeReputation(): any;
    /**
     * Returns the address of the avatar's native token.
     */
    getNativeTokenAddress(): string;
    /**
     * Returns the avatar's native token TruffleContract.
     */
    getNativeToken(): any;
  }

  /********************************
  * ExtendTruffleContract.js
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

  export interface TransactionReceipt {
    /**
     * hash of the block where this transaction was in.
     */
    blockHash: string;
    /**
     * block number where this transaction was in.
     */
    blockNumber: number;
    /**
     * hash of the transaction.
     */
    transactionHash: string;
    /**
     * transactions index position in the block.
     */
    transactionIndex: number;
    /**
     * address of the sender.
     */
    from: string;
    /**
     * address of the receiver. null when its a contract creation transaction.
     */
    to: string;
    /**
     * The total amount of gas used when this transaction was executed in the block.
     */
    cumulativeGasUsed: number;
    /**
     * The amount of gas used by this specific transaction alone.
     */
    gasUsed: number;
    /**
     * The contract address created, if the transaction was a contract creation, otherwise null.
     */
    contractAddress: string;
    /**
     * Array of log objects, which this transaction generated.
     */
    logs: Array<TransactionLog>;
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
    static new(options: any): any;
    static at(address: string): any;
    static deployed(): any;
    /**
     * the underlying truffle contract object
     */
    public contract: any;
    /**
     * Call setParameters on this contract.
     * Returns promise of ArcTransactionDataResult where Result is the parameters hash.
     * @param {any} params -- object with properties whose names are expected by the scheme to correspond to parameters.
     * Currently all params are required, contract wrappers do not as yet apply default values.
     */
    public setParams(params: any): Promise<ArcTransactionDataResult>;
  }

  export class ExtendTruffleScheme extends ExtendTruffleContract {
    /**
     * Returns a string containing an 8-digit hex number whose binary
     * 1s and 0s represent scheme permissions as follows:
     *
     * All 0: Not registered,
     * 1st bit: Scheme is registered
     * 2nd bit: Scheme can register other schemes
     * 3th bit: Scheme can add/remove global constraints
     * 4rd bit: Scheme can upgrade the controller
     *
     * Example:  "0x00000003" has the 1st and 2nd bits set.
     */
    getDefaultPermissions(overrideValue: string): string;
  }

  export interface StandardSchemeParams {
    voteParametersHash: string;
    votingMachine: string; // address
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
    reputationAddress?: string;
    /**
     * Optional VotingMachine address
     * Default is AbsoluteVote
     */
    votingMachineAddress?: string;
    /**
     * Optional Voting percentage that decides a vote.
     * Default is 50.
     */
    votePerc?: number;
    /**
     * Optional true to automatically give a proposer a vote "for" the proposed scheme.
     * Default is true;
     */
    ownerVote?: boolean;
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
     * Default is {}
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
    avatar: string
  }

  export class DaoCreator extends ExtendTruffleScheme {
    static new(): DaoCreator;
    static at(address: string): DaoCreator;
    static deployed(): DaoCreator;
    /**
     * Create a new DAO
     * @param {ForgeOrgConfig} options 
     */
    forgeOrg(options: ForgeOrgConfig): Promise<ArcTransactionResult>;
    /**
     * Register schemes with newly-created DAO.
     * Can only be invoked by the agent that created the DAO
     * via forgeOrg, and at that, can only be called one time. 
     * @param {SetSchemesConfig} options 
     */
    setSchemes(options: SetSchemesConfig): Promise<ArcTransactionResult>;
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
    static new(options: NewDaoConfig & SchemesConfig): Promise<DAO>;

    /**
     * Return an instance of DAO representing the migrated DAO at the given address
     * @param avatarAddress
     */
    static at(avatarAddress: string): Promise<DAO>;
    /**
     * Returns promise of the DAOstack Genesis avatar address, or undefined if not found
     * @param daoCreatorAddress - Optional address of DaoCreator to use
     */
    static getGenesisDao(daoCreatorAddress?: string): Promise<string | undefined>
    /**
     * Avatar truffle contract
     */
    avatar: any;
    /**
     * Controller truffle contract
     */
    controller: any;
    /**
     * DAOToken truffle contract
     */
    token: any;
    /**
     * Reputation truffle contract
     */
    reputation: any;
    /**
     * returns schemes currently registered into this DAO, as Array<DaoSchemeInfo>
     * @param contractName like "SchemeRegistrar"
     */
    getSchemes(contractName?: string): Promise<Array<DaoSchemeInfo>>;
    /**
     * Returns global constraints currently registered into this DAO, as Array<DaoGlobalConstraintInfo>
     * @param contractName like "TokenCapGC"
     */
    getGlobalConstraints(contractName?: string): Promise<Array<DaoGlobalConstraintInfo>>;
    /**
     * Returns an Arc.js scheme wrapper, or undefined if not found
     * @param contract - name of an Arc scheme, like "SchemeRegistrar"
     * @param address - optional
     */
    getScheme(
      contractName: string,
      address?: string
    ): Promise<ExtendTruffleScheme | undefined>;

    /**
     * returns whether the scheme with the given address is registered to this DAO's controller
     */
    isSchemeRegistered(schemeAddress: string): Promise<boolean>;
    /**
     * The DAO name, from the Avatar
     */
    getName(): Promise<string>;

    /**
     * The native token name
     */
    getTokenName(): Promise<string>;

    /**
     * The native token symbol
     */
    getTokenSymbol(): Promise<string>;
    /**
     * Given a scheme wrapper, returns an array of the scheme's parameter values.
     * The order of values in the array corresponds to the
     * order in which they are defined in the structure in which they
     * are stored in the scheme contract.
     * @param {string} schemeAddress 
     */
    getSchemeParameters(scheme: ExtendTruffleContract): Promise<Array<any>>;
  }

  /********************************
   * GlobalConstraintRegistrar
   */
  export interface GlobalConstraintRegistrarParams
    extends StandardSchemeParams { }

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

  export class GlobalConstraintRegistrar extends ExtendTruffleScheme {
    static new(): GlobalConstraintRegistrar;

    static at(address: string): GlobalConstraintRegistrar;
    static deployed(): GlobalConstraintRegistrar;

    /**
     *  propose to add or modify a global constraint
     * @param options ProposeToAddModifyGlobalConstraintParams
     */
    proposeToAddModifyGlobalConstraint(
      options: ProposeToAddModifyGlobalConstraintParams
    ): Promise<ArcTransactionProposalResult>;
    /**
     * propose to remove a global constraint
     * @param options ProposeToRemoveGlobalConstraintParams
     */
    proposeToRemoveGlobalConstraint(
      options: ProposeToRemoveGlobalConstraintParams
    ): Promise<ArcTransactionProposalResult>;

    setParams(params: GlobalConstraintRegistrarParams): Promise<ArcTransactionDataResult>;
  }

  /********************************
   * SchemeRegistrar
   */
  export interface SchemeRegistrarParams extends StandardSchemeParams { }

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

  export class SchemeRegistrar extends ExtendTruffleScheme {
    static new(): SchemeRegistrar;
    static at(address: string): SchemeRegistrar;
    static deployed(): SchemeRegistrar;
    /**
     *  propose to add or modify a scheme
     * @param options ProposeToAddModifySchemeParams
     */
    proposeToAddModifyScheme(
      options: ProposeToAddModifySchemeParams
    ): Promise<ArcTransactionProposalResult>;
    /**
     * propose to remove a scheme
     * @param options ProposeToRemoveSchemeParams
     */
    proposeToRemoveScheme(
      options: ProposeToRemoveSchemeParams
    ): Promise<ArcTransactionProposalResult>;

    setParams(params: SchemeRegistrarParams): Promise<ArcTransactionDataResult>;
  }

  /********************************
   * UpgradeScheme
   */
  export interface UpgradeSchemeParams extends StandardSchemeParams { }

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

  export class UpgradeScheme extends ExtendTruffleScheme {
    static new(): UpgradeScheme;
    static at(address: string): UpgradeScheme;
    static deployed(): UpgradeScheme;
    /**
     * propose to replace this UpgradingScheme
     * @param options ProposeUpgradingSchemeParams
     */
    proposeUpgradingScheme(
      options: ProposeUpgradingSchemeParams
    ): Promise<ArcTransactionProposalResult>;
    /**
     * propose to replace this DAO's controller
     * @param options ProposeControllerParams
     */
    proposeController(
      options: ProposeControllerParams
    ): Promise<ArcTransactionProposalResult>;

    setParams(params: UpgradeSchemeParams): Promise<ArcTransactionDataResult>;
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
     * reward in the DAO's native token.  In Wei. Default is 0;
     */
    nativeTokenReward?: BigNumber.BigNumber | string;
    /**
     * reward in the DAO's native reputation.  In Wei. Default is 0;
     */
    reputationReward?: BigNumber.BigNumber | string;
    /**
     * reward in ethers.  In Wei. Default is 0;
     */
    ethReward?: BigNumber.BigNumber | string;
    /**
     * reward in the given external token.  In Wei. Default is 0;
     */
    externalTokenReward?: BigNumber.BigNumber | string;
    /**
     * the address of an external token (for externalTokenReward)
     * Only required when externalTokenReward is given and non-zero.
     */
    externalToken?: string;
    /**
     *  beneficiary address
     */
    beneficiary: string;
  }

  export class ContributionReward extends ExtendTruffleScheme {
    static new(): ContributionReward;
    static at(address: string): ContributionReward;
    static deployed(): ContributionReward;
    /**
     * propose to make a contribution
     * @param options ProposeContributionParams
     */
    proposeContributionReward(
      options: ProposeContributionParams
    ): Promise<ArcTransactionProposalResult>;

    setParams(params: ContributionRewardParams): Promise<ArcTransactionDataResult>;

    /**
     * Event functions as defined by the parent Truffle contract
     */
    NewContributionProposal(filters: any, options: any): any;
    ProposalExecuted(filters: any, options: any): any;
    ProposalDeleted(filters: any, options: any): any;
  }

  /********************************
   * VestingScheme
   */
  export interface CommonVestingAgreementConfig {
    /**
     * Address of the recipient of the proposed agreement.
     */
    beneficiary: string,
    /**
     * Where to send the tokens in case of cancellation
     */
    returnOnCancelAddress: string,
    /**
     * Optional ethereum block number at which the agreement starts.
     * Default is the current block number.
     * Must be greater than or equal to zero.
     */
    startingBlock: number,
    /**
     * The number of tokens to pay per period.
     * Period is calculated as (number of blocks / periodLength).
     * Should be expressed in Wei.
     * Must be greater than zero.
     */
    amountPerPeriod: BigNumber.BigNumber | string,
    /**
     * number of blocks in a "period".
     * Must be greater than zero.
     */
    periodLength: number,
    /**
     * maximum number of periods that can be paid out.
     * Must be greater than zero.
     */
    numOfAgreedPeriods: number,
    /**
     * The minimum number of periods that must pass before the beneficiary
     * may collect tokens under the agreement.
     * Must be greater than or equal to zero.
     */
    cliffInPeriods: number,
    /**
     * The number of signatures required to cancel agreement.
     * See signToCancel.
     */
    signaturesReqToCancel: number,
    /**
     * An array of addresses of those who will be allowed to sign to cancel an agreement.
     * The length of this array must be greater than or equal to signaturesReqToCancel.
     */
    signers: Array<string>
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

  export class VestingScheme extends ExtendTruffleScheme {
    static new(): VestingScheme;
    static at(address: string): VestingScheme;
    static deployed(): VestingScheme;
    /**
     * Propose a new vesting agreement. The required funds will be minted to the vesting scheme on approval of the proposal.
     * @param {ProposeVestingAgreementConfig} options 
     */
    propose(options: ProposeVestingAgreementConfig): Promise<ArcTransactionProposalResult>;
    /**
      * Create a new vesting agreement, without a vote.
      * The caller (msg.Sender) pays the vesting scheme for the creation of the agreement.
      * @param {CreateVestingAgreementConfig} options 
      */
    create(options: CreateVestingAgreementConfig): Promise<ArcTransactionAgreementResult>;
    /**
     * Sign to cancel a vesting agreement.
     * @param {SignToCancelVestingAgreementConfig} options 
     */
    signToCancel(options: SignToCancelVestingAgreementConfig): Promise<ArcTransactionResult>;
    /**
     * Revoke vote for cancelling a vesting agreement
     * @param {RevokeSignToCancelVestingAgreementConfig} options 
     */
    revokeSignToCancel(options: RevokeSignToCancelVestingAgreementConfig): Promise<ArcTransactionResult>;
    /**
     * Collects for a beneficiary, according to the agreement
      * The caller (msg.Sender) pays the beneficiary the accrued amount of tokens.
     * @param {CollectVestingAgreementConfig} options 
     */
    collect(options: CollectVestingAgreementConfig): Promise<ArcTransactionResult>;
  }

  /********************************
   * VoteInOrganizationScheme
   */
  export interface VoteInOrganizationProposeVoteConfig {
    /**
     * Avatar whose voters are being given the chance to vote on the original proposal. 
     */
    avatar: string,
    /**
     * Address of the voting machine used by the original proposal.  The voting machine must
     * implement IntVoteInterface (as defined in Arc).
     */
    originalIntVote: string,
    /**
     * Address of the "original" proposal for which the DAO's vote will cast.
     */
    originalProposalId: string
  }

  export class VoteInOrganizationScheme extends ExtendTruffleScheme {
    static new(): VoteInOrganizationScheme;
    static at(address: string): VoteInOrganizationScheme;
    static deployed(): VoteInOrganizationScheme;
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
    proposeVote(options: VoteInOrganizationProposeVoteConfig): Promise<ArcTransactionProposalResult>;
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

  export interface GenesisProtocolProposeVoteConfig {
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

  export interface getVoterInfoResult {
    vote: number,
    reputation: BigNumber.BigNumber
  }

  export interface getProposalStatusResult {
    totalVotes: BigNumber.BigNumber,
    totalStakes: BigNumber.BigNumber,
    votersStakes: BigNumber.BigNumber
  }

  export interface getScoreThresholdParamsResult {
    thresholdConstA: number,
    thresholdConstB: number
  }

  export interface getStakerInfoResult {
    vote: number,
    stake: BigNumber.BigNumber
  }

  export interface stakeConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string,
    /**
     * vote choice index
     */
    vote: number,
    /**
     * token amount to stake on the outcome resulting in this vote, in Wei
     */
    amount: BigNumber.BigNumber | string
  }

  export interface voteConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string,
    /**
     * vote choice index
     */
    vote: number
  }

  export interface voteWithSpecifiedAmountsConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string,
    /**
     * vote choice index
     */
    vote: number,
    /**
     * reputation to put behind this vote, in Wei
     */
    reputation: BigNumber.BigNumber | string
  }

  export interface redeemConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string,
    /**
     * agent to whom to award the proposal payoffs
     */
    beneficiary: string
  }

  export interface shouldBoostConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string
  }

  export interface getScoreConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string
  }

  export interface getThresholdConfig {
    /**
     * the DAO's avatar address
     */
    avatar: string
  }

  /**
   * return the amount of tokens to which the staker will be entitled as an outcome of the proposal
  */
  export interface getRedeemableTokensStakerConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string,
    /**
     * the staker
     */
    beneficiary: string
  }

  /**
   * return the amount of reputation to which the proposer will be entitled as an outcome of the proposal
  */
  export interface getRedeemableReputationProposerConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string
  }

  /**
   * return the amount of tokens to which the voter will be entitled as an outcome of the proposal
  */
  export interface getRedeemableTokensVoterConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string,
    /**
     * the voter
     */
    beneficiary: string
  }

  /**
   * return the amount of reputation to which the voter will be entitled as an outcome of the proposal
  */
  export interface getRedeemableReputationVoterConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string,
    /**
     * the voter
     */
    beneficiary: string
  }

  /**
   * return the amount of reputation to which the staker will be entitled as an outcome of the proposal
  */
  export interface getRedeemableReputationStakerConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string,
    /**
     * the staker
     */
    beneficiary: string
  }

  export interface getNumberOfChoicesConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string
  }

  export interface getVoterInfoConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string,
    voter: string
  }

  export interface getVotesStatusConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string
  }

  export interface isVotableConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string
  }

  export interface getProposalStatusConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string
  }

  export interface getTotalReputationSupplyConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string
  }

  export interface getProposalAvatarConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string
  }

  export interface getScoreThresholdParamsConfig {
    /**
     * the DAO's avatar address
     */
    avatar: string
  }

  export interface getStakerInfoConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string,
    /**
     * address of the staking agent
     */
    staker: string
  }

  export interface getVoteStakeConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string,
    /**
     * vote choice index
     */
    vote: number
  }

  export interface getWinningVoteConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string
  }

  export interface getStateConfig {
    /**
     * unique hash of proposal index in the scope of the scheme
     */
    proposalId: string
  }

  export class GenesisProtocol extends ExtendTruffleScheme {
    static new(): GenesisProtocol;
    static at(address: string): GenesisProtocol;
    static deployed(): GenesisProtocol;

    /**
     * Create a proposal
     * @param {GenesisProtocolProposeVoteConfig} options 
     */
    propose(options: GenesisProtocolProposeVoteConfig): Promise<ArcTransactionProposalResult>;
    stake(options: any): Promise<ArcTransactionResult>;
    vote(options: any): Promise<ArcTransactionResult>;
    voteWithSpecifiedAmounts(options: any): Promise<ArcTransactionResult>;
    redeem(options: any): Promise<ArcTransactionResult>;
    shouldBoost(options: any): Promise<boolean>;
    getScore(options: any): Promise<BigNumber.BigNumber>;
    getThreshold(options: any): Promise<BigNumber.BigNumber>;
    getRedeemableTokensStaker(options: any): Promise<BigNumber.BigNumber>;
    getRedeemableReputationProposer(options: any): Promise<BigNumber.BigNumber>;
    getRedeemableTokensVoter(options: any): Promise<BigNumber.BigNumber>;
    getRedeemableReputationVoter(options: any): Promise<BigNumber.BigNumber>;
    getRedeemableReputationStaker(options: any): Promise<BigNumber.BigNumber>;
    getNumberOfChoices(options: any): Promise<number>;
    getVoterInfo(options: any): Promise<getVoterInfoResult>;
    getVotesStatus(options: any): Array<Promise<BigNumber.BigNumber>>;
    isVotable(options: any): Promise<boolean>;
    getProposalStatus(options: any): Promise<getProposalStatusResult>;
    getTotalReputationSupply(options: any): Promise<BigNumber.BigNumber>;
    getProposalAvatar(options: any): Promise<string>;
    getScoreThresholdParams(options: any): Promise<getScoreThresholdParamsResult>;
    getStakerInfo(options: any): Promise<getStakerInfoResult>;
    getVoteStake(options: any): Promise<BigNumber.BigNumber>;
    getWinningVote(options: any): Promise<number>;
    getState(options: any): Promise<number>;
  }
}
