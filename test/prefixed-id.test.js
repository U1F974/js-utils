const { describe, it } = require("node:test");
const assert = require("node:assert");

const { genPrefixedId, prefixedId } = require("../lib/prefixed-id.js");

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const decodeSeconds = (chars) =>
  [...chars].reduce((seconds, char) => seconds * 62 + BASE62.indexOf(char), 0);

describe("prefixed-id.js", function () {
  it("prefixedId, deprecated alias of genPrefixedId", function () {
    assert.equal(prefixedId, genPrefixedId);
  });

  it("genPrefixedId, format", function () {
    assert.match(genPrefixedId("usr"), /^usr_1[0-9A-Za-z]{26}$/);
  });

  it("genPrefixedId, encodes the current second", function () {
    const before = Math.floor(Date.now() / 1000);
    const id = genPrefixedId("usr");
    const after = Math.floor(Date.now() / 1000);

    const seconds = decodeSeconds(id.slice(5, 11));
    assert.ok(
      seconds >= before && seconds <= after,
      `unexpected second: ${seconds}`
    );
  });

  it("genPrefixedId, encodes the given time", function () {
    const encoded = (ms) => genPrefixedId("usr", { time: new Date(ms) });

    assert.equal(encoded(0).slice(0, 11), "usr_1000000");
    assert.equal(encoded(61_999).slice(5, 11), "00000z");
    assert.equal(encoded(62_000).slice(5, 11), "000010");
  });

  it("genPrefixedId, ids sort by their second", function () {
    const seconds = [0, 61, 62, 3843, 3844, 1_000_000_000, 62 ** 6 - 1];
    const ids = seconds.map((second) =>
      genPrefixedId("usr", { time: new Date(second * 1000) })
    );

    assert.deepStrictEqual([...ids].sort(), ids);
  });

  it("genPrefixedId, a time out of the range throws", function () {
    assert.throws(() => genPrefixedId("usr", { time: new Date(-1000) }));
    assert.throws(() =>
      genPrefixedId("usr", { time: new Date(62 ** 6 * 1000) })
    );
    assert.throws(() => genPrefixedId("usr", { time: new Date(NaN) }));
  });

  it("genPrefixedId, owner shares 10 symbols down the chain", function () {
    const org = genPrefixedId("org");
    const user = genPrefixedId("usr", { owner: org });
    const token = genPrefixedId("tok", { owner: user });

    assert.equal(user.slice(-20, -10), org.slice(-20, -10));
    assert.equal(token.slice(-20, -10), org.slice(-20, -10));
    assert.notEqual(user.slice(-10), org.slice(-10));
  });

  it("genPrefixedId, a short owner is padded with zeros", function () {
    const shared = (owner) => genPrefixedId("usr", { owner }).slice(-20, -10);

    assert.equal(shared("ABCDEFGHIJKLMNO"), "00000ABCDE");
    assert.equal(shared("abc"), "0000000000");
  });

  it("genPrefixedId, mode marker goes after the prefix", function () {
    assert.match(
      genPrefixedId("chk", { mode: "test" }),
      /^chk_test_1[0-9A-Za-z]{26}$/
    );
    assert.match(
      genPrefixedId("chk", { mode: "stage2" }),
      /^chk_stage2_1[0-9A-Za-z]{26}$/
    );
  });

  it("genPrefixedId, no marker without mode or with an empty one", function () {
    assert.match(
      genPrefixedId("chk", { mode: undefined }),
      /^chk_1[0-9A-Za-z]{26}$/
    );
    assert.match(genPrefixedId("chk", { mode: "" }), /^chk_1[0-9A-Za-z]{26}$/);
  });

  it("genPrefixedId, mode marker does not break the owner key", function () {
    const org = genPrefixedId("org", { mode: "test" });
    const user = genPrefixedId("usr", { owner: org, mode: "test" });

    assert.equal(user.slice(-20, -10), org.slice(-20, -10));
  });

  it("genPrefixedId, ids of one mode sort as a group", function () {
    const late = new Date(62 ** 6 * 1000 - 1000);
    const early = new Date(0);
    const ids = [
      genPrefixedId("chk", { time: early }),
      genPrefixedId("chk", { time: late }),
      genPrefixedId("chk", { time: early, mode: "test" }),
      genPrefixedId("chk", { time: late, mode: "test" }),
      genPrefixedId("chk", { time: early, mode: "testA" }),
      genPrefixedId("chk", { time: late, mode: "testA" }),
    ];
    const sorted = [...ids].sort();

    assert.deepStrictEqual(sorted.slice(0, 2), ids.slice(0, 2));
    for (const group of [sorted.slice(2, 4), sorted.slice(4, 6)]) {
      assert.equal(group[0].split("_")[1], group[1].split("_")[1]);
    }
  });

  it("genPrefixedId, values are not repeated", function () {
    const values = new Set();
    for (let i = 0; i < 1000; i++) values.add(genPrefixedId("usr"));
    assert.equal(values.size, 1000);
  });

  it("genPrefixedId, uses the whole alphabet across pool refills", function () {
    const symbols = new Set();
    for (let i = 0; i < 2000; i++) {
      const id = genPrefixedId("usr");
      assert.match(id, /^usr_1[0-9A-Za-z]{26}$/);
      for (const symbol of id.slice(-20)) symbols.add(symbol);
    }

    assert.equal(symbols.size, BASE62.length);
  });
});
