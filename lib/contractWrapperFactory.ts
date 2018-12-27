import { promisify } from "es6-promisify";
import { Address } from "./commonTypes";
import { ConfigService } from "./configService";
import { IConfigService } from "./iConfigService";
import { IContractWrapper, IContractWrapperFactory } from "./iContractWrapperBase";
import { LoggingService } from "./loggingService";
import { Utils } from "./utils";
import { UtilsInternal } from "./utilsInternal";
import { Web3EventService } from "./web3EventService";

/**
 * Generic class factory for all of the contract wrapper classes.
 */
export class ContractWrapperFactory<TWrapper extends IContractWrapper>
  implements IContractWrapperFactory<TWrapper> {

  public static setConfigService(configService: IConfigService): void {
    this.configService = configService;
  }

  public static clearContractCache(): void {
    this.contractCache.clear();
  }

  /**
   * this is a Map keyed by contract name of a Map keyed by address to an `IContractWrapper`
   */
  private static contractCache: Map<string, Map<Address, IContractWrapper>>
    = new Map<string, Map<Address, IContractWrapper>>();

  private static configService: IConfigService;

  private solidityContract: any;

  /**
   * Connstructor to create a contract wrapper factory for the given
   * Arc contract name and wrapper class.
   * @param solidityContract Name of the contract
   * @param wrapper - Class of the contract
   */
  public constructor(
    private solidityContractName: string,
    private wrapper: new (solidityContract: any, web3EventService: Web3EventService) => TWrapper,
    private web3EventService: Web3EventService) {
  }

  /**
   * Deploy a new instance of the contract and return a wrapper around it.
   * @param rest Optional arguments to the Arc contracts constructor.
   */
  public async new(...rest: Array<any>): Promise<TWrapper> {

    await this.ensureSolidityContract();

    let gas;

    if (ConfigService.get("estimateGas") && (!rest || !rest.length || (!rest[rest.length - 1].gas))) {
      gas = await this.estimateConstructorGas(...rest);
      LoggingService.debug(`Instantiating ${this.solidityContractName} with gas: ${gas}`);
    }

    if (gas) {
      rest = [...rest, { gas }];
    }

    const hydratedWrapper =
      await new this.wrapper(this.solidityContract, this.web3EventService).hydrateFromNew(...rest);

    if (hydratedWrapper && ContractWrapperFactory.configService.get("cacheContractWrappers")) {
      this.setCachedContract(this.solidityContractName, hydratedWrapper);
    }
    return hydratedWrapper;
  }

  /**
   * Return a wrapper around the contract, hydrated from the given address.
   * Returns undefined if not found.
   * @param address
   */
  public async at(address: string): Promise<TWrapper> {

    await this.ensureSolidityContract();

    const getWrapper = (): Promise<TWrapper> => {
      return new this.wrapper(this.solidityContract, this.web3EventService).hydrateFromAt(address);
    };

    return this.getHydratedWrapper(getWrapper, address);
  }

  /**
   * Return a wrapper around the contract as deployed by the current version of Arc.js.
   * Note this is usually not needed as the WrapperService provides these
   * wrappers already hydrated.
   * Returns undefined if not found.
   */
  public async deployed(): Promise<TWrapper> {
    /**
     * use deployed address if supplied for this contract
     */
    const externallyDeployedAddress = Utils.getDeployedAddress(this.solidityContractName);

    if (!externallyDeployedAddress) {
      throw new Error("ContractWrapperFactory: No deployed contract address has been supplied.");
    }

    return this.at(externallyDeployedAddress);
  }

  public async ensureSolidityContract(): Promise<any> {
    /**
     * requireContract caches and uncaches the contract appropriately
     */
    return Utils.requireContract(this.solidityContractName)
      .then((contract: any): any => this.solidityContract = contract);
  }

  protected async estimateConstructorGas(...params: Array<any>): Promise<number> {

    const web3 = await Utils.getWeb3();
    await this.ensureSolidityContract();

    const callData = (web3.eth.contract(this.solidityContract.abi).new as any).getData(
      ...params,
      {
        data: this.solidityContract.bytecode,
      });

    const currentNetwork = await Utils.getNetworkName();

    const maxGasLimit = await UtilsInternal.computeMaxGasLimit();

    // note that Ganache is identified specifically as the one instantiated by arc.js (by the networkId)
    if (currentNetwork === "Ganache") {
      return maxGasLimit; // because who cares with ganache and we can't get good estimates from it
    }

    const gas = await promisify((callback: any) => web3.eth.estimateGas({ data: callData }, callback))() as number;

    return Math.max(Math.min(gas, maxGasLimit), 21000);
  }

  private async getHydratedWrapper(
    getWrapper: () => Promise<TWrapper>,
    address?: Address): Promise<TWrapper> {

    let hydratedWrapper: TWrapper;
    if (ContractWrapperFactory.configService.get("cacheContractWrappers")) {
      if (!address) {
        try {
          address = this.solidityContract.address;
        } catch {
          // the contract has not been deployed, so can't get it's address
        }
      }

      if (address) {
        hydratedWrapper = this.getCachedContract(this.solidityContractName, address) as TWrapper;
        if (hydratedWrapper) {
          LoggingService.debug(`ContractWrapperFactory: obtained wrapper from cache: ${hydratedWrapper.address}`);
        }
      }

      if (!hydratedWrapper) {
        hydratedWrapper = await getWrapper();
        if (hydratedWrapper) {
          this.setCachedContract(this.solidityContractName, hydratedWrapper);
        }
      }
    } else {
      hydratedWrapper = await getWrapper();
    }
    return hydratedWrapper;
  }

  private getCachedContract(name: string, at: string): IContractWrapper | undefined {
    if (!at) {
      return undefined;
    }
    const addressMap = ContractWrapperFactory.contractCache.get(name);
    if (!addressMap) {
      return undefined;
    }
    return addressMap.get(at);
  }

  private setCachedContract(
    name: string,
    wrapper: IContractWrapper): void {

    if (wrapper) {
      let addressMap = ContractWrapperFactory.contractCache.get(name);
      if (!addressMap) {
        addressMap = new Map<Address, IContractWrapper>();
        ContractWrapperFactory.contractCache.set(name, addressMap);
      }
      addressMap.set(wrapper.address, wrapper);
    }
  }
}
