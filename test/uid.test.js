const { describe, it } = require("node:test");
const assert = require("node:assert");

const { uid } = require("../lib/uid.js");

const urlAlphabet =
  "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

describe("uid.js", function () {
  it("uid, default size is 21", function () {
    assert.equal(uid().length, 21);
  });

  it("uid, respects the size argument", function () {
    assert.equal(uid(10).length, 10);
    assert.equal(uid(1).length, 1);
  });

  it("uid, uses only the alphabet symbols", function () {
    for (const symbol of uid(1000)) {
      assert.ok(urlAlphabet.includes(symbol), `unexpected symbol: ${symbol}`);
    }
  });

  it("uid, values are not repeated", function () {
    const values = new Set();
    for (let i = 0; i < 1000; i++) values.add(uid());
    assert.equal(values.size, 1000);
  });

  it("uid, uses the whole alphabet", function () {
    const symbols = new Set(uid(20000));

    assert.equal(symbols.size, urlAlphabet.length);
  });

  it("uid, stays valid across pool refills", function () {
    const values = new Set();
    for (let i = 0; i < 500; i++) values.add(uid(21));

    assert.equal(values.size, 500);
    for (const value of values) {
      assert.equal(value.length, 21);
      for (const symbol of value) assert.ok(urlAlphabet.includes(symbol));
    }
  });

  it("uid, a size bigger than the pool is filled to the end", function () {
    const value = uid(5000);

    assert.equal(value.length, 5000);
    assert.ok(new Set(value.slice(-500)).size > 10, "the tail is not random");
  });

  it("uid, mixed sizes keep working", function () {
    uid(5000);
    const value = uid(21);

    assert.equal(value.length, 21);
    for (const symbol of value) assert.ok(urlAlphabet.includes(symbol));
  });

  it("uid, zero size", function () {
    assert.equal(uid(0), "");
    assert.equal(uid().length, 21);
  });
});
