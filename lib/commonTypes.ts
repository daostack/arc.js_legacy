import { Utils } from "./utils";

export type fnVoid = () => void;
export type Hash = string;
export type Address = string;

export interface VoteConfig {
  /**
   * optional address of agent casting the vote.
   */
  onBehalfOf?: string;
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * the choice of vote. Can be 1 (YES) or 2 (NO).
   */
  vote: number;
}

export enum BinaryVoteResult {
  None = 0,
  Yes = 1,
  No = 2,
}

export interface GetDaoProposalsConfig {
  /**
   * The avatar under which the proposals were created
   */
  avatar: Address;
  /**
   * Optionally filter on the given proposalId
   */
  proposalId?: Hash;
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
export enum DefaultSchemePermissions {
  NoPermissions = SchemePermissions.None,
  MinimumPermissions = SchemePermissions.IsRegistered,
  AllPermissions = SchemePermissions.All,
  ContributionReward = SchemePermissions.IsRegistered,
  GenesisProtocol = SchemePermissions.IsRegistered,
  GlobalConstraintRegistrar = SchemePermissions.IsRegistered | SchemePermissions.CanAddRemoveGlobalConstraints,
  /**
   * Has all permissions so that it can register/unregister all schemes
   */
  SchemeRegistrar = SchemePermissions.All,
  UpgradeScheme = SchemePermissions.IsRegistered | SchemePermissions.CanRegisterSchemes | SchemePermissions.CanUpgradeController,
  VestingScheme = SchemePermissions.IsRegistered,
  VoteInOrganizationScheme = SchemePermissions.IsRegistered | SchemePermissions.CanCallDelegateCall,
}
/* tslint:enable:no-bitwise */
/* tslint:enable:max-line-length */
/* tslint:disable:no-namespace */
export namespace SchemePermissions {
  export function toString(perms: SchemePermissions | DefaultSchemePermissions): string {
    return Utils.numberToPermissionsString(perms);
  }
  export function fromString(perms: string): SchemePermissions {
    return Utils.permissionsStringToNumber(perms);
  }
}
/*tslint:enable:no-namespace */
