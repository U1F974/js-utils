const { describe, it } = require("node:test");
const assert = require("node:assert");

const { genPrefixedId } = require("../lib/prefixed-id.js");

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const decodeSeconds = (chars) =>
  [...chars].reduce((seconds, char) => seconds * 62 + BASE62.indexOf(char), 0);

/** Date of a unixtime in seconds. */
const at = (seconds) => new Date(seconds * 1000);

/** Part of an id after its prefix and mode marker. */
const bodyOf = (id) => id.slice(id.lastIndexOf("_") + 1);

describe("prefixed-id.js", function () {
  it("genPrefixedId, format", function () {
    assert.match(genPrefixedId("usr"), /^usr_[0-9A-Za-z]{31}$/);
  });

  it("genPrefixedId, encodes the current unixtime second", function () {
    const before = Math.floor(Date.now() / 1000);
    const id = genPrefixedId("usr");
    const after = Math.floor(Date.now() / 1000);

    const seconds = decodeSeconds(id.slice(4, 10));
    assert.ok(
      seconds >= before && seconds <= after,
      `unexpected second: ${seconds}`
    );
  });

  it("genPrefixedId, encodes the given time", function () {
    const encoded = (seconds) => genPrefixedId("usr", { time: at(seconds) });

    assert.equal(encoded(0).slice(0, 10), "usr_000000");
    assert.equal(encoded(61).slice(4, 10), "00000z");
    assert.equal(encoded(62).slice(4, 10), "000010");
  });

  it("genPrefixedId, ids sort by their second", function () {
    const seconds = [0, 61, 62, 3843, 3844, 1_000_000_000, 62 ** 6 - 1];
    const ids = seconds.map((second) =>
      genPrefixedId("usr", { time: at(second) })
    );

    assert.deepStrictEqual([...ids].sort(), ids);
  });

  it("genPrefixedId, a time out of the range throws", function () {
    assert.throws(() => genPrefixedId("usr", { time: at(-1) }));
    assert.throws(() => genPrefixedId("usr", { time: at(62 ** 6) }));
    assert.throws(() => genPrefixedId("usr", { time: new Date(NaN) }));
  });

  it("genPrefixedId, with owner 12 symbols are random", function () {
    const before = Math.floor(Date.now() / 1000);
    const user = genPrefixedId("usr", { owner: genPrefixedId("org") });

    assert.match(user, /^usr_[0-9A-Za-z]{49}$/);
    assert.ok(decodeSeconds(user.slice(4, 10)) >= before);
  });

  it("genPrefixedId, the whole root body is embedded", function () {
    const org = genPrefixedId("org");
    const user = genPrefixedId("usr", { owner: org });

    assert.equal(user.slice(-31), bodyOf(org));
    assert.equal(`org_${user.slice(-31)}`, org);
  });

  it("genPrefixedId, the root body stays the same down the chain", function () {
    const org = genPrefixedId("org");
    const user = genPrefixedId("usr", { owner: org });
    const token = genPrefixedId("tok", { owner: user });

    assert.equal(token.slice(-31), bodyOf(org));
    assert.equal(token.length, user.length);
    assert.notEqual(token.slice(10, 22), user.slice(10, 22));
  });

  it("genPrefixedId, an owner of an unknown format throws", function () {
    for (const owner of ["abc", "usr_11xN1gkBbC9wzTPJzppRHWC3v6i", ""]) {
      assert.throws(() => genPrefixedId("usr", { owner }), /Owner/, owner);
    }
  });

  it("genPrefixedId, ids with and without owner sort together", function () {
    const owner = genPrefixedId("org");
    const ids = [
      genPrefixedId("usr", { time: at(1_000_000_100), owner }),
      genPrefixedId("usr", { time: at(1_000_000_200) }),
      genPrefixedId("usr", { time: at(1_000_000_300), owner }),
    ];

    assert.deepStrictEqual([...ids].sort(), ids);
  });

  it("genPrefixedId, mode marker goes after the prefix", function () {
    assert.match(
      genPrefixedId("chk", { mode: "test" }),
      /^chk_test_[0-9A-Za-z]{31}$/
    );
    assert.match(
      genPrefixedId("chk", { mode: "stage2" }),
      /^chk_stage2_[0-9A-Za-z]{31}$/
    );
  });

  it("genPrefixedId, no marker without mode or with an empty one", function () {
    assert.match(
      genPrefixedId("chk", { mode: undefined }),
      /^chk_[0-9A-Za-z]{31}$/
    );
    assert.match(genPrefixedId("chk", { mode: "" }), /^chk_[0-9A-Za-z]{31}$/);
  });

  it("genPrefixedId, mode marker is not embedded with the root", function () {
    const org = genPrefixedId("org", { mode: "test" });
    const user = genPrefixedId("usr", { owner: org, mode: "test" });

    assert.match(user, /^usr_test_[0-9A-Za-z]{49}$/);
    assert.equal(user.slice(-31), bodyOf(org));
  });

  it("genPrefixedId, ids of one mode sort as a group until 2260", function () {
    // the first time symbol is a digit until 2260-04-23
    const late = at(10 * 62 ** 5 - 1);
    const early = at(0);
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
      assert.match(id, /^usr_[0-9A-Za-z]{31}$/);
      for (const symbol of id.slice(-25)) symbols.add(symbol);
    }

    assert.equal(symbols.size, BASE62.length);
  });
});
