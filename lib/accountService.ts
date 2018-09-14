import { Address } from "./commonTypes";
import { LoggingService } from "./loggingService";
import { IEventSubscription, PubSubEventService } from "./pubSubEventService";
import { Utils } from "./utils";

/**
 * Watch for changes in the default account.
 *
 * For more information, see [Account Changes](Configuration#accountchanges).
 */
export class AccountService {

  public static AccountChangedEventTopic: string = "AccountService.account.changed";

  /**
   * Initializes the system that watches for default account changes.
   *
   * `initiateAccountWatch` is called automatically by Arc.js when you pass `true`
   * for `watchForAccountChanges` to `InitializeArcJs`.  You may also call it manually yourself.
   *
   * Then you may request to be notified whenever the current account changes by calling
   * [AccountService.subscribeToAccountChanges](/api/classes/AccountService#subscribeToAccountChanges)
   *
   *
   * @param web3
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
   * Turn off the system that watches for default account changes.
   */
  public static endAccountWatch(): void {
    if (AccountService.accountChangedTimerId) {
      clearInterval(AccountService.accountChangedTimerId);
      AccountService.accountChangedTimerId = undefined;
    }
  }

  /**
   * Subscribe to be notified whenever the current account changes, like this:
   *
   * ```javascript
   * AccountService.subscribeToAccountChanges((account: Address) => { ... });
   * ```
   * @param callback
   * @returns A subscription to the event.  Unsubscribe by calling `[theSubscription].unsubscribe()`.
   */
  public static subscribeToAccountChanges(callback: (address: Address) => void): IEventSubscription {
    return PubSubEventService.subscribe(AccountService.AccountChangedEventTopic,
      (topic: string, address: Address): any => callback(address));
  }

  private static currentAccount: Address | undefined;
  private static accountChangedLock: boolean = false;
  private static accountChangedTimerId: any;
}
