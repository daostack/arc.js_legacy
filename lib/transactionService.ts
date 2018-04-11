
/**
 * Any function that generates transactions.
 */
export type Action = (...rest: Array<any>) => Promise<any>;
/**
 * A function intended to compute a number of transactions given optional parameters.
 */
export type ActionTransactionsCounter = (...rest: Array<any>) => number;

export class TransactionService {

  private static ActionTransactionsCounters: Map<Action, ActionTransactionsCounter> =
    new Map<Action, ActionTransactionsCounter>();

  /**
   * The default ActionTransactionsCounter that takes no params and returns 1.
   */
  private static DefaultActionTransactionsCounter = (...rest) => { return 1; };

  /**
   * Wrappers must use this to register, for any function (Action) that
   * generates one or more transaction, a ActionTransactionsCounter.
   * @param action 
   * @param counterFunction default is DefaultActionTransactionsCounter
   */
  public static registerActionTransactionCounter(
    action: Action,
    counterFunction?: ActionTransactionsCounter) {

    TransactionService.ActionTransactionsCounters.set(action,
      counterFunction ? counterFunction : TransactionService.DefaultActionTransactionsCounter);
  }

  /**
   * Returns a function that computes the number of transactions in the given Action.
   * Throws an exception when the action is not found.
   * @param action 
   */
  public static getTransactionCountForAction(action: Action): ActionTransactionsCounter {
    if (TransactionService.ActionTransactionsCounters.has(action)) {
      return TransactionService.ActionTransactionsCounters.get(action);
    } else {
      throw new Error(`getTransactionCountForAction: action has not registered a tx counter`);
    }
  }
}
