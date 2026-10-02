const { describe, it } = require("node:test");
const assert = require("node:assert");

const {
  chunk,
  uniq,
  compact,
  sum,
  firstValue,
} = require("../lib/array.js");

describe("array.js", function () {
  it("chunk", function () {
    assert.deepStrictEqual(chunk([1, 2, 3, 4, 5, 6, 7, 8, 9, 0], 3), [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [0],
    ]);
  });
  it("uniq", function () {
    assert.deepStrictEqual(uniq([1, 2, 3, 3, "4", 4], Number), [1, 2, 3, "4"]);
    assert.deepStrictEqual(uniq([1, 2, 3, 3, 4, "4"], Number), [1, 2, 3, 4]);
  });
  it("compact", function () {
    assert.deepStrictEqual(compact([1, 2, 3, 0, false, ""]), [1, 2, 3]);
  });
  it("sum", function () {
    assert.equal(sum([4, 2, 8, 6]), 20);
  });

  it("chunk, remainder goes to the last group", function () {
    assert.deepStrictEqual(chunk(["a", "b", "c", "d"], 3), [
      ["a", "b", "c"],
      ["d"],
    ]);
  });

  it("chunk, empty array", function () {
    assert.deepStrictEqual(chunk([], 3), []);
  });

  it("chunk, size bigger than the array", function () {
    assert.deepStrictEqual(chunk([1, 2], 5), [[1, 2]]);
  });

  it("chunk, throws on size less than 1", function () {
    assert.throws(() => chunk([1, 2], 0), /Chunk size/);
  });

  it("uniq, without iteratee", function () {
    assert.deepStrictEqual(uniq([1, 1, 2, 3, 3]), [1, 2, 3]);
  });

  it("uniq, keeps the first occurrence", function () {
    assert.deepStrictEqual(uniq(["a", "A", "b"], (s) => s.toLowerCase()), [
      "a",
      "b",
    ]);
  });

  it("uniq, NaN is deduplicated", function () {
    assert.deepStrictEqual(uniq([NaN, NaN, 1]), [NaN, 1]);
  });

  it("uniq, objects are compared by reference", function () {
    const shared = { a: 1 };

    assert.equal(uniq([shared, shared, { a: 1 }]).length, 2);
  });

  it("uniq, empty array", function () {
    assert.deepStrictEqual(uniq([]), []);
  });

  it("compact, drops every falsy value", function () {
    assert.deepStrictEqual(compact([0, null, undefined, NaN, "", false, 1]), [
      1,
    ]);
  });

  it("sum, empty array", function () {
    assert.equal(sum([]), 0);
  });

  it("firstValue, takes the first element of an array", function () {
    assert.equal(firstValue(["a", "b"]), "a");
  });

  it("firstValue, a single value is returned as is", function () {
    assert.equal(firstValue("a"), "a");
    assert.equal(firstValue(0), 0);
    assert.equal(firstValue(false), false);
  });

  it("firstValue, empty array", function () {
    assert.equal(firstValue([]), undefined);
  });

  it("firstValue, value 'undefined'", function () {
    assert.equal(firstValue(undefined), undefined);
    assert.equal(firstValue(), undefined);
  });

  it("firstValue, value 'null'", function () {
    assert.equal(firstValue(null), null);
  });

  it("firstValue, works with any type", function () {
    const object = { a: 1 };

    assert.equal(firstValue([object, { b: 2 }]), object);
    assert.equal(firstValue([1, 2]), 1);
  });

  it("firstValue, a nested array is returned whole", function () {
    assert.deepStrictEqual(firstValue([["a"], ["b"]]), ["a"]);
  });
});
