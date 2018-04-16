import { DaoCreatorFactory } from "../test-dist/wrappers/daocreator";
import "./helpers";

describe("DaoCreator", () => {

  it("can call new with no controllerCreatorAddress", async () => {

    const daoCreator = await DaoCreatorFactory.new();
    assert.isOk(daoCreator, "daoCreator is not set");
    assert(daoCreator.address, "daoCreator has no address");
  });
});
