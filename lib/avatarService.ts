import { Address } from "./commonTypes";
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
   * Returns the Avatar TruffleContract
   */
  public async getAvatar(): Promise<any> {
    if (!this.avatar) {
      const Avatar = await Utils.requireContract("Avatar");
      this.avatar = await Avatar.at(this.avatarAddress);
    }
    return this.avatar;
  }

  /**
   * returns the address of the controller
   */
  public async getControllerAddress(): Promise<string> {
    if (!this.controllerAddress) {
      const avatar = await this.getAvatar();
      this.controllerAddress = await avatar.owner();
    }
    return this.controllerAddress;
  }

  /**
   * Returns a TruffleContract for the controller.  Could be
   * either UController or Controller.  You can know which one
   * by checking the AvatarService instance property `isUController`.
   */
  public async getController(): Promise<any> {

    if (!this.controller) {
      const controllerAddress = await this.getControllerAddress();
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
    return this.controller;
  }

  /**
   * Returns the address of the avatar's native reputation.
   */
  public async getNativeReputationAddress(): Promise<string> {
    if (!this.nativeReputationAddress) {
      const avatar = await this.getAvatar();
      this.nativeReputationAddress = await avatar.nativeReputation();
    }
    return this.nativeReputationAddress;
  }

  /**
   * Returns the avatar's native reputation TruffleContract.
   */
  public async getNativeReputation(): Promise<any> {
    if (!this.nativeReputation) {
      const reputationAddress = await this.getNativeReputationAddress();
      const Reputation = await Utils.requireContract("Reputation");
      this.nativeReputation = await Reputation.at(reputationAddress);
    }
    return this.nativeReputation;
  }

  /**
   * Returns the address of the avatar's native token.
   */
  public async getNativeTokenAddress(): Promise<string> {
    if (!this.nativeTokenAddress) {
      const avatar = await this.getAvatar();
      this.nativeTokenAddress = await avatar.nativeToken();
    }
    return this.nativeTokenAddress;
  }

  /**
   * Returns the avatar's native token TruffleContract.
   */
  public async getNativeToken(): Promise<any> {
    if (!this.nativeToken) {
      const tokenAddress = await this.getNativeTokenAddress();
      const DAOToken = await Utils.requireContract("DAOToken");
      this.nativeToken = await DAOToken.at(tokenAddress);
    }
    return this.nativeToken;
  }
}
