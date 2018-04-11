import { TransactionService } from "../test-dist/transactionService";
import { DAO } from "../test-dist/DAO";
import "./helpers";

describe("TransactionService", () => {

  it("can get tx counter function from TransactionService", async () => {

    const fnCount = TransactionService.getTransactionCountForAction(DAO.new);

    assert(typeof fnCount === "function");
    assert.equal(fnCount({}), 3);
    assert.equal(fnCount({
      schemes: [
        { name: "SchemeRegistrar" },
      ]
    }), 4);
    assert.equal(fnCount({
      schemes: [
        { name: "SchemeRegistrar" },
        { name: "UpgradeScheme" },
      ]
    }), 5);
    assert.equal(fnCount({
      schemes: [
        { name: "SchemeRegistrar" },
        {
          name: "UpgradeScheme",
          votingMachineParams: {
            votePerc: 30,
            ownerVote: true
          }
        },
      ]
    }), 6);
  });

  it("can get tx counter function when called directly", async () => {
    assert(typeof DAO.transactionsInNew === "function");
    assert.equal(DAO.transactionsInNew({}), 3);
  });
});
