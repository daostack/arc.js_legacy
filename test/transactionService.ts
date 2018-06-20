import { assert } from "chai";
import { TransactionReceiptsEventInfo, TransactionService } from "../lib/transactionService";
import * as helpers from "./helpers";

describe("TransactionService", () => {

  it("can get tx events from DAO.new", async () => {

    let txCount = 0;
    let invocationKey: symbol;

    const subscription = TransactionService.subscribe("txReceipts.DAO.new",
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        if (!invocationKey) {
          invocationKey = txEventInfo.invocationKey;
        }

        assert.equal(invocationKey, txEventInfo.invocationKey, "invocationKey doesn't match");
        assert.equal(topic, "txReceipts.DAO.new");
        assert.isOk(txEventInfo.options);
        assert.isOk(txEventInfo.options.schemes);
        assert.equal(txEventInfo.options.schemes.length, 2);
        assert.equal(txEventInfo.txCount, 6);
        assert((txCount > 0) || txEventInfo.tx === null);
        assert((txCount === 0) || txEventInfo.tx !== null);
        ++txCount;
      });

    try {
      await helpers.forgeDao({
        schemes: [
          { name: "SchemeRegistrar" },
          {
            name: "UpgradeScheme",
            votingMachineParams: {
              ownerVote: true,
              votePerc: 30,
            },
          },
        ],
      });
    } finally {
      subscription.unsubscribe();
    }

    assert.equal(txCount, 7);
  });
});
