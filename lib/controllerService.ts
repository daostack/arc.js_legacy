import { Address } from "./commonTypes";
import { LoggingService } from "./loggingService";
import { Utils } from "./utils";

/**
 * Methods for querying information about an Avatar's controller.
 * Use it by:
 *
 * ```javascript
 * const controllerService = new ControllerService(avatarAddress);
 * ```
 *
 */
export class ControllerService {

  private isUController: boolean;
  private avatarAddress: Address;
  private avatar: any;
  private controllerAddress: any;
  private controller: any;

  constructor(avatarAddress: Address) {
    this.avatarAddress = avatarAddress;
    this.isUController = undefined;
  }

  /**
   * Returns promise of whether avatar has a universal controller
   */
  public async getIsUController(): Promise<boolean> {
    await this.getController();
    return this.isUController;
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
   * Returns promise of a Truffle contract wrapper for the controller.  Could be
   * either UController or Controller.  You can know which one
   * by checking the ControllerService instance property `isUController`.
   */
  public async getController(): Promise<any> {

    if (!this.controller) {
      const controllerAddress = await this.getControllerAddress();
      if (controllerAddress) {
        /**
         * anticipate case where UController hasn't been deployed
         */
        let uControllerAddress;
        let UControllerContract;
        try {
          /**
           * TODO:  check for previous and future versions of UController here
           */
          UControllerContract = await Utils.requireContract("UController");
          uControllerAddress = (await UControllerContract.deployed()).address;
          /* tslint:disable-next-line:no-empty */
        } catch { }

        this.isUController = uControllerAddress === controllerAddress;

        if (this.isUController) {
          this.controller = await UControllerContract.at(controllerAddress);
        } else {
          const ControllerContract = await Utils.requireContract("Controller");
          this.controller = await ControllerContract.at(controllerAddress);
        }
      }
    }
    return this.controller;
  }

  /**
   * Returns promise of the Avatar Truffle contract wrapper.
   * Returns undefined if not found.
   */
  private async getAvatar(): Promise<any> {
    if (!this.avatar) {
      const Avatar = await Utils.requireContract("Avatar");
      return Avatar.at(this.avatarAddress)
        .then((avatar: any) => avatar) // only way to get to catch

        /* have to handle the catch or promise rejection goes unhandled */
        .catch((ex: Error) => {
          LoggingService.error(`ControllerService: unable to load avatar at ${this.avatarAddress}: ${ex.message}`);
          return undefined;
        });
    }
  }
}
