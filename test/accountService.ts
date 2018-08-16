import { assert } from "chai";
import { AccountService } from "../lib/accountService";
import { Address, fnVoid } from "../lib/commonTypes";
import { InitializeArcJs } from "../lib/index";
import { Utils } from "../lib/utils";
import * as helpers from "./helpers";

describe("AccountService", async () => {

  it("watch callback detects account change", async () => {

    await InitializeArcJs({
      watchForAccountChanges: true,
    });

    let fired = false;

    /* tslint:disable:no-unused-expression */
    new Promise((resolve: fnVoid): void => {
      AccountService.subscribeToAccountChanges((account: Address) => { fired = true; resolve(); });
    });

    const saveGetDefaultAccount = Utils.getDefaultAccount;
    Utils.getDefaultAccount = (): Promise<string> => Promise.resolve(helpers.SOME_ADDRESS);

    await helpers.sleep(2000);

    Utils.getDefaultAccount = saveGetDefaultAccount;
    AccountService.endAccountWatch();
    assert(fired, "event was not fired");
  });
});
