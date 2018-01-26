"use strict";
const dopts = require("default-options");

import { getDeployedContracts } from "../contracts.js";
import { Utils } from "../utils";
import { ExtendTruffleContract, ArcTransactionProposalReturnType } from "../ExtendTruffleContract";

const SoliditySchemeRegistrar = Utils.requireContract("SchemeRegistrar");

export class SchemeRegistrar extends ExtendTruffleContract(
  SoliditySchemeRegistrar
) {
  static async new() {
    const contract = await SoliditySchemeRegistrar.new();
    return new this(contract);
  }

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
  async proposeToAddModifyScheme(opts = {}) {
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
      /**
       * true if the given scheme is able to register/unregister/modify schemes.
       *
       * isRegistering should only be supplied when schemeName is not given (and thus the scheme is non-Arc).
       * Otherwise we determine it's value based on scheme and schemeName.
       */
      isRegistering: null
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

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
        const contracts = await getDeployedContracts();
        const newScheme = await contracts.allContracts[
          options.schemeName
        ].contract.at(options.scheme);

        // Note that the javascript wrapper "newScheme" we've gotten here is defined in this version of Arc.  If newScheme is
        // actually coming from a different version of Arc, then theoretically the permissions could be different from this version.
        const permissions = Number(newScheme.getDefaultPermissions());

        if (permissions > this.getDefaultPermissions()) {
          throw new Error(
            "SchemeRegistrar cannot work with schemes having greater permissions than its own"
          );
        }

        isRegistering = (permissions & 2) != 0;
      } catch (ex) {
        throw new Error(
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

    return new ArcTransactionProposalReturnType(tx);
  }

  async proposeToRemoveScheme(opts = {}) {
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      /**
       * scheme address
       */
      scheme: undefined
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

    return new ArcTransactionProposalReturnType(tx);
  }

  async setParams(params) {
    return await this._setParameters(
      params.voteParametersHash,
      params.voteParametersHash,
      params.votingMachine
    );
  }

  getDefaultPermissions(overrideValue) {
    return overrideValue || "0x00000003";
  }
}
