import { BigNumber } from "./utils";
import { promisify } from "es6-promisify";
import { Address } from "./commonTypes";
import { ControllerService } from "./controllerService";
import { LoggingService } from "./loggingService";
import { Utils } from "./utils";
import { DaoTokenFactory, DaoTokenWrapper } from "./wrappers/daoToken";
import { ReputationFactory, ReputationWrapper } from "./wrappers/reputation";

/**
 * Methods for querying information about an Avatar.
 * Use it by:
 *
 * ```javascript
 * const avatarService = new AvatarService(avatarAddress);
 * ```
 *
 */
export class AvatarService {

  public controllerService: ControllerService;
  private avatarAddress: Address;
  private avatar: any;
  private nativeReputationAddress: any;
  private nativeReputation: ReputationWrapper;
  private nativeTokenAddress: any;
  private nativeToken: DaoTokenWrapper;

  constructor(avatarAddress: Address) {
    this.avatarAddress = avatarAddress;
    this.controllerService = new ControllerService(avatarAddress);
  }

  /**
   * Returns promise of the Avatar Truffle contract wrapper.
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

  public getIsUController(): Promise<boolean> {
    return this.controllerService.getIsUController();
  }

  /**
   * Returns promise of the address of the controller
   */
  public async getControllerAddress(): Promise<string> {
    return this.controllerService.getControllerAddress();
  }

  /**
   * Returns promise of a Truffle contract wrapper for the controller.  Could be
   * either UController or Controller.  You can know which one
   * by called `getIsUController`.
   */
  public async getController(): Promise<any> {
    return this.controllerService.getController();
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
   * Returns promise of the avatar's native reputation Truffle contract wrapper.
   */
  public async getNativeReputation(): Promise<ReputationWrapper> {
    if (!this.nativeReputation) {
      const reputationAddress = await this.getNativeReputationAddress();
      if (reputationAddress) {
        this.nativeReputation = await ReputationFactory.at(reputationAddress);
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
   * Returns promise of the avatar's native token Truffle contract wrapper.
   * Assumes the token is a `DAOToken`.
   */
  public async getNativeToken(): Promise<DaoTokenWrapper> {
    if (!this.nativeToken) {
      const tokenAddress = await this.getNativeTokenAddress();
      if (tokenAddress) {
        this.nativeToken = await DaoTokenFactory.at(tokenAddress);
      }
    }
    return this.nativeToken;
  }

  /**
   * Return a current token balance for this avatar, in Wei.
   * If tokenAddress is not supplied, then uses native token.
   */
  public async getTokenBalance(tokenAddress?: Address): Promise<BigNumber> {
    let token: DaoTokenWrapper;

    if (!tokenAddress) {
      token = await this.getNativeToken();
    } else {
      token = await DaoTokenFactory.at(tokenAddress);
    }
    if (!token) {
      LoggingService.error(`AvatarService: Unable to load token at ${tokenAddress}`);
      return Promise.resolve(undefined);
    }
    return token.getBalanceOf(this.avatarAddress);
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
