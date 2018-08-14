import { Address } from "./commonTypes";
import { IConfigService } from "./iConfigService";
import { IContractWrapperBase, IContractWrapperFactory } from "./iContractWrapperBase";
import { Utils } from "./utils";
import { Web3EventService } from "./web3EventService";

/**
 * Generic class factory for all of the contract wrapper classes.
 */
export class ContractWrapperFactory<TWrapper extends IContractWrapperBase>
  implements IContractWrapperFactory<TWrapper> {

  public static setConfigService(configService: IConfigService): void {
    ContractWrapperFactory.configService = configService;
  }

  /**
   * this is a Map keyed by contract name of a Map keyed by address to an `IContractWrapperBase`
   */
  private static contractCache: Map<string, Map<Address, IContractWrapperBase>>
    = new Map<string, Map<Address, IContractWrapperBase>>();

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

    const hydratedWrapper =
      await new this.wrapper(this.solidityContract, this.web3EventService).hydrateFromNew(...rest);

    if (ContractWrapperFactory.configService.get("cacheContractWrappers")) {
      // in case anyone does a `.at` on this new address
      this.setCachedContract(this.solidityContractName, hydratedWrapper, hydratedWrapper.address);
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

    let hydratedWrapper: TWrapper;

    if (ContractWrapperFactory.configService.get("cacheContractWrappers")) {
      hydratedWrapper = this.getCachedContract(this.solidityContractName, address) as TWrapper;
      if (!hydratedWrapper) {
        hydratedWrapper = await getWrapper();
        this.setCachedContract(this.solidityContractName, hydratedWrapper, address);
      }
    } else {
      hydratedWrapper = await getWrapper();
    }

    return hydratedWrapper;
  }

  /**
   * Return a wrapper around the contract as deployed by the current version of Arc.js.
   * Note this is usually not needed as the WrapperService provides these
   * wrappers already hydrated.
   * Returns undefined if not found.
   */
  public async deployed(): Promise<TWrapper> {
    await this.ensureSolidityContract();

    const getWrapper = (): Promise<TWrapper> => {
      return new this.wrapper(this.solidityContract, this.web3EventService).hydrateFromDeployed();
    };

    let hydratedWrapper: TWrapper;

    if (ContractWrapperFactory.configService.get("cacheContractWrappers")) {
      hydratedWrapper = this.getCachedContract(this.solidityContractName) as TWrapper;
      if (!hydratedWrapper) {
        hydratedWrapper = await getWrapper();
        // this'll cache for both `.at` and `.deployed`
        this.setCachedContract(this.solidityContractName, hydratedWrapper);
      }
    } else {
      hydratedWrapper = await getWrapper();
    }
    return hydratedWrapper;
  }

  private getCachedContract(name: string, at?: string): IContractWrapperBase | undefined {
    const addressMap = ContractWrapperFactory.contractCache.get(name);
    if (!addressMap) {
      return undefined;
    }
    return addressMap.get(at ? at : `${name}_deployed`);
  }

  private setCachedContract(
    name: string,
    wrapper: IContractWrapperBase,
    at?: string): void {

    let addressMap = ContractWrapperFactory.contractCache.get(name);
    if (!addressMap) {
      addressMap = new Map<Address, IContractWrapperBase>();
      ContractWrapperFactory.contractCache.set(name, addressMap);
    }
    addressMap.set(wrapper.address, wrapper);
    if (!at) {
      // so we can also get the deployed version of this contract without the address
      addressMap.set(`${name}_deployed`, wrapper);
    }
  }
  private async ensureSolidityContract(): Promise<void> {
    if (!this.solidityContract) {
      this.solidityContract = await Utils.requireContract(this.solidityContractName);
    }
  }
}
