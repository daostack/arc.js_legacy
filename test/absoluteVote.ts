import { assert } from "chai";
import { InitializeArcJs } from "../lib";
import {
  AbsoluteVoteFactory,
} from "../lib/wrappers/absoluteVote";
import * as helpers from "./helpers";

beforeEach(async () => {
  await InitializeArcJs();
});

describe("AbsoluteVote", () => {

  it("can get params hash", async () => {

    const absoluteVote = await AbsoluteVoteFactory.at("0x951b08e74181d8d6127485af030f235865586a98");

    const params = await {
      ownerVote: true,
      votePerc: 50,
    };

    const paramsHashSet = (await absoluteVote.setParameters(params)).result;

    const paramsHashGet = await absoluteVote.getParametersHash(params);

    assert.equal(paramsHashGet, paramsHashSet, "Hashes are not the same");
  });
});
