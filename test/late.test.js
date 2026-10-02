const { describe, it } = require("node:test");
const assert = require("node:assert");

const { late } = require("../lib/late.js");

describe("late.js", function () {
  it("returns null", function () {
    assert.equal(late(), null);
  });

  it("returns null on every call", function () {
    assert.equal(late(), late());
  });

  it("ignores arguments", function () {
    assert.equal(late(1, 2), null);
  });
});
