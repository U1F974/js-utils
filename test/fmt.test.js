const { describe, it } = require("node:test");
const assert = require("node:assert");

const {
  inspectFmt,
  jsonFmt,
  toLower,
  toUpper,
  capitalize,
} = require("../lib/fmt.js");

describe("fmt.js", function () {
  it("jsonFmt", function () {
    const input = {
      name: "ivan",
      age: 11,
      wallet: { balance: 1233675445217861n },
    };
    const output = `{
  "name": "ivan",
  "age": 11,
  "wallet": {
    "balance": "1233675445217861"
  }
}`;

    assert.deepStrictEqual(jsonFmt(input), output);
  });

  it("toUpper", function () {
    assert.equal(toUpper("Hello World"), "HELLO WORLD");
  });

  it("toUpper, value 'null'", function () {
    assert.equal(toUpper(null), undefined);
  });

  it("toLower and toUpper are mirrored", function () {
    assert.equal(toLower(toUpper("Hello")), "hello");
  });

  it("capitalize", function () {
    assert.equal(capitalize("hello world"), "Hello world");
  });

  it("capitalize, lowers the rest", function () {
    assert.equal(capitalize("hELLO"), "Hello");
  });

  it("capitalize, single letter", function () {
    assert.equal(capitalize("a"), "A");
  });

  it("capitalize, empty string", function () {
    assert.equal(capitalize(""), "");
  });

  it("capitalize, value 'null'", function () {
    assert.equal(capitalize(null), undefined);
  });

  it("capitalize, value 'undefined'", function () {
    assert.equal(capitalize(undefined), undefined);
  });

  it("jsonFmt, respects the space argument", function () {
    assert.equal(jsonFmt({ a: 1 }, 0), '{"a":1}');
  });

  it("inspectFmt, unfolds nested objects", function () {
    const output = inspectFmt({ a: { b: { c: { d: { e: 1 } } } } });

    assert.ok(output.includes("e: 1"));
    assert.ok(!output.includes("[Object]"));
  });

  it("inspectFmt, compact mode is a single line", function () {
    const data = { a: 1, b: 2 };

    assert.ok(!inspectFmt(data, true).includes("\n"));
  });

  it("toLower", function () {
    assert.equal(toLower("Hello World"), "hello world");
  });

  it("toLower, value 'null'", function () {
    assert.equal(toLower(null), undefined);
  });
});
