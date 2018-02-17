import { Utils } from "./utils";
const UControllerContract = Utils.requireContract("UController");
const ControllerContract = Utils.requireContract("Controller");
const DAOToken = Utils.requireContract("DAOToken");
const Reputation = Utils.requireContract("Reputation");
const Avatar = Utils.requireContract("Avatar");
import { Contracts } from "./contracts.js";

/**
 * Methods for querying information about an Avatar.
 * Use it by:
 *
 * let avatarService = new AvatarService(avatarAddress);
 *
 */
export default class AvatarService {

  _avatarAddress: string;
  isUController: boolean;
  _avatar: any;
  _controllerAddress: any;
  _controller: any;
  _nativeReputationAddress: any;
  _nativeReputation: any;
  _nativeTokenAddress: any;
  _nativeToken: any;

  constructor(avatarAddress: string) {
    this._avatarAddress = avatarAddress;
    this.isUController = undefined;
  }

  /**
   * Returns the Avatar TruffleContract
   */
  async getAvatar(): Promise<any> {
    if (!this._avatar) {
      this._avatar = await Avatar.at(this._avatarAddress);
    }
    return this._avatar;
  }

  /**
   * returns the address of the controller
   */
  async getControllerAddress(): Promise<string> {
    if (!this._controllerAddress) {
      const avatar = await this.getAvatar();
      this._controllerAddress = await avatar.owner();
    }
    return this._controllerAddress;
  }

  /**
   * Returns a TruffleContract for the controller.  Could be
   * either UController or Controller.  You can know which one
   * by checking the AvatarService instance property `isUController`.
   */
  async getController(): Promise<any> {

    if (!this._controller) {
      const contracts = await Contracts.getDeployedContracts();

      const controllerAddress = await this.getControllerAddress();
      /**
       * TODO:  check for previous and future versions of UController here
       */
      this.isUController = contracts.allContracts.UController.address === controllerAddress;
      this._controller = this.isUController ?
        await UControllerContract.at(controllerAddress) :
        await ControllerContract.at(controllerAddress);
    }
    return this._controller;
  }

  /**
   * Returns the address of the avatar's native reputation.
   */
  async getNativeReputationAddress(): Promise<string> {
    if (!this._nativeReputationAddress) {
      const avatar = await this.getAvatar();
      this._nativeReputationAddress = await avatar.nativeReputation();
    }
    return this._nativeReputationAddress;
  }

  /**
   * Returns the avatar's native reputation TruffleContract.
   */
  async getNativeReputation(): Promise<any> {
    if (!this._nativeReputation) {
      const reputationAddress = await this.getNativeReputationAddress();
      this._nativeReputation = await Reputation.at(reputationAddress);
    }
    return this._nativeReputation;
  }

  /**
   * Returns the address of the avatar's native token.
   */
  async getNativeTokenAddress(): Promise<string> {
    if (!this._nativeTokenAddress) {
      const avatar = await this.getAvatar();
      this._nativeTokenAddress = await avatar.nativeToken();
    }
    return this._nativeTokenAddress;
  }

  /**
   * Returns the avatar's native token TruffleContract.
   */
  async getNativeToken(): Promise<any> {
    if (!this._nativeToken) {
      const tokenAddress = await this.getNativeTokenAddress();
      this._nativeToken = await DAOToken.at(tokenAddress);
    }
    return this._nativeToken;
  }
}
