import { assert } from "chai";
import * as helpers from "./helpers";
import { Address } from "../lib/commonTypes";
import { InitializeArcJs, Utils } from "../lib/index";
import { AccountService } from "../lib/accountService";

describe("AccountService", async () => {

  it("watch callback detects account change", async () => {

    await InitializeArcJs({
      watchForAccountChanges: true
    });

    let fired = false;

    new Promise((resolve, reject) => {
      AccountService.subscribeToAccountChanges((account: Address) => { fired = true; resolve(); });
    });

    const saveGetDefaultAccount = Utils.getDefaultAccount;
    Utils.getDefaultAccount = () => { return Promise.resolve(helpers.SOME_ADDRESS); };

    await helpers.sleep(2000);

    Utils.getDefaultAccount = saveGetDefaultAccount;
    AccountService.endAccountWatch();

    assert(fired, "event was not fired");
  });
});
