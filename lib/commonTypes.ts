import { Utils } from "./utils";

export type fnVoid = () => void;
export type Hash = string;
export type Address = string;

export enum BinaryVoteResult {
  Abstain = 0,
  Yes = 1,
  No = 2,
}

export enum SchemePermissions {
  None = 0,
  /**
   * A scheme always automatically gets this bit when registered to a DAO
   */
  IsRegistered = 1,
  CanRegisterSchemes = 2,
  CanAddRemoveGlobalConstraints = 4,
  CanUpgradeController = 8,
  CanCallDelegateCall = 0x10,
  All = 0x1f,
}
/* tslint:disable:no-bitwise */
/* tslint:disable:max-line-length */
/**
 * These are the permissions that are the minimum that each scheme must have to
 * be able to perform its full range of functionality.
 *
 * Note that '1' is always assigned to a scheme by the Controller when the
 * scheme is registered with the controller.
 */
export class DefaultSchemePermissions {
  public static NoPermissions: SchemePermissions = SchemePermissions.None;
  public static MinimumPermissions: SchemePermissions = SchemePermissions.IsRegistered;
  public static AllPermissions: SchemePermissions = SchemePermissions.All;
  public static ContributionReward: SchemePermissions = SchemePermissions.IsRegistered;
  public static GlobalConstraintRegistrar: SchemePermissions = SchemePermissions.IsRegistered | SchemePermissions.CanAddRemoveGlobalConstraints;
  /**
   * Has all permissions so that it can register/unregister all schemes
   */
  public static SchemeRegistrar: SchemePermissions = SchemePermissions.All;
  public static UpgradeScheme: SchemePermissions = SchemePermissions.IsRegistered | SchemePermissions.CanRegisterSchemes | SchemePermissions.CanUpgradeController;
  public static VestingScheme: SchemePermissions = SchemePermissions.IsRegistered;
  public static VoteInOrganizationScheme: SchemePermissions = SchemePermissions.IsRegistered | SchemePermissions.CanCallDelegateCall;
}
/* tslint:enable:no-bitwise */
/* tslint:enable:max-line-length */
/* tslint:disable:no-namespace */
export namespace SchemePermissions {
  export function toString(perms: SchemePermissions): string {
    return Utils.numberToPermissionsString(perms);
  }
  export function fromString(perms: string): SchemePermissions {
    return Utils.permissionsStringToNumber(perms);
  }
}
/*tslint:enable:no-namespace */

export interface TruffleContract {
  /**
   * Migrate a new instance of the contract.  Returns promise of being
   * migrated.
   * Note that the so-called promise returned by Truffle only supplies a 'then'
   * function,  You have to call 'then' to get the real promise.
   */
  new: (...rest: Array<any>) => Promise<any>;
  /**
   * Returns a promise of an existing instance of the contract.
   * Note that the so-called promise returned by Truffle only supplies a 'then'
   * function,  You have to call 'then' to get the real promise.
   */
  at: (address: string) => Promise<any>;
  /**
   * Returns a promise of the deployed instance of the contract.
   * Note that the so-called promise returned by Truffle only supplies a 'then'
   * function,  You have to call 'then' to get the real promise.
   */
  deployed: () => Promise<any>;
}
