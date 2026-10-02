const { describe, it } = require("node:test");
const assert = require("node:assert");

const { randomBigInt } = require("../lib/bigint.js");

describe("bigint.js", function () {
  it("randomBigInt, returns bigint", function () {
    assert.equal(typeof randomBigInt(), "bigint");
  });

  it("randomBigInt, fits into the default 64 bits", function () {
    for (let i = 0; i < 100; i++) {
      const value = randomBigInt();
      assert.ok(value >= 0n && value < 2n ** 64n, `out of range: ${value}`);
    }
  });

  it("randomBigInt, respects the bits argument", function () {
    for (let i = 0; i < 100; i++) {
      const value = randomBigInt(8);
      assert.ok(value >= 0n && value < 256n, `out of range: ${value}`);
    }
  });

  it("randomBigInt, values are not repeated", function () {
    const values = new Set();
    for (let i = 0; i < 100; i++) values.add(randomBigInt());
    assert.ok(values.size > 90, `too many collisions: ${values.size}/100`);
  });
});
