import { promisify } from "es6-promisify";
import { Address } from "./commonTypes";
import { LoggingService } from "./loggingService";
import { IEventSubscription, PubSubEventService } from "./pubSubEventService";
import { Utils } from "./utils";

/**
 * Watch for changes in the default account.
 *
 * For more information, see [Account Changes](/Configuration.md#accountchanges).
 */
export class AccountService {

  public static AccountChangedEventTopic: string = "AccountService.account.changed";
  public static NetworkChangedEventTopic: string = "AccountService.network.changed";

  /**
   * Initializes the system that watches for default account changes.
   *
   * `initiateAccountWatch` is called automatically by Arc.js when you pass `true`
   * for `watchForAccountChanges` to `InitializeArcJs`.  You may also call it manually yourself.
   *
   * Then you may request to be notified whenever the current account changes by calling
   * [AccountService.subscribeToAccountChanges](/arc.js/api/classes/AccountService#subscribeToAccountChanges)
   */
  public static async initiateAccountWatch(): Promise<void> {

    if (AccountService.accountChangedTimerId) {
      return;
    }

    LoggingService.info("Initiating account watch");

    if (!AccountService.currentAccount) {
      try {
        AccountService.currentAccount = await Utils.getDefaultAccount();
      } catch {
        AccountService.currentAccount = undefined;
      }
    }

    AccountService.accountChangedTimerId = setInterval(async () => {

      if (AccountService.accountChangedLock) {
        return; // prevent reentrance
      }

      AccountService.accountChangedLock = true;

      let currentAccount = AccountService.currentAccount;
      try {
        currentAccount = await Utils.getDefaultAccount();
      } catch {
        currentAccount = undefined;
      }
      if (currentAccount !== AccountService.currentAccount) {
        AccountService.currentAccount = currentAccount;
        LoggingService.info(`Account watch: account changed: ${currentAccount}`);
        PubSubEventService.publish(AccountService.AccountChangedEventTopic, currentAccount);
      }
      AccountService.accountChangedLock = false;
    }, 1000);
  }

  /**
   * Initializes the system that watches for blockchain network id changes.
   *
   * `initiateNetworkWatch` is called automatically by Arc.js when you pass `true`
   * for `watchForNetworkChanges` to `InitializeArcJs`.  You may also call it manually yourself.
   *
   * Then you may request to be notified whenever the current account changes by calling
   * [AccountService.subscribeToNetworkChanges](/arc.js/api/classes/AccountService#subscribeToNetworkChanges)
   *
   * When the network is found to have changed you should call `InitializeArcJs` so Arc.js will set
   * itself up with the new network and return to you a new `Web3` object.
   */
  public static async initiateNetworkWatch(): Promise<void> {

    if (AccountService.networkChangedTimerId) {
      return;
    }

    LoggingService.info("Initiating account watch");

    if (!AccountService.currentNetworkId) {
      try {
        AccountService.currentNetworkId = await AccountService.getNetworkId();
      } catch {
        AccountService.currentNetworkId = undefined;
      }
    }

    AccountService.networkChangedTimerId = setInterval(async () => {

      if (AccountService.networkChangedLock) {
        return; // prevent reentrance
      }

      AccountService.networkChangedLock = true;

      let currentNetworkId = AccountService.currentNetworkId;
      try {
        currentNetworkId = await AccountService.getNetworkId();
      } catch {
        currentNetworkId = undefined;
      }
      if (currentNetworkId !== AccountService.currentNetworkId) {
        AccountService.currentNetworkId = currentNetworkId;
        LoggingService.info(`Network watch: network changed: ${currentNetworkId}`);
        PubSubEventService.publish(AccountService.NetworkChangedEventTopic, currentNetworkId);
      }
      AccountService.networkChangedLock = false;
    }, 1000);
  }
  /**
   * Turn off the system that watches for default account changes.
   */
  public static endAccountWatch(): void {
    if (AccountService.accountChangedTimerId) {
      clearInterval(AccountService.accountChangedTimerId);
      AccountService.accountChangedTimerId = undefined;
    }
  }

  /**
   * Turn off the system that watches for default account changes.
   */
  public static endNetworkWatch(): void {
    if (AccountService.networkChangedTimerId) {
      clearInterval(AccountService.networkChangedTimerId);
      AccountService.networkChangedTimerId = undefined;
    }
  }
  /**
   * Subscribe to be notified whenever the current account changes, like this:
   *
   * ```typescript
   * AccountService.subscribeToAccountChanges((account: Address): void => { ... });
   * ```
   * @param callback
   * @returns A subscription to the event.  Unsubscribe by calling `[theSubscription].unsubscribe()`.
   */
  public static subscribeToAccountChanges(callback: (address: Address) => void): IEventSubscription {
    return PubSubEventService.subscribe(AccountService.AccountChangedEventTopic,
      (topic: string, address: Address): any => callback(address));
  }

  /**
   * Subscribe to be notified whenever the current network changes, like this:
   *
   * ```typescript
   * AccountService.subscribeToAccountChanges((networkId: number): void => { ... });
   * ```
   * @param callback
   * @returns A subscription to the event.  Unsubscribe by calling `[theSubscription].unsubscribe()`.
   */
  public static subscribeToNetworkChanges(callback: (networkId: number) => void): IEventSubscription {
    return PubSubEventService.subscribe(AccountService.NetworkChangedEventTopic,
      (topic: string, networkId: number): any => callback(networkId));
  }

  private static currentAccount: Address | undefined;
  private static currentNetworkId: number | undefined;
  private static accountChangedLock: boolean = false;
  private static accountChangedTimerId: any;
  private static networkChangedLock: boolean = false;
  private static networkChangedTimerId: any;

  private static async getNetworkId(): Promise<number | undefined> {
    const web3 = await Utils.getWeb3();
    return web3 ?
      Number.parseInt(await promisify(web3.version.getNetwork)() as string, 10) as number | undefined : undefined;
  }
}
