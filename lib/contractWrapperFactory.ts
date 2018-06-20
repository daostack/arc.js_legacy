import { ContractWrapperBase } from "./contractWrapperBase";
import { Utils } from "./utils";
import { Web3EventService } from "./web3EventService";

/**
 * Generic class factory for all of the contract wrapper classes.
 */
export class ContractWrapperFactory<TWrapper extends ContractWrapperBase>
  implements IContractWrapperFactory<TWrapper> {

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
    return new this.wrapper(this.solidityContract, this.web3EventService).hydrateFromNew(...rest);
  }

  /**
   * Return a wrapper around the contract, hydrated from the given address.
   * Throws an exception if the contract is not found at the given address.
   * @param address
   */
  public async at(address: string): Promise<TWrapper> {
    await this.ensureSolidityContract();
    return new this.wrapper(this.solidityContract, this.web3EventService).hydrateFromAt(address);
  }

  /**
   * Return a wrapper around the contract as deployed by the current version of Arc.js.
   * Note this is usually not needed as the WrapperService provides these
   * wrappers already hydrated.
   */
  public async deployed(): Promise<TWrapper> {
    await this.ensureSolidityContract();
    return new this.wrapper(this.solidityContract, this.web3EventService).hydrateFromDeployed();
  }

  private async ensureSolidityContract(): Promise<void> {
    if (!this.solidityContract) {
      this.solidityContract = await Utils.requireContract(this.solidityContractName);
    }
  }
}

export interface IContractWrapperFactory<TWrapper extends ContractWrapperBase> {
  new: (...rest: Array<any>) => Promise<TWrapper>;
  at: (address: string) => Promise<TWrapper>;
  deployed: () => Promise<TWrapper>;
}
