"use strict";
const dopts = require("default-options");

import { getDeployedContracts } from "./contracts.js";
import { getValueFromLogs, requireContract, NULL_ADDRESS, getWeb3 } from "./utils.js";
const Avatar = requireContract("Avatar");
const Controller = requireContract("Controller");
const DAOToken = requireContract("DAOToken");
const GenesisScheme = requireContract("GenesisScheme");
const Reputation = requireContract("Reputation");
const AbsoluteVote = requireContract("AbsoluteVote");

export class DAO {
  constructor() { }

  static async new(opts) {
    // TODO: optimization: we now have all sequantial awaits: parallelize them if possible
    // TODO: estimate gas/ether needed based on given options, check balance of sender, and
    // warn if necessary.
    // TODO: default options need to be extended), cf. https://github.com/daostack/daostack/issues/43
    // TODO: orgName, tokenName and tokenSymbol should be required - implement this
    // QUESTION: should we add options to deploy with existing tokens or rep?
    const contracts = await getDeployedContracts();

    const defaults = {
      orgName: null,
      tokenName: null,
      tokenSymbol: null,
      founders: [],
      votingMachine: contracts.allContracts.AbsoluteVote.address,
      votePrec: 50,
      ownerVote: true,
      orgNativeTokenFee: 0, // used for ContributionReward
      schemeNativeTokenFee: 0, // used for ContributionReward
      genesisScheme: contracts.allContracts.GenesisScheme.address,
      schemes: []
    };

    const options = dopts(opts, defaults, { allowUnknown: true });
    const genesisScheme = await GenesisScheme.at(options.genesisScheme);

    const tx = await genesisScheme.forgeOrg(
      options.orgName,
      options.tokenName,
      options.tokenSymbol,
      options.founders.map(x => x.address),
      options.founders.map(x => x.tokens),
      options.founders.map(x => x.reputation),
      NULL_ADDRESS
    );
    // get the address of the avatar from the logs
    const avatarAddress = getValueFromLogs(tx, "_avatar", "NewOrg");
    const dao = new DAO();

    dao.avatar = await Avatar.at(avatarAddress);
    const controllerAddress = await dao.avatar.owner();
    dao.controller = await Controller.at(controllerAddress);

    const tokenAddress = await dao.controller.nativeToken();
    dao.token = await DAOToken.at(tokenAddress);

    const reputationAddress = await dao.controller.nativeReputation();
    dao.reputation = await Reputation.at(reputationAddress);

    dao.votingMachine = await AbsoluteVote.at(options.votingMachine);
    await dao.votingMachine.setParameters(
      dao.reputation.address,
      options.votePrec,
      options.ownerVote
    );

    const voteParametersHash = await dao.votingMachine.getParametersHash(
      dao.reputation.address,
      options.votePrec,
      options.ownerVote
    );

    // TODO: these are specific configuration options that should be settable in the options above
    const initialSchemesSchemes = [];
    const initialSchemesParams = [];
    const initialSchemesPermissions = [];

    for (const optionScheme of options.schemes) {
      /**
       * TODO:  -dkent
       * Note that at the moment this is only allowing Arc schemes, no non-Arc schemes.
       * Can this change?
       */
      const arcSchemeInfo = contracts.allContracts[optionScheme.name];
      if (!arcSchemeInfo) {
        throw new Error(
          "Non-arc schemes are not currently supported here.  You can add them later in your workflow."
        );
      }
      const scheme = await arcSchemeInfo.contract.at(
        optionScheme.address || arcSchemeInfo.address
      );

      const paramsHash = await scheme.setParams({
        voteParametersHash: voteParametersHash,
        votingMachine: dao.votingMachine.address,
        orgNativeTokenFee: options.orgNativeTokenFee,
        schemeNativeTokenFee: options.schemeNativeTokenFee
      });

      initialSchemesSchemes.push(scheme.address);
      initialSchemesParams.push(paramsHash);
      initialSchemesPermissions.push(
        scheme.getDefaultPermissions(/* TODO: supply options.permissions here? */)
      );
    }

    // register the schemes with the dao
    await genesisScheme.setSchemes(
      dao.avatar.address,
      initialSchemesSchemes,
      initialSchemesParams,
      initialSchemesPermissions
    );

    return dao;
  }

