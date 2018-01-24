import * as BigNumber from "bignumber.js";
import * as Web3 from "web3";

declare module "daostack-arc-js" {
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
   * An object with property names being a contract key and property value as the corresponding ArcContractInfo.
   * For all deployed contracts exposed by Arc.
   */
  export interface ArcDeployedContractNames {
    ContributionReward: ArcContractInfo;
    GenesisScheme: ArcContractInfo;
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
    defaultVotingMachine: ArcContractInfo;

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
   * Utils
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
    blockHash: string; // 32 Bytes - hash of the block where this transaction was in.
    blockNumber: number; // block number where this transaction was in.
    transactionHash: string; // 32 Bytes - hash of the transaction.
    transactionIndex: number; //integer of the transactions index position in the block.
    from: string; // 20 Bytes - address of the sender.
    to: string; // 20 Bytes - address of the receiver. null when its a contract creation transaction.
    cumulativeGasUsed: number; //The total amount of gas used when this transaction was executed in the block.
    gasUsed: number; //  The amount of gas used by this specific transaction alone.
    contractAddress: string; // 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise null.
    logs: Array<TransactionLog>; // Array of log objects, which this transaction generated.
  }

  export interface TransactionReceiptTruffle {
    transactionHash: string;
    logs: Array<TransactionLogTruffle>;
    receipt: TransactionReceipt;
    tx: string; // address of the transaction
  }

  /**
   * Returns TruffleContract given the name of the contract (like "SchemeRegistrar"), or undefined
   * if not found or any other error occurs.
   * @param contractName like "SchemeRegistrar"
   */
  export function requireContract(
    contractName: string
  ): any;

  export function getWeb3(): Web3;
  export function getValueFromLogs(
    tx: TransactionReceiptTruffle,
    arg: string,
    eventName: string,
    index: number
  ): string;
  export function getDefaultAccount(): any;

  export class ExtendTruffleContract {
    static new(options: any): any;
    static at(address: string): any;
    static deployed(): any;
    /**
     * the underlying truffle contract object
     */
    public contract: any;
    /**
     * Call setParameters on this contract, returning promise of the parameters hash.
     * @params Should contain property names expected by the specific contract type.
     */
    public setParams(params: any): Promise<string>;
  }

  export class ExtendTruffleScheme extends ExtendTruffleContract {
    /**
     * Returns a string containing 1s and 0s representing scheme permissions as follows:
     *
     * All 0: Not registered,
     * 1st bit: Flag if the scheme is registered,
     * 2nd bit: Scheme can register other schemes
     * 3th bit: Scheme can add/remove global constraints
     * 4rd bit: Scheme can upgrade the controller
     *
     */
    getDefaultPermissions(overrideValue: string): string;
  }

  export interface StandardNewSchemeParams {
  }

  export interface StandardSchemeParams {
    voteParametersHash: string;
    votingMachine: string; // address
  }

  export interface FounderConfig {
    address: string;
    tokens: string | number; // in Wei
    reputation: string | number;
  }

  export interface DaoNewConfig {
    orgName: string;
    tokenName: string;
    tokenSymbol: string;
    founders: Array<FounderConfig>;
    votingMachine?: string, // address
    votePrec?: Number,
    ownerVote?: boolean,
    schemes?: Array<{ name: string, address?: string }>
  }

  /********************************
   * Returned from DAO.getSchemes
   */
  export interface DaoSchemeInfo {
    name: string;
    address: string;
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

  /********************************
   * DAO
   */
  export class DAO {
    /**
     * includes static `new` and `at`
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
     * AbsoluteVote truffle contract
     */
    votingMachine: any;

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
     * Returns promise of a scheme as ExtendTruffleScheme, or ? if not found
     * @param contract name of scheme, like "SchemeRegistrar"
     * @param scheme optional scheme address
     */
    scheme(
      contractName: string,
      address?: string
    ): Promise<ExtendTruffleScheme>;
    // checkSchemeConditions(contractName:string);
    // proposeScheme(options?);
    // proposeGlobalConstraint(options?);
    // vote(proposalId, choice, params);
    static new(options: DaoNewConfig): Promise<DAO>;
    static at(avatarAddress: string): Promise<DAO>;

