import { ContractWrapperBase } from "./contractWrapperBase";
import { Utils } from "./utils";

export default class ContractWrapperFactory<TContract extends ContractWrapperBase> {

  private solidityContract: any;

  /**
   * Instantiate a contract wrapper factory for the given wrapper class.
   * @param solidityContract Name of the contract
   * @param wrapper Class of the contract
   */
  public constructor(private solidityContractName: string, private wrapper: new (solidityContract: any) => TContract) {
  }

  public async new(...rest: Array<any>): Promise<TContract> {
    await this.ensureSolidityContract();
    return new this.wrapper(this.solidityContract).hydrateFromNew(...rest);
  }

  public async at(address: string): Promise<TContract> {
    await this.ensureSolidityContract();
    return new this.wrapper(this.solidityContract).hydrateFromAt(address);
  }

  public async deployed(): Promise<TContract> {
    await this.ensureSolidityContract();
    return new this.wrapper(this.solidityContract).hydrateFromDeployed();
  }

  private async ensureSolidityContract(): Promise<void> {
    if (!this.solidityContract) {
      this.solidityContract = await Utils.requireContract(this.solidityContractName);
    }
  }
}