  static async at(avatarAddress) {
    const dao = new DAO();

    dao.avatar = await Avatar.at(avatarAddress);
    const controllerAddress = await dao.avatar.owner();
    dao.controller = await Controller.at(controllerAddress);

    const tokenAddress = await dao.controller.nativeToken();
    dao.token = await DAOToken.at(tokenAddress);

    const reputationAddress = await dao.controller.nativeReputation();
    dao.reputation = await Reputation.at(reputationAddress);

    // TODO: we now just set the default voting machine, and assume it is used
    // throughout, but this assumption is not warranted
    const contracts = await getDeployedContracts();
    if (contracts.defaultVotingMachine) {
      dao.votingMachine = AbsoluteVote.at(contracts.defaultVotingMachine.address);
    }

    return dao;
  }

  /**
   * returns schemes currently registered into this DAO, as Array<DaoSchemeInfo>
   * @param name like "SchemeRegistrar"
   */
  async schemes(name) {
    // return the schemes registered on this controller satisfying the contract spec
    // return all schemes if contract is not given
    const schemes = await this._getSchemes();
    if (name) {
      return schemes.filter(s => s.name === name);
    } else {
      return schemes;
    }
  }

  /**
   * returns schemes currently in this DAO as Array<DaoSchemeInfo>
   */
  async _getSchemes() {
    // private method returns all registered schemes.
    // TODO: this is *expensive*, we need to cache the results (and perhaps poll for latest changes if necessary)
    const schemesMap = new Map(); // <string, DaoSchemeInfo>
    const controller = this.controller;
    const avatar = this.avatar;
    const arcTypesMap = new Map(); // <address: string, name: string>
    const contracts = await getDeployedContracts();

    /**
     * TODO:  This should pull in all known versions of the schemes, names
     * and versions in one fell swoop.
     */
    for (const name in contracts.allContracts) {
      const contract = contracts.allContracts[name];
      arcTypesMap.set(contract.address, name);
    }

    const registerSchemeEvent = controller.RegisterScheme(
      {},
      { fromBlock: 0, toBlock: "latest" }
    );

    await new Promise(resolve => {
      registerSchemeEvent.get((err, eventsArray) =>
        this._handleSchemeEvent(
          err,
          eventsArray,
          true,
          arcTypesMap,
          schemesMap
        ).then(() => {
          registerSchemeEvent.stopWatching();
          resolve();
        })
      );
    });

    const registeredSchemes = [];

    for (const scheme of schemesMap.values()) {
      if (await controller.isSchemeRegistered(scheme.address, avatar.address)) {
        registeredSchemes.push(scheme);
      }
    }

    return registeredSchemes;
  }

  async _handleSchemeEvent(
    err,
    eventsArray,
    adding,
    arcTypesMap,
    schemesMap // : Promise<void>
  ) {
    if (!(eventsArray instanceof Array)) {
      eventsArray = [eventsArray];
    }
    const count = eventsArray.length;
    for (let i = 0; i < count; i++) {
      const schemeAddress = eventsArray[i].args._scheme;
      // will be all zeros if not registered
      const permissions = await this.controller.getSchemePermissions(schemeAddress, this.avatar.address);

      const schemeInfo = {
        address: schemeAddress,
        permissions: permissions,
        // will be undefined if not a known scheme
        name: arcTypesMap.get(schemeAddress)
      };

      // dedup
      schemesMap.set(schemeAddress, schemeInfo);
    }
  }

