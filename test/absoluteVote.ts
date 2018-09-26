import { assert } from "chai";
import {
  AbsoluteVoteFactory,
} from "../lib/wrappers/absoluteVote";
import * as helpers from "./helpers";

describe("AbsoluteVote", () => {

  it("can get params hash", async () => {

    const absoluteVote = await AbsoluteVoteFactory.new();

    const params = await {
      ownerVote: true,
      votePerc: 50,
    };

    const paramsHashSet = (await absoluteVote.setParameters(params)).result;

    const paramsHashGet = await absoluteVote.getParametersHash(params);

    assert.equal(paramsHashGet, paramsHashSet, "Hashes are not the same");
  });
});
