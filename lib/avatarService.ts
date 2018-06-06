import { BigNumber } from "bignumber.js";
import { promisify } from "es6-promisify";
import { Address } from "./commonTypes";
import { LoggingService } from "./loggingService";
import { Utils } from "./utils";

/**
 * Methods for querying information about an Avatar.
 * Use it by:
 *
 * let avatarService = new AvatarService(avatarAddress);
 *
 */
export class AvatarService {

  public isUController: boolean;
  private avatarAddress: Address;
  private avatar: any;
  private controllerAddress: any;
  private controller: any;
  private nativeReputationAddress: any;
  private nativeReputation: any;
  private nativeTokenAddress: any;
  private nativeToken: any;

  constructor(avatarAddress: Address) {
    this.avatarAddress = avatarAddress;
    this.isUController = undefined;
  }

  /**
   * Returns promise of the Avatar TruffleContract.
   * Returns undefined if not found.
   */
  public async getAvatar(): Promise<any> {
    if (!this.avatar) {
      const Avatar = await Utils.requireContract("Avatar");
      return Avatar.at(this.avatarAddress)
        .then((avatar: any) => avatar) // only way to get to catch

        /* have to handle the catch or promise rejection goes unhandled */
        .catch((ex: Error) => {
          LoggingService.error(`AvatarService: unable to load avatar at ${this.avatarAddress}: ${ex.message}`);
          return undefined;
        });
    }
  }

  /**
   * Returns promise of the address of the controller
   */
  public async getControllerAddress(): Promise<string> {
    if (!this.controllerAddress) {
      const avatar = await this.getAvatar();
      if (avatar) {
        this.controllerAddress = await avatar.owner();
      }
    }
    return this.controllerAddress;
  }

  /**
   * Returns promise of a TruffleContract for the controller.  Could be
   * either UController or Controller.  You can know which one
   * by checking the AvatarService instance property `isUController`.
   */
  public async getController(): Promise<any> {

    if (!this.controller) {
      const controllerAddress = await this.getControllerAddress();
      if (controllerAddress) {
        /**
         * TODO:  check for previous and future versions of UController here
         */
        const UControllerContract = await Utils.requireContract("UController");
        const ControllerContract = await Utils.requireContract("Controller");
        const uControllerAddress = (await UControllerContract.deployed()).address;

        this.isUController = uControllerAddress === controllerAddress;
        this.controller = this.isUController ?
          await UControllerContract.at(controllerAddress) :
          await ControllerContract.at(controllerAddress);
      }
    }
    return this.controller;
  }

  /**
   * Returns promise of the address of the avatar's native reputation.
   */
  public async getNativeReputationAddress(): Promise<string> {
    if (!this.nativeReputationAddress) {
      const avatar = await this.getAvatar();
      if (avatar) {
        this.nativeReputationAddress = await avatar.nativeReputation();
      }
    }
    return this.nativeReputationAddress;
  }

  /**
   * Returns promise of the avatar's native reputation TruffleContract.
   */
  public async getNativeReputation(): Promise<any> {
    if (!this.nativeReputation) {
      const reputationAddress = await this.getNativeReputationAddress();
      if (reputationAddress) {
        const Reputation = await Utils.requireContract("Reputation");
        this.nativeReputation = await Reputation.at(reputationAddress);
      }
    }
    return this.nativeReputation;
  }

  /**
   * Returns promise of the address of the avatar's native token.
   */
  public async getNativeTokenAddress(): Promise<string> {
    if (!this.nativeTokenAddress) {
      const avatar = await this.getAvatar();
      if (avatar) {
        this.nativeTokenAddress = await avatar.nativeToken();
      }
    }
    return this.nativeTokenAddress;
  }

  /**
   * Returns promise of the avatar's native token TruffleContract.
   * Assumes the token is a `DAOToken`.
   */
  public async getNativeToken(): Promise<any> {
    if (!this.nativeToken) {
      const tokenAddress = await this.getNativeTokenAddress();
      if (tokenAddress) {
        this.nativeToken = await (await Utils.requireContract("DAOToken")).at(tokenAddress) as any;
      }
    }
    return this.nativeToken;
  }

  /**
   * Return a current token balance for this avatar, in Wei.
   * If tokenAddress is not supplied, then uses native token.
   */
  public async getTokenBalance(tokenAddress?: Address): Promise<BigNumber> {
    let token;

    if (!tokenAddress) {
      token = await this.getNativeToken();
    } else {
      token = await (await Utils.requireContract("StandardToken")).at(tokenAddress)
        .then((theToken: any) => theToken) // only way to get to catch
        .catch((ex: Error) => {
          LoggingService.error(`AvatarService:  unable to load token at ${tokenAddress}: ${ex}`);
          return undefined;
        });
    }
    return token ? token.balanceOf(this.avatarAddress) : Promise.resolve(undefined);
  }

  /**
   * Return the current ETH balance for this avatar, in Wei.
   */
  public async getEthBalance(): Promise<BigNumber> {
    const web3 = await Utils.getWeb3();

    return promisify((callback: any) => web3.eth.getBalance(this.avatarAddress, web3.eth.defaultBlock, callback))()
      .then((balance: BigNumber) => {
        return balance;
      });
  }
}
