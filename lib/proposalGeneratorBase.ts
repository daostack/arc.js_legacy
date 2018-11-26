import { Address } from "./commonTypes";
import { ContractWrapperFactory } from "./contractWrapperFactory";
import { ProposalService } from "./proposalService";
import { USchemeWrapperBase } from "./uSchemeWrapperBase";
import { Web3EventService } from "./web3EventService";
import { IntVoteInterfaceFactory, IntVoteInterfaceWrapper } from "./wrappers/intVoteInterface";

/**
 * Methods for Arc universal schemes that can create proposals.  Note that a contract that
 * creates proposals doesn't necessary have to be a universal scheme, nor even a plain-old scheme.
 * But all of the Arc proposal-generating schemes currently are currently universal schemes, so
 * for the purposes of simplicity of organizating Arc.js and implementing these methods in one
 * place, we define this as a `USchemeWrapperBase`.
 */
export abstract class ProposalGeneratorBase extends USchemeWrapperBase {
  protected proposalService: ProposalService;
  protected votingMachineFactory: ContractWrapperFactory<IntVoteInterfaceWrapper>;

  constructor(solidityContract: any, web3EventService: Web3EventService) {
    super(solidityContract, web3EventService);
    this.proposalService = new ProposalService(web3EventService);
    this.votingMachineFactory = IntVoteInterfaceFactory;
  }

  /**
   * Return the address of the voting machine for this scheme as registered with the given avatar.
   * @param avatarAddress
   */
  public async getVotingMachineAddress(avatarAddress: Address): Promise<Address> {
    return (await this._getSchemeParameters(avatarAddress)).votingMachineAddress;
  }

  /**
   * Return IntVoteInterfaceWrapper for this scheme as registered with the given avatar.
   * @param avatarAddress
   */
  public async getVotingMachine(avatarAddress: Address): Promise<IntVoteInterfaceWrapper> {
    const votingMachineAddress = await this.getVotingMachineAddress(avatarAddress);
    return this.votingMachineFactory.at(votingMachineAddress);
  }
}
