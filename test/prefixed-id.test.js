const { describe, it } = require("node:test");
const assert = require("node:assert");

const { prefixedId } = require("../lib/prefixed-id.js");

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const decodeSeconds = (chars) =>
  [...chars].reduce((seconds, char) => seconds * 62 + BASE62.indexOf(char), 0);

describe("prefixed-id.js", function () {
  it("prefixedId, format", function () {
    assert.match(prefixedId("usr"), /^usr_1[0-9A-Za-z]{26}$/);
  });

  it("prefixedId, encodes the current second", function () {
    const before = Math.floor(Date.now() / 1000);
    const id = prefixedId("usr");
    const after = Math.floor(Date.now() / 1000);

    const seconds = decodeSeconds(id.slice(5, 11));
    assert.ok(
      seconds >= before && seconds <= after,
      `unexpected second: ${seconds}`
    );
  });

  it("prefixedId, encodes the given time", function () {
    const encoded = (ms) => prefixedId("usr", { time: new Date(ms) });

    assert.equal(encoded(0).slice(0, 11), "usr_1000000");
    assert.equal(encoded(61_999).slice(5, 11), "00000z");
    assert.equal(encoded(62_000).slice(5, 11), "000010");
  });

  it("prefixedId, ids sort by their second", function () {
    const seconds = [0, 61, 62, 3843, 3844, 1_000_000_000, 62 ** 6 - 1];
    const ids = seconds.map((second) =>
      prefixedId("usr", { time: new Date(second * 1000) })
    );

    assert.deepStrictEqual([...ids].sort(), ids);
  });

  it("prefixedId, a time out of the range throws", function () {
    assert.throws(() => prefixedId("usr", { time: new Date(-1000) }));
    assert.throws(() =>
      prefixedId("usr", { time: new Date(62 ** 6 * 1000) })
    );
    assert.throws(() => prefixedId("usr", { time: new Date(NaN) }));
  });

  it("prefixedId, owner shares 10 symbols down the chain", function () {
    const org = prefixedId("org");
    const user = prefixedId("usr", { owner: org });
    const token = prefixedId("tok", { owner: user });

    assert.equal(user.slice(-20, -10), org.slice(-20, -10));
    assert.equal(token.slice(-20, -10), org.slice(-20, -10));
    assert.notEqual(user.slice(-10), org.slice(-10));
  });

  it("prefixedId, a short owner is padded with zeros", function () {
    const shared = (owner) => prefixedId("usr", { owner }).slice(-20, -10);

    assert.equal(shared("ABCDEFGHIJKLMNO"), "00000ABCDE");
    assert.equal(shared("abc"), "0000000000");
  });

  it("prefixedId, mode marker goes after the prefix", function () {
    assert.match(
      prefixedId("chk", { mode: "test" }),
      /^chk_test_1[0-9A-Za-z]{26}$/
    );
    assert.match(
      prefixedId("chk", { mode: "stage2" }),
      /^chk_stage2_1[0-9A-Za-z]{26}$/
    );
  });

  it("prefixedId, no marker without mode or with an empty one", function () {
    assert.match(
      prefixedId("chk", { mode: undefined }),
      /^chk_1[0-9A-Za-z]{26}$/
    );
    assert.match(prefixedId("chk", { mode: "" }), /^chk_1[0-9A-Za-z]{26}$/);
  });

  it("prefixedId, mode marker does not break the owner key", function () {
    const org = prefixedId("org", { mode: "test" });
    const user = prefixedId("usr", { owner: org, mode: "test" });

    assert.equal(user.slice(-20, -10), org.slice(-20, -10));
  });

  it("prefixedId, ids of one mode sort as a group", function () {
    const late = new Date(62 ** 6 * 1000 - 1000);
    const early = new Date(0);
    const ids = [
      prefixedId("chk", { time: early }),
      prefixedId("chk", { time: late }),
      prefixedId("chk", { time: early, mode: "test" }),
      prefixedId("chk", { time: late, mode: "test" }),
      prefixedId("chk", { time: early, mode: "testA" }),
      prefixedId("chk", { time: late, mode: "testA" }),
    ];
    const sorted = [...ids].sort();

    assert.deepStrictEqual(sorted.slice(0, 2), ids.slice(0, 2));
    for (const group of [sorted.slice(2, 4), sorted.slice(4, 6)]) {
      assert.equal(group[0].split("_")[1], group[1].split("_")[1]);
    }
  });

  it("prefixedId, values are not repeated", function () {
    const values = new Set();
    for (let i = 0; i < 1000; i++) values.add(prefixedId("usr"));
    assert.equal(values.size, 1000);
  });

  it("prefixedId, uses the whole alphabet across pool refills", function () {
    const symbols = new Set();
    for (let i = 0; i < 2000; i++) {
      const id = prefixedId("usr");
      assert.match(id, /^usr_1[0-9A-Za-z]{26}$/);
      for (const symbol of id.slice(-20)) symbols.add(symbol);
    }

    assert.equal(symbols.size, BASE62.length);
  });
});
