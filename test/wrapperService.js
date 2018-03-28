import { WrapperService } from "../test-dist/wrapperService";
import { NULL_ADDRESS } from "./helpers";
import { UpgradeSchemeWrapper } from "../test-dist/wrappers/upgradescheme";

describe("WrapperService", () => {
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
    const wrapper = await WrapperService.getContractWrapper("UpgradeScheme", NULL_ADDRESS);
    assert.equal(wrapper, undefined);
  });
});
