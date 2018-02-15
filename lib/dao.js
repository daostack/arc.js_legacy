"use strict";
import { AvatarService } from "./avatarService";
import { DaoCreator } from "./contracts/daocreator";
import { Contracts } from "./contracts.js";
import { Utils } from "./utils";

export class DAO {
  static async new(opts) {

    let daoCreator;

    if (opts.daoCreator) {
      daoCreator = await DaoCreator.at(opts.daoCreator);
    } else {
      daoCreator = await DaoCreator.deployed();
    }

    const result = await daoCreator.forgeOrg(opts);

    const avatarAddress = result.getValueFromTx("_avatar", "NewOrg");

    await daoCreator.setSchemes(Object.assign({ avatar: avatarAddress }, opts));

    return DAO.at(avatarAddress);
  }

  static async at(avatarAddress) {
    const dao = new DAO();

    const avatarService = new AvatarService(avatarAddress);
    dao.avatar = await avatarService.getAvatar();
    dao.controller = await avatarService.getController();
    dao.hasUController = avatarService.isUController;
    dao.token = await avatarService.getNativeToken();
    dao.reputation = await avatarService.getNativeReputation();

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
    const contracts = await Contracts.getDeployedContracts();

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
   * Returns an Arc.js scheme wrapper, or undefined if not found
   * @param contract - name of an Arc scheme, like "SchemeRegistrar"
   * @param address - optional
   */
  async getScheme(contract, address) {
    const contracts = await Contracts.getDeployedContracts();
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
    const contracts = await Contracts.getDeployedContracts();

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
      if (await controller.isGlobalConstraintRegistered(gc.address, avatar.address)) {
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
      const address = eventsArray[i].args._globalConstraint;
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
   * @return {Promise<string>}
   */
  async getName() {
    return Utils.getWeb3().toUtf8(await this.avatar.orgName());
  }

  /**
   * Returns the token name for the DAO as stored in the native token
   * @return {Promise<string>}
   */
  async getTokenName() {
    return await this.token.name();
  }

  /**
   * Returns the token symbol for the DAO as stored in the native token
   * @return {Promise<string>}
   */
  async getTokenSymbol() {
    return await this.token.symbol();
  }

  /**
   * Given a scheme wrapper, returns an array of the scheme's parameter values.
   * The order of values in the array corresponds to the
   * order in which they are defined in the structure in which they
   * are stored in the scheme contract.
   * @param {any} scheme
   */
  async getSchemeParameters(scheme) {
    const schemeParams = await this.controller.getSchemeParameters(scheme.address, this.avatar.address);
    return await scheme.parameters(schemeParams);
  }

  /**
   * Returns promise of the DAOstack Genesis avatar address, or undefined if not found
   */
  static async getGenesisDao(daoCreatorAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        const contracts = await Contracts.getDeployedContracts();
        const daoCreator = await DaoCreator.at(daoCreatorAddress ? daoCreatorAddress : contracts.allContracts.DaoCreator.address);
        const event = daoCreator.InitialSchemesSet({}, { fromBlock: 0 });
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
