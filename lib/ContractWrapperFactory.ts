import { ExtendTruffleContract } from "ExtendTruffleContract";

export default class ContractWrapperFactory<TContract extends ExtendTruffleContract> {

  constructor(private solidityContract: any, private wrapper: new (solidityContract: any) => TContract) {
  }

  public async new(...rest): Promise<TContract> {
    return new this.wrapper(this.solidityContract).new(...rest);
  }

  public async at(address: string): Promise<TContract> {
    return new this.wrapper(this.solidityContract).at(address);
  }

  public async deployed(): Promise<TContract> {
    return new this.wrapper(this.solidityContract).deployed();
  }
};
