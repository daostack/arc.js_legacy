import { ExtendTruffleContract } from "ExtendTruffleContract";
import { Utils } from "./utils";

export default class ContractWrapperFactory<TContract extends ExtendTruffleContract> {

  private solidityContract: any;

  /**
   * Instantiate a contract wrapper factory for the given wrapper class.
   * @param solidityContract Name of the contract
   * @param wrapper Class of the contract
   */
  public constructor(private solidityContractName: string, private wrapper: new (solidityContract: any) => TContract) {
  }

  public async new(...rest: Array<any>): Promise<TContract> {
    this.ensureSolidityContract();
    return new this.wrapper(this.solidityContract).new(...rest);
  }

  public async at(address: string): Promise<TContract> {
    this.ensureSolidityContract();
    return new this.wrapper(this.solidityContract).at(address);
  }

  public async deployed(): Promise<TContract> {
    this.ensureSolidityContract();
    return new this.wrapper(this.solidityContract).deployed();
  }

  private ensureSolidityContract(): void {
    if (!this.solidityContract) {
      this.solidityContract = Utils.requireContract(this.solidityContractName);
    }
  }
}
