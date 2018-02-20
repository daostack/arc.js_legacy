"use strict";

import { Utils } from "../utils";
import { ExtendTruffleContract } from "../ExtendTruffleContract";
const SolidityContract = Utils.requireContract("AbsoluteVote");
import ContractWrapperFactory from "../ContractWrapperFactory";

export class TestWrapperWrapper extends ExtendTruffleContract {

    constructor() {
        super(SolidityContract);
    }

    foo() {
        return "bar";
    }

    aMethod() {
        return "abc";
    }

    async setParams(params) {
        params = Object.assign({},
            {
                reputation: "0x1000000000000000000000000000000000000000",
                votePerc: 50,
                ownerVote: true
            },
            params);

        return super.setParams(
            params.reputation,
            params.votePerc,
            params.ownerVote
        );
    }

    getDefaultPermissions(overrideValue?: string) {
        return overrideValue || "0x00000009";
    }
}

const TestWrapper = new ContractWrapperFactory(SolidityContract, TestWrapperWrapper);
export { TestWrapper };
