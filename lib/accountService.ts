import { Address } from "./commonTypes";
import { EventService, IEventSubscription } from "./eventService";
import { Utils } from "./utils";
import { LoggingService } from './loggingService';

export class AccountService {

  public static AccountChangedEventTopic: string = "AccountService.account.changed";

  /**
   * Publish the `AccountService.AccountChangedEventTopic` event whenever the
   * current default account changes.
   *
   * This method is called automatically by Arc.js when you pass `true` for `watchForAccountChanges`
   * to `InitializeArcJs`.  You may also call it manually yourself.
   *
   * You may subscribe to the `AccountService.AccountChangedEventTopic` event as follows:
   *
   * `AccountService.subscribeToAccountChanges((account: Address) => { [reload appropriately] });`
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
        EventService.publish(AccountService.AccountChangedEventTopic, currentAccount);
      }
      AccountService.accountChangedLock = false;
    }, 1000);
  }

  /**
   * stop watching for account changes
   */
  public static endAccountWatch(): void {
    if (AccountService.accountChangedTimerId) {
      clearInterval(AccountService.accountChangedTimerId);
      AccountService.accountChangedTimerId = undefined;
    }
  }

  public static subscribeToAccountChanges(callback: (address: Address) => void): IEventSubscription {
    return EventService.subscribe(AccountService.AccountChangedEventTopic,
      (topic: string, address: Address): any => callback(address));
  }

  private static currentAccount: Address | undefined;
  private static accountChangedLock: boolean = false;
  private static accountChangedTimerId: any;
}
