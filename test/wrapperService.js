import { WrapperService } from "../test-dist/wrapperService";
import { NULL_ADDRESS, DefaultLogLevel } from "./helpers";
import { UpgradeSchemeWrapper } from "../test-dist/wrappers/upgradescheme";
import { LoggingService, LogLevel } from "../test-dist/loggingService";
import {
  ContractWrappers,
  ContractWrapperFactories,
  ContractWrappersByType,
  ContractWrappersByAddress
} from "../test-dist/index";

describe("WrapperService", () => {

  it("Can enumerate wrappers", () => {
    for (const wrapperName in ContractWrappers) {
      const wrapper = ContractWrappers[wrapperName];
      assert.isOk(wrapper);
      assert(wrapper.name.length > 0);
    }
  });


  it("Can enumerate allWrappers", () => {
    for (const wrapper of ContractWrappersByType.allWrappers) {
      assert.isOk(wrapper);
      assert(wrapper.name.length > 0);
    }
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
    LoggingService.setLogLevel(LogLevel.none);
    const wrapper = await WrapperService.getContractWrapper("UpgradeScheme", NULL_ADDRESS);
    LoggingService.setLogLevel(DefaultLogLevel);
    assert.equal(wrapper, undefined);
  });
});
