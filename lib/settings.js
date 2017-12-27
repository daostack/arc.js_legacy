import { requireContract } from './utils.js';

const GenesisScheme = requireContract("GenesisScheme");

/**
   * These are uninitialized instances of ExtendTruffleContract,
   * effectively class factories.
 */
import { GlobalConstraintRegistrar } from   './globalconstraintregistrar.js';
import { SchemeRegistrar } from   './schemeregistrar.js';
import { ContributionReward } from   './ContributionReward.js';
import { AbsoluteVote} from "./absoluteVote.js";
import { TokenCapGC} from "./tokenCapGC.js";
import { UpgradeScheme } from   './upgradescheme.js';

const getSettings = async function(){
  /**
   * These are deployed contract instances represented by their respective Arc
   * javascript wrappers (ExtendTruffleContract).
   *
   * `deployed()` is a static method on each of those classes.
   **/
  const contributionReward = await ContributionReward.deployed();
  const genesisScheme = await GenesisScheme.deployed();
  const globalConstraintRegistrar = await GlobalConstraintRegistrar.deployed();
  const schemeRegistrar = await SchemeRegistrar.deployed();
  const tokenCapGC = await TokenCapGC.deployed();
  const upgradeScheme = await UpgradeScheme.deployed();
  const absoluteVote = await AbsoluteVote.deployed();

  /**
   * `contract` here is an uninitialized instance of ExtendTruffleContract,
   * basically the class factory.
   * Calling contract.at() (a static method on the class) will return a
   * the properly initialized instance of ExtendTruffleContract.
   */
  return {
    votingMachine: absoluteVote.address,
    daostackContracts: {
      ContributionReward: {
        contract: ContributionReward,
        address: contributionReward.address,
      },
      GenesisScheme: {
        contract: GenesisScheme,
        address: genesisScheme.address,
      },
      GlobalConstraintRegistrar: {
        contract: GlobalConstraintRegistrar,
        address: globalConstraintRegistrar.address,
      },
      SchemeRegistrar: {
        contract: SchemeRegistrar,
        address: schemeRegistrar.address,
      },
      TokenCapGC: {
        contract: TokenCapGC,
        address: tokenCapGC.address,
      },
      UpgradeScheme: {
        contract: UpgradeScheme,
        address: upgradeScheme.address,
      },
      AbsoluteVote: {
        contract: AbsoluteVote,
        address: absoluteVote.address,
      }
    }
  };
};

export { getSettings };