    /**
     * The DAO name, from the Avatar
     */
    getName(): string;

    /**
     * The native token name
     */
    getTokenName(): string;

    /**
     * The native token symbol
     */
    getTokenSymbol(): string;
  }

  /********************************
   * GlobalConstraintRegistrar
   */
  export interface GlobalConstraintRegistrarNewParams
    extends StandardNewSchemeParams { }

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
    static new(
      options: GlobalConstraintRegistrarNewParams
    ): GlobalConstraintRegistrar;
    static at(address: string): GlobalConstraintRegistrar;
    static deployed(): GlobalConstraintRegistrar;

    /**
     *  propose to add or modify a global constraint
     * @param opts ProposeToAddModifyGlobalConstraintParams
     */
    proposeToAddModifyGlobalConstraint(
      opts: ProposeToAddModifyGlobalConstraintParams
    ): Promise<TransactionReceiptTruffle>;
    /**
     * propose to remove a global constraint
     * @param opts ProposeToRemoveGlobalConstraintParams
     */
    proposeToRemoveGlobalConstraint(
      opts: ProposeToRemoveGlobalConstraintParams
    ): Promise<TransactionReceiptTruffle>;

    setParams(params: GlobalConstraintRegistrarParams): Promise<string>;
  }

  /********************************
   * SchemeRegistrar
   */
  export interface SchemeRegistrarNewParams extends StandardNewSchemeParams { }

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
    static new(options: SchemeRegistrarNewParams): SchemeRegistrar;
    static at(address: string): SchemeRegistrar;
    static deployed(): SchemeRegistrar;
    /**
     *  propose to add or modify a scheme
     * @param opts ProposeToAddModifySchemeParams
     */
    proposeToAddModifyScheme(
      opts: ProposeToAddModifySchemeParams
    ): Promise<TransactionReceiptTruffle>;
    /**
     * propose to remove a scheme
     * @param opts ProposeToRemoveSchemeParams
     */
    proposeToRemoveScheme(
      opts: ProposeToRemoveSchemeParams
    ): Promise<TransactionReceiptTruffle>;
    setParams(params: SchemeRegistrarParams): Promise<string>;
  }

  /********************************
   * UpgradeScheme
   */
  export interface UpgradeSchemeNewParams extends StandardNewSchemeParams { }

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
    static new(options: UpgradeSchemeNewParams): UpgradeScheme;
    static at(address: string): UpgradeScheme;
    static deployed(): UpgradeScheme;
    /**
     * propose to replace this UpgradingScheme
     * @param opts ProposeUpgradingSchemeParams
     */
    proposeUpgradingScheme(
      opts: ProposeUpgradingSchemeParams
    ): Promise<TransactionReceiptTruffle>;
    /**
     * propose to replace this DAO's controller
     * @param opts ProposeControllerParams
     */
    proposeController(
      opts: ProposeControllerParams
    ): Promise<TransactionReceiptTruffle>;
    setParams(params: UpgradeSchemeParams): Promise<string>;
  }

  /********************************
   * ContributionReward
   */
  export interface ContributionRewardNewParams
    extends StandardNewSchemeParams { }

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
    static new(options: ContributionRewardNewParams): ContributionReward;
    static at(address: string): ContributionReward;
    static deployed(): ContributionReward;
    /**
     * propose to make a contribution
     * @param opts ProposeContributionParams
     */
    proposeContributionReward(
      opts: ProposeContributionParams
    ): Promise<TransactionReceiptTruffle>;
    setParams(params: ContributionRewardParams): Promise<string>;

    /**
     * Event functions as defined by the parent Truffle contract
     */
    LogNewContributionProposal(filters: any, options: any): any;
    LogProposalExecuted(filters: any, options: any): any;
    LogProposalDeleted(filters: any, options: any): any;
  }
}
