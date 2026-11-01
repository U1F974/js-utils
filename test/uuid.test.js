const { describe, it } = require("node:test");
const assert = require("node:assert");

const { uuid } = require("../lib/uuid.js");

const format = (version) =>
  new RegExp(
    `^[0-9a-f]{8}-[0-9a-f]{4}-${version}[0-9a-f]{3}` +
      `-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`
  );

const V4 = format(4);
const V7 = format(7);

describe("uuid.js", function () {
  it("v4, matches the uuid format", function () {
    assert.match(uuid.v4(), V4);
  });

  it("v4, hex format has no dashes", function () {
    const value = uuid.v4("hex");

    assert.equal(value.length, 32);
    assert.match(value, /^[0-9a-f]{32}$/);
  });

  it("v4, values are not repeated", function () {
    const values = new Set();
    for (let i = 0; i < 1000; i++) values.add(uuid.v4());
    assert.equal(values.size, 1000);
  });

  it("v7, matches the uuid format", function () {
    assert.match(uuid.v7(), V7);
  });

  it("v7, hex format has no dashes", function () {
    const value = uuid.v7("hex");

    assert.equal(value.length, 32);
    assert.match(value, /^[0-9a-f]{32}$/);
  });

  it("v7, timestamp prefix holds the current time", function () {
    const before = Date.now();
    const msec = Number.parseInt(uuid.v7("hex").slice(0, 12), 16);

    assert.ok(msec >= before - 1000 && msec <= Date.now() + 1000);
  });

  it("v7, timestamp prefix does not go backwards", function () {
    const prefixes = [];
    for (let i = 0; i < 100; i++) prefixes.push(uuid.v7("hex").slice(0, 12));

    assert.deepStrictEqual(prefixes, [...prefixes].sort());
  });

  it("v7, values are not repeated", function () {
    const values = new Set();
    for (let i = 0; i < 1000; i++) values.add(uuid.v7());
    assert.equal(values.size, 1000);
  });

  it("v7, the symbol after the version takes all 16 values", function () {
    const symbols = new Set();
    for (let i = 0; i < 2000; i++) symbols.add(uuid.v7("hex")[13]);

    assert.equal(symbols.size, 16);
  });

  it("v7, both formats stay valid across pool refills", function () {
    const values = new Set();
    for (let i = 0; i < 3000; i++) {
      const value = i % 2 === 0 ? uuid.v7() : uuid.v7("hex");
      const dashed =
        value.length === 32
          ? value.replace(/^(.{8})(.{4})(.{4})(.{4})/, "$1-$2-$3-$4-")
          : value;

      assert.match(dashed, V7);
      values.add(dashed);
    }

    assert.equal(values.size, 3000);
  });
});
