import { DAO } from "../lib/dao";
import { getDeployedContracts } from "../lib/contracts.js";
import { GenesisProtocol } from "../lib/contracts/genesisProtocol";
import { Utils } from "../lib/utils";
import "./helpers";
const ExecutableTest = Utils.requireContract("ExecutableTest");

describe("GenesisProtocol", () => {
  let dao, genesisProtocol, paramsHash, executableTest;

  beforeEach(async () => {

    dao = await DAO.new({
      name: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT",
      schemes: [
        { name: "GenesisProtocol" }
      ]
    });

    const scheme = await dao.getSchemes("GenesisProtocol");

    assert.isOk(scheme);
    assert.equal(scheme.length, 1);
    assert.equal(scheme[0].name, "GenesisProtocol");

    genesisProtocol = await GenesisProtocol.at(scheme[0].address);

    assert.isOk(genesisProtocol);

    // all default parameters
    paramsHash = (await genesisProtocol.setParams({})).result;

    executableTest = await ExecutableTest.deployed();
  });


  it("can do new", async () => {
    const scheme = await GenesisProtocol.new(Utils.NULL_ADDRESS);
    assert.isOk(scheme);
  });


  it("can do deployed", async () => {
    const scheme = await GenesisProtocol.deployed();
    assert.equal(scheme.address, (await getDeployedContracts()).allContracts.GenesisProtocol.address);
  });

  it("register new proposal", async () => {

    const result = await genesisProtocol.propose({
      avatar: dao.avatar.address,
      numOfChoices: 3,
      paramsHash: paramsHash,
      executable: executableTest.address
    });

    assert.isOk(result);
    assert.isOk(result.proposalId);
  });

  it("register new proposal with no params", async () => {

    try {
      await genesisProtocol.propose({});
      assert(false, "Should have thrown validation exception");
    } catch (ex) {
      assert.equal(ex, "Error: Missing required properties: avatar, paramsHash, executable");
    }
  });

  it("register new proposal with out of range numOfChoices", async () => {

    try {
      await genesisProtocol.propose({
        avatar: dao.avatar.address,
        numOfChoices: 13,
        paramsHash: paramsHash,
        executable: executableTest.address
      });
      assert(false, "Should have thrown validation exception");
    } catch (ex) {
      assert.equal(ex, "Error: numOfChoices must be between 1 and 10");
    }
  });
});
