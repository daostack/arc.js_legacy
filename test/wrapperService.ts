import { assert } from "chai";
import {
  IContractWrapperBase
} from "../lib/iContractWrapperBase";
import { LoggingService, LogLevel } from "../lib/loggingService";
import { GenesisProtocolWrapper } from "../lib/wrappers/genesisProtocol";
import { UpgradeSchemeWrapper } from "../lib/wrappers/upgradeScheme";
import {
  ContractWrapperFactories,
  ContractWrappers,
  ContractWrappersByAddress,
  ContractWrappersByType
} from "../lib/wrapperService";
import { WrapperService } from "../lib/wrapperService";
import { DefaultLogLevel, SOME_ADDRESS } from "./helpers";

describe("WrapperService", () => {

  it("can filter loading of contracts", async () => {

    // const savedWrappers = WrapperService.wrappers;

    // WrapperService.wrappers = {};

    await WrapperService.initialize({
      filter: {
        ContributionReward: true,
        GenesisProtocol: true,
      },
    });

    assert.equal(WrapperService.wrappers.GlobalConstraintRegistrar, null);
    assert.isOk(WrapperService.wrappers.GenesisProtocol);
    assert(WrapperService.wrappers.GenesisProtocol instanceof GenesisProtocolWrapper);

    await WrapperService.initialize();
  });

  it("Can enumerate wrappers", () => {
    for (const wrapperName in ContractWrappers) {
      if (ContractWrappers.hasOwnProperty(wrapperName)) {
        const wrapper = ContractWrappers[wrapperName];
        assert.isOk(wrapper);
        assert(wrapper.name.length > 0);
      }
    }
  });

  it("Can enumerate allWrappers", () => {
    ContractWrappersByType.allWrappers.forEach((wrapper: IContractWrapperBase) => {
      assert.isOk(wrapper);
      assert(wrapper.name.length > 0);
    });
  });

  it("can import quick-access types", async () => {
    assert.isOk(ContractWrappers);
    assert.isOk(ContractWrappers.UpgradeScheme);
    assert.isOk(ContractWrapperFactories);
    assert.isOk(ContractWrapperFactories.UpgradeScheme);
    assert.isOk(ContractWrappersByType);
    assert.isOk(ContractWrappersByType.schemes);
    assert.isOk(ContractWrappersByAddress);
    assert.isOk(ContractWrappersByAddress.get(ContractWrappers.UpgradeScheme.address));
  });

  it("has a working getContractWrapper() function", async () => {
    const wrapper = await WrapperService.getContractWrapper("UpgradeScheme");
    assert.isOk(wrapper);
    assert(wrapper instanceof UpgradeSchemeWrapper);
  });

  it("getContractWrapper() function handles bad wrapper name", async () => {
    const wrapper = await WrapperService.getContractWrapper("NoSuchScheme");
    assert.equal(wrapper, undefined);
  });

  it("getContractWrapper() function handles bad address", async () => {
    LoggingService.logLevel = LogLevel.none;
    const wrapper = await WrapperService.getContractWrapper("UpgradeScheme", SOME_ADDRESS);
    LoggingService.logLevel = DefaultLogLevel;
    assert.equal(wrapper, undefined);
  });
});
