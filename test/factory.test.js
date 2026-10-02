const { describe, it } = require("node:test");
const assert = require("node:assert");

const { factory } = require("../lib/factory.js");

class Point {
  constructor(value) {
    this.value = value;
  }
}

describe("factory.js", function () {
  it("factory, builds instances of the class", function () {
    const points = factory([1, 2], Point);

    assert.equal(points.length, 2);
    assert.ok(points.every((point) => point instanceof Point));
    assert.deepStrictEqual(
      points.map((point) => point.value),
      [1, 2]
    );
  });

  it("factory, empty array", function () {
    assert.deepStrictEqual(factory([], Point), []);
  });

  it("factory, value 'undefined'", function () {
    assert.deepStrictEqual(factory(undefined, Point), []);
  });

  it("factory, value 'null'", function () {
    assert.deepStrictEqual(factory(null, Point), []);
  });
});
