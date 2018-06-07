import { Address } from "./commonTypes";
import { EventService, IEventSubscription } from "./eventService";
import { Utils } from "./utils";

export class AccountService {

  public static AccountChangedEventTopic: string = "account.changed";

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
   * When the account changes your callback should refresh your entire web application, or at minimum
   * refresh the Wrapperservice.
   *
   * You could refresh your web application like this:
   *
   * `window.location.reload();`
   *
   * Or just refresh the WrapperService like this:
   *
   * `await WrapperService.initialize(options);`
   *
   * @param web3
   */
  public static async initiateAccountWatch(): Promise<void> {

    if (AccountService.accountChangedTimerId) {
      return;
    }

    if (!AccountService.currentAccount) {
      try {
        AccountService.currentAccount = await Utils.getDefaultAccount();
      } catch {
        AccountService.currentAccount = undefined;
      }
    }

    AccountService.accountChangedTimerId = setTimeout(async () => {

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
        EventService.publish(AccountService.AccountChangedEventTopic, currentAccount);
      }
      AccountService.accountChangedLock = false;
    }, 1000);
  }

  public static subscribeToAccountChanges(callback: (address: Address) => void): IEventSubscription {
    return EventService.subscribe(AccountService.AccountChangedEventTopic,
      (topic: string, address: Address): any => callback(address));
  }

  private static currentAccount: Address | undefined;
  private static accountChangedLock: boolean = false;
  private static accountChangedTimerId: any;
}
