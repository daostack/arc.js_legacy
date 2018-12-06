import { Web3 } from "web3";
import { DAO, InitializeArcJs } from "../index";

/* tslint:disable:no-console */
/* tslint:disable:max-line-length */

interface FounderSpec {
  /**
   * Founders' address
   */
  address: string;
  /**
   * string | number token amount to be awarded to each founder, in GEN
   */
  tokens: string | number;
  /**
   * string | number reputation amount to be awarded to each founder,
   * in units of the Genesis Reputation system.
   */
  reputation: string | number;
}

/**
 * Migration callback
 */
export class GenesisDaoCreator {

  constructor(
    private web3: Web3) {
  }

  public async run(): Promise<void> {

    const spec = {
      founders: [
        {
          address: "0xb0c908140fe6fd6fbd4990a5c2e35ca6dc12bfb2",
          reputation: "1000",
          tokens: "1000",
        },
        {
          address: "0x9c7f9f45a22ad3d667a5439f72b563df3aa70aae",
          reputation: "1000",
          tokens: "1000",
        },
        {
          address: "0xa2a064b3b22fc892dfb71923a6d844b953aa247c",
          reputation: "1000",
          tokens: "1000",
        },
        {
          address: "0xdeeaa92e025ca7fe34679b0b92cd4ffa162c8de8",
          reputation: "1000",
          tokens: "1000",
        },
        {
          address: "0x81cfdaf70273745a291a7cf9af801a4cffa87a95",
          reputation: "1000",
          tokens: "1000",
        },
        {
          address: "0x8ec400484deb5330bcd0bc005c13a557c5247727",
          reputation: "1000",
          tokens: "1000",
        },
      ],
      name: "Genesis Test",
      schemes: [
        {
          name: "SchemeRegistrar",
          votingMachineParams: {
            votingMachineName: "AbsoluteVote",
          },
        },
        {
          name: "GlobalConstraintRegistrar",
          votingMachineParams: {
            votingMachineName: "AbsoluteVote",
          },
        },
        {
          name: "UpgradeScheme",
          votingMachineParams: {
            votingMachineName: "AbsoluteVote",
          },
        },
        {
          name: "ContributionReward",
          votingMachineParams: {
            votingMachineName: "GenesisProtocol",
          },
        },
      ],
      tokenName: "Genesis Test",
      tokenSymbol: "GDT",
    };

    await InitializeArcJs();

    spec.founders = spec.founders.map((f: FounderSpec) => {
      return {
        address: f.address,
        reputation: this.web3.toWei(f.reputation),
        tokens: this.web3.toWei(f.tokens),
      };
    });

    console.log(`Genesis Test DAO with ${spec.founders.length} founders...`);

    const dao = await DAO.new(spec);

    console.log(`new DAO created at: ${dao.avatar.address}`);
    console.log(`native token: ${dao.token.address}`);

    return Promise.resolve();
  }
}
