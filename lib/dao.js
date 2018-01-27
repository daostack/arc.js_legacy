"use strict";
const dopts = require("default-options");

import { getDeployedContracts } from "./contracts.js";
import { Utils } from "./utils";
const Avatar = Utils.requireContract("Avatar");
const Controller = Utils.requireContract("Controller");
const DAOToken = Utils.requireContract("DAOToken");
const GenesisScheme = Utils.requireContract("GenesisScheme");
const Reputation = Utils.requireContract("Reputation");
const AbsoluteVote = Utils.requireContract("AbsoluteVote");

export class DAO {
  constructor() { }

  static async new(opts) {

    const contracts = await getDeployedContracts();

    const defaults = {
      orgName: null,
      tokenName: null,
      tokenSymbol: null,
      founders: [],
      universalController: true,
      votingMachineParams: {},
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
      Utils.NULL_ADDRESS
    );
    // get the address of the avatar from the logs
    const avatarAddress = Utils.getValueFromLogs(tx, "_avatar", "NewOrg");
    const dao = new DAO();

    dao.avatar = await Avatar.at(avatarAddress);
    const controllerAddress = await dao.avatar.owner();
    dao.controller = await Controller.at(controllerAddress);

    const tokenAddress = await dao.controller.nativeToken();
    dao.token = await DAOToken.at(tokenAddress);

    const reputationAddress = await dao.controller.nativeReputation();
    dao.reputation = await Reputation.at(reputationAddress);

    const defaultVotingMachineParams = dopts(options.votingMachineParams, {
      reputationAddress: reputationAddress,
      votingMachineAddress: contracts.allContracts.AbsoluteVote.address,
      votePerc: 50,
      ownerVote: true
    }, { allowUnknown: true });

    /**
     * TODO: dao.votingMachine may soon have to go
     */
    dao.votingMachine = await AbsoluteVote.at(defaultVotingMachineParams.votingMachineAddress);

    await dao.votingMachine.setParameters(
      defaultVotingMachineParams.reputationAddress,
      defaultVotingMachineParams.votePerc,
      defaultVotingMachineParams.ownerVote
    );

    const defaultVoteParametersHash = await dao.votingMachine.getParametersHash(
      defaultVotingMachineParams.reputationAddress,
      defaultVotingMachineParams.votePerc,
      defaultVotingMachineParams.ownerVote
    );

    // TODO: these are specific configuration options that should be settable in the options above
    const initialSchemesSchemes = [];
    const initialSchemesParams = [];
    const initialSchemesPermissions = [];

    for (const schemeOptions of options.schemes) {
      const arcSchemeInfo = contracts.allContracts[schemeOptions.name];
      if (!arcSchemeInfo) {
        throw new Error(
          "Non-arc schemes are not currently supported here.  You can add them later in your workflow."
        );
      }

      /**
       * scheme will be a contract wrapper
       */
      const scheme = await arcSchemeInfo.contract.at(
        schemeOptions.address || arcSchemeInfo.address
      );

      /**
       * any supplied voting machine parameters for the scheme will override the global defaults
       */
      let schemeVotingMachineParams = {};
      let schemeVoteParametersHash;

      if (schemeOptions.votingMachineParams && (schemeOptions.votingMachineParams != {})) {

        Object.assign(schemeVotingMachineParams, defaultVotingMachineParams, schemeOptions.votingMachineParams);

        await dao.votingMachine.setParameters(
          schemeVotingMachineParams.reputationAddress,
          schemeVotingMachineParams.votePerc,
          schemeVotingMachineParams.ownerVote
        );
        schemeVoteParametersHash = await dao.votingMachine.getParametersHash(
          schemeVotingMachineParams.reputationAddress,
          schemeVotingMachineParams.votePerc,
          schemeVotingMachineParams.ownerVote
        );
      } else {
        schemeVotingMachineParams = defaultVotingMachineParams;
        schemeVoteParametersHash = defaultVoteParametersHash;
      }

      /**
       * This is the set of all possible parameters from which the current scheme will choose just the ones it requires
       */
      const schemeParamsHash = (await scheme.setParams(
        Object.assign(
          {
            voteParametersHash: schemeVoteParametersHash,
            votingMachine: schemeVotingMachineParams.votingMachineAddress,
            orgNativeTokenFee: 0
          },
          schemeOptions.additionalParams || {}
        ))).result;

      initialSchemesSchemes.push(scheme.address);
      initialSchemesParams.push(schemeParamsHash);
      /**
       * Make sure the scheme has at least its required permissions, regardless of what the caller
       * passes in.
       */
      const requiredPermissions = Utils.permissionsStringToNumber(scheme.getDefaultPermissions());
      const additionalPermissions = Utils.permissionsStringToNumber(schemeOptions.permissions);
      initialSchemesPermissions.push(Utils.numberToPermissionsString(requiredPermissions | additionalPermissions));
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

    /**
     * TODO: dao.votingMachine may soon have to go
     * What about contracts.defaultVotingMachine?
     */
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
  async getSchemes(name) {
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
   * Returns an Arc-Js scheme wrapper, or undefined if not found
   * @param contract - name of an Arc scheme, like "SchemeRegistrar"
   * @param address - optional
   */
  async getScheme(contract, address) {
    const contracts = await getDeployedContracts();
    const contractInfo = contracts.allContracts[contract];
    if (!contractInfo) {
      return undefined;
    }
    return await contractInfo.contract.at(address ? address : contractInfo.address)
      .then((contract) => contract, () => undefined);
  }

  /**
   * returns whether the scheme with the given name is registered to this DAO's controller
   */
  async isSchemeRegistered(schemeAddress) {
    return await this.controller.isSchemeRegistered(schemeAddress, this.avatar.address);
  }

  /**
   * Returns global constraints currently registered into this DAO, as Array<DaoGlobalConstraintInfo>
   * @param name like "TokenCapGC"
   */
  async getGlobalConstraints(name) {
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
    return web3.toAscii(await this.avatar.orgName());
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

  /**
   * Returns promise of the DAOstack avatar address, or undefined if not found
   */
  static async getDAOstack(genesisSchemeAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        const contracts = await getDeployedContracts();
        const genesisScheme = await GenesisScheme.at(genesisSchemeAddress ? genesisSchemeAddress : contracts.allContracts.GenesisScheme.address);
        let event = genesisScheme.InitialSchemesSet({}, { fromBlock: 0 });
        let avatarAddress;
        /**
         * this first DAO returned will be DAOstack
         */
        event.get((err, eventsArray) => {
          if (eventsArray.length) {
            avatarAddress = eventsArray[0].args._avatar;
          }
          event.stopWatching(); // maybe not necessary, but just in case...
          resolve(avatarAddress);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }
}