  /**
   * Returns promise of a scheme as ExtendTruffleScheme, or ? if not found
   * @param contract name of scheme, like "SchemeRegistrar"
   * @param optional address
   */
  async scheme(contract, address) {
    const contracts = await getDeployedContracts();
    const contractInfo = contracts.allContracts[contract];
    return contractInfo.contract.at(address ? address : contractInfo.address);
  }

  async checkSchemeConditions(scheme) {
    // check if the scheme if ready for usage - i.e. if the dao is registered at the scheme and vice versa
    const avatar = this.avatar;

    // check if the controller is registered
    const isControllerRegistered = await this.controller.isSchemeRegistered(scheme.address, avatar.address);
    if (!isControllerRegistered) {
      const msg =
        "The dao is not registered on this schme: " +
        contract +
        "; " +
        contractInfo.address;
      throw new Error(msg);
    }
    return true;
  }

  vote(proposalId, choice, params) {
    // vote for the proposal given by proposalId using this.votingMachine
    // NB: this will not work for proposals using votingMachine's that are not the default one
    return this.votingMachine.vote(proposalId, choice, params);
  }

  /**
   * Returns global constraints currently registered into this DAO, as Array<DaoGlobalConstraintInfo>
   * @param name like "TokenCapGC"
   */
  async globalConstraints(name) {
    // return the global constraints registered on this controller satisfying the contract spec
    // return all global constraints if name is not given
    const constraints = await this._getConstraints();
    if (name) {
      return constraints.filter(s => s.name === name);
    } else {
      return constraints;
    }
  }

  /**
   * returns global constraints currently in this DAO, as DaoGlobalConstraintInfo
   */
  async _getConstraints() {
    // TODO: this is *expensive*, we need to cache the results (and perhaps poll for latest changes if necessary)
    const constraintsMap = new Map(); // <string, DaoGlobalConstraintInfo>
    const controller = this.controller;
    const avatar = this.avatar;
    const arcTypesMap = new Map(); // <address: string, name: string>
    const contracts = await getDeployedContracts();

    /**
     * TODO:  This should pull in all known versions of the constraints, names
     * and versions in one fell swoop.
     */
    for (const name in contracts.allContracts) {
      const contract = contracts.allContracts[name];
      arcTypesMap.set(contract.address, name);
    }

    const event = controller.AddGlobalConstraint(
      {},
      { fromBlock: 0, toBlock: "latest" }
    );

    await new Promise(resolve => {
      event.get((err, eventsArray) =>
        this._handleConstraintEvent(
          err,
          eventsArray,
          true,
          arcTypesMap,
          constraintsMap
        ).then(() => {
          event.stopWatching();
          resolve();
        })
      );
    });

    const registeredConstraints = [];

    for (const gc of constraintsMap.values()) {
      if (await controller.isGlobalConstraintRegister(gc.address, avatar.address)) {
        registeredConstraints.push(gc);
      }
    }

    return registeredConstraints;
  }

  async _handleConstraintEvent(
    err,
    eventsArray,
    adding,
    arcTypesMap,
    constraintsMap // : Promise<void>
  ) {
    if (!(eventsArray instanceof Array)) {
      eventsArray = [eventsArray];
    }
    const count = eventsArray.length;
    for (let i = 0; i < count; i++) {
      const address = eventsArray[i].args._globalconstraint;
      const paramsHash = eventsArray[i].args._params;

      const info = {
        address: address,
        paramsHash: paramsHash,
        // will be undefined if not a known scheme
        name: arcTypesMap.get(address)
      };

      // dedup
      constraintsMap.set(address, info);
    }
  }

  /**
   * Returns the name of the DAO as stored in the Avatar
   * @return {string}
   */
  async getName() {
    return getWeb3().toAscii(await this.avatar.orgName());
  }

  /**
   * Returns the token name for the DAO as stored in the native token
   * @return {string}
   */
  async getTokenName() {
    return await this.token.name();
  }

  /**
   * Returns the token symbol for the DAO as stored in the native token
   * @return {string}
   */
  async getTokenSymbol() {
    return await this.token.symbol();
  }

}
