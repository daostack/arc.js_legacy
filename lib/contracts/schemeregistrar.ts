"use strict";
import dopts = require("default-options");
import { Address, Hash } from "../commonTypes";
import { Contracts } from "../contracts.js";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  EventFetcherFactory,
  ExtendTruffleContract,
  StandardSchemeParams,
} from "../ExtendTruffleContract";
import { ProposalDeletedEventResult, ProposalExecutedEventResult } from "./commonEventInterfaces";

import ContractWrapperFactory from "../ContractWrapperFactory";

export class SchemeRegistrarWrapper extends ExtendTruffleContract {

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
      /**
       * avatar address
       */
      avatar: undefined,
      /**
       * true if the given scheme is able to register/unregister/modify schemes.
       *
       * isRegistering should only be supplied when schemeName is not given (and thus the scheme is non-Arc).
       * Otherwise we determine it's value based on scheme and schemeName.
       */
      isRegistering: null,
      /**
       * scheme address
       */
      scheme: undefined,
      /**
       * scheme identifier, like "SchemeRegistrar" or "ContributionReward".
       * pass null if registering a non-arc scheme
       */
      schemeName: null,
      /**
       * hash of scheme parameters. These must be already registered with the new scheme.
       */
      schemeParametersHash: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as ProposeToAddModifySchemeParams;

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.scheme) {
      throw new Error("scheme is not defined");
    }

    if (!options.schemeParametersHash) {
      throw new Error("schemeParametersHash is not defined");
    }

    /**
     * throws an Error if not valid, yields 0 if null or undefined
     */
    let isRegistering;

    if (options.schemeName) {
      try {
        /**
         * schemeName must represent a wrapped contract
         */
        const newScheme = await Contracts.getContractWrapper(options.schemeName, options.scheme);
        /**
         * Note that the javascript wrapper "newScheme" we've gotten here is defined in this version of Arc.
         * If newScheme is actually coming from a different version of Arc, then theoretically
         * the permissions could be different from this version.
         */
        const permissions = Number(newScheme.getDefaultPermissions());

        if (permissions > Number(this.getDefaultPermissions())) {
          throw new Error(
            "SchemeRegistrar cannot work with schemes having greater permissions than its own"
          );
        }

        /* tslint:disable-next-line:no-bitwise */
        isRegistering = (permissions & 2) !== 0;
      } catch (ex) {
        throw new Error(
          /* tslint:disable-next-line:max-line-length */
          `Unable to obtain default information from the given scheme address. The address is invalid or the scheme is not an Arc scheme and in that case you must supply fee and tokenAddress. ${ex}`
        );
      }
    } else {
      isRegistering = options.isRegistering;

      if (isRegistering === null) {
        throw new Error(
          "isRegistering is not defined; it is required for non-Arc schemes (schemeName is undefined)"
        );
      }
    }

    const tx = await this.contract.proposeScheme(
      options.avatar,
      options.scheme,
      options.schemeParametersHash,
      isRegistering
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
      scheme: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.scheme) {
      throw new Error("scheme address is not defined");
    }

    const tx = await this.contract.proposeToRemoveScheme(
      options.avatar,
      options.scheme
    );

    return new ArcTransactionProposalResult(tx);
  }

  public async setParams(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>> {
    return super.setParams(
      params.voteParametersHash,
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public getDefaultPermissions(overrideValue?: string): string {
    return overrideValue || "0x00000003";
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
  avatar: string;
  /**
   * scheme address
   */
  scheme: string;
  /**
   * scheme identifier, like "SchemeRegistrar" or "ContributionReward".
   * pass null if registering a non-arc scheme
   */
  schemeName?: string | null;
  /**
   * hash of scheme parameters. These must be already registered with the new scheme.
   */
  schemeParametersHash: string;
  /**
   * true if the given scheme is able to register/unregister/modify schemes.
   *
   * isRegistering should only be supplied when schemeName is not given (and thus the scheme is non-Arc).
   * Otherwise we determine its value based on scheme and schemeName.
   */
  isRegistering?: boolean | null;
}

export interface ProposeToRemoveSchemeParams {
  /**
   * avatar address
   */
  avatar: string;
  /**
   *  the address of the global constraint to remove
   */
  scheme: string;
}
