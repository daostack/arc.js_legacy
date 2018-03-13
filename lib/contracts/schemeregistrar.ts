"use strict";
import dopts = require("default-options");
import { Address, DefaultSchemePermissions, Hash, SchemePermissions } from "../commonTypes";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ContractWrapperBase,
  EventFetcherFactory,
  StandardSchemeParams,
} from "../contractWrapperBase";
import { ProposalDeletedEventResult, ProposalExecutedEventResult } from "./commonEventInterfaces";

import ContractWrapperFactory from "../contractWrapperFactory";

export class SchemeRegistrarWrapper extends ContractWrapperBase {

  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public NewSchemeProposal: EventFetcherFactory<NewSchemeProposalEventResult> = this.createEventFetcherFactory<NewSchemeProposalEventResult>("NewSchemeProposal");
  public RemoveSchemeProposal: EventFetcherFactory<RemoveSchemeProposalEventResult> = this.createEventFetcherFactory<RemoveSchemeProposalEventResult>("RemoveSchemeProposal");
  public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult> = this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted");
  public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult> = this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted");
  /* tslint:enable:max-line-length */

  /**
   * Note relating to permissions: According rules defined in the Controller,
   * this SchemeRegistrar is only capable of registering schemes that have
   * either no permissions or have the permission to register other schemes.
   * Therefore Arc's SchemeRegistrar is not capable of registering schemes
   * that have permissions greater than its own, thus excluding schemes having
   * the permission to add/remove global constraints or upgrade the controller.
   * The Controller will throw an exception when an attempt is made
   * to add or remove schemes having greater permissions than the scheme attempting the change.
   */
  public async proposeToAddModifyScheme(
    opts: ProposeToAddModifySchemeParams = {} as ProposeToAddModifySchemeParams)
    : Promise<ArcTransactionProposalResult> {
    /**
     * Note that explicitly supplying any property with a value of undefined will prevent the property
     * from taking on its default value (weird behavior of default-options).
     *
     */
    const defaults = {
      avatar: undefined,
      permissions: null,
      schemeAddress: undefined,
      schemeName: null,
      schemeParametersHash: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as ProposeToAddModifySchemeParams;

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.schemeAddress) {
      throw new Error("schemeAddress is not defined");
    }

    if (!options.schemeParametersHash) {
      throw new Error("schemeParametersHash is not defined");
    }

    /**
     * throws an Error if not valid, yields 0 if null or undefined
     */
    let permissions: SchemePermissions | DefaultSchemePermissions;

    if (options.schemeName) {
      /**
       * then we are adding/removing an Arc scheme and can get and check its permissions.
       */
      permissions = options.permissions || DefaultSchemePermissions[options.schemeName];

      if (permissions > this.getDefaultPermissions()) {
        throw new Error(
          "SchemeRegistrar cannot work with schemes having greater permissions than its own"
        );
      }
    } else {
      permissions = options.permissions;

      if (!permissions) {
        throw new Error(
          "permissions is not defined; it is required for non-Arc schemes (where schemeName is undefined)"
        );
      }
    }

    const tx = await this.contract.proposeScheme(
      options.avatar,
      options.schemeAddress,
      options.schemeParametersHash,
      SchemePermissions.toString(permissions)
    );

    return new ArcTransactionProposalResult(tx);
  }

  public async proposeToRemoveScheme(
    opts: ProposeToRemoveSchemeParams = {} as ProposeToRemoveSchemeParams)
    : Promise<ArcTransactionProposalResult> {
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      /**
       * scheme address
       */
      schemeAddress: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.schemeAddress) {
      throw new Error("schemeAddress address is not defined");
    }

    const tx = await this.contract.proposeToRemoveScheme(
      options.avatar,
      options.schemeAddress
    );

    return new ArcTransactionProposalResult(tx);
  }

  public async setParameters(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>> {
    return super._setParameters(
      ["bytes32", "bytes32", "address"],
      [params.voteParametersHash, params.voteParametersHash, params.votingMachineAddress]
    );
  }

  public getDefaultPermissions(overrideValue?: SchemePermissions | DefaultSchemePermissions): SchemePermissions {
    // return overrideValue || Utils.numberToPermissionsString(DefaultSchemePermissions.SchemeRegistrar);
    return (overrideValue || DefaultSchemePermissions.SchemeRegistrar) as SchemePermissions;
  }

  public async getSchemeParameters(avatarAddress: Address): Promise<StandardSchemeParams> {
    return this._getSchemeParameters(avatarAddress);
  }

  public async getParameters(paramsHash: Hash): Promise<StandardSchemeParams> {
    const params = await this.getParametersArray(paramsHash);
    return {
      voteParametersHash: params[0],
      votingMachineAddress: params[2],
    };
  }
}

const SchemeRegistrar = new ContractWrapperFactory("SchemeRegistrar", SchemeRegistrarWrapper);
export { SchemeRegistrar };

export interface NewSchemeProposalEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _intVoteInterface: Address;
  _isRegistering: boolean;
  _parametersHash: Hash;
  /**
   * indexed
   */
  _proposalId: Hash;
  _scheme: Address;
}

export interface RemoveSchemeProposalEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _intVoteInterface: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
  _scheme: Address;
}

export interface ProposeToAddModifySchemeParams {
  /**
   * avatar address
   */
  avatar: Address;
  /**
   * Optional scheme address.  Supply this if you are submitting a non-Arc scheme
   * or wish to use a different Arc scheme than the default.  In the latter case, you must
   * also supply the schemeName.
   */
  schemeAddress?: Address;
  /**
   * Scheme name, like "SchemeRegistrar" or "ContributionReward".
   * Not required if you are registering a non-arc scheme.
   */
  schemeName?: string | null;
  /**
   * Fash of scheme parameters. These must be already registered with the new scheme.
   */
  schemeParametersHash: string;
  /**
   * Optionally supply values from SchemePermissions or DefaultSchemePermissions.
   *
   * This value is manditory for non-Arc schemes.
   *
   * For Arc schemes the default is taken from DefaultSchemePermissions
   * for the scheme given by schemeName.
   */
  permissions?: SchemePermissions | DefaultSchemePermissions | null;
}

export interface ProposeToRemoveSchemeParams {
  /**
   * avatar address
   */
  avatar: string;
  /**
   *  the address of the global constraint to remove
   */
  schemeAddress: string;
}
