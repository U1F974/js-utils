const { describe, it } = require("node:test");
const assert = require("node:assert");

const { safeJsonParse } = require("../lib/json.js");

describe("json.js", function () {
  it("safeJsonParse, object", function () {
    assert.deepStrictEqual(safeJsonParse('{"a":1}'), { a: 1 });
  });

  it("safeJsonParse, array", function () {
    assert.deepStrictEqual(safeJsonParse("[1,2]"), [1, 2]);
  });

  it("safeJsonParse, 'null' literal", function () {
    assert.equal(safeJsonParse("null"), null);
  });

  it("safeJsonParse, invalid json", function () {
    assert.equal(safeJsonParse("invalid"), undefined);
  });

  it("safeJsonParse, value 'undefined'", function () {
    assert.equal(safeJsonParse(undefined), undefined);
  });

  it("safeJsonParse, does not throw", function () {
    assert.doesNotThrow(() => safeJsonParse("{"));
  });
});
