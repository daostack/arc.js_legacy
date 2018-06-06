import { BigNumber } from "bignumber.js";
import { Address } from "../commonTypes";

export interface MigrationState {
  avatarAddress: Address;
  daoCreatorAddress: Address;
  nativeTokenAddress: Address;
  gasLimit: BigNumber;
  network: string;
  orgName: string;
}
