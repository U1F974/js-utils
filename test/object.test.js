const { describe, it } = require("node:test");
const assert = require("node:assert");

const { clone } = require("../lib/object.js");

describe("object.js", function () {
  it("clone", function () {
    const obj = { value: 0, arr: [{ value: 1 }, { value: 2 }] };
    const cloned = clone(obj);
    obj.arr[0].value = 3;
    assert.notDeepStrictEqual(obj, cloned);
  });

  it("clone, primitives are returned as is", function () {
    assert.equal(clone(1), 1);
    assert.equal(clone("str"), "str");
    assert.equal(clone(null), null);
    assert.equal(clone(undefined), undefined);
  });

  it("clone, nested objects are copied", function () {
    const source = { a: { b: { c: 1 } } };
    const cloned = clone(source);

    assert.deepStrictEqual(cloned, source);
    assert.notEqual(cloned.a, source.a);
    assert.notEqual(cloned.a.b, source.a.b);
  });

  it("clone, arrays are copied", function () {
    const source = [{ a: 1 }];
    const cloned = clone(source);

    assert.deepStrictEqual(cloned, source);
    assert.ok(Array.isArray(cloned));
    assert.notEqual(cloned[0], source[0]);
  });

  it("clone, object without a prototype", function () {
    const source = Object.create(null);
    source.a = 1;
    const cloned = clone(source);

    assert.equal(Object.getPrototypeOf(cloned), null);
    assert.equal(cloned.a, 1);
  });

  it("clone, prototype is preserved", function () {
    class Point {
      constructor(value) {
        this.value = value;
      }
    }
    const cloned = clone(new Point(1));

    assert.ok(cloned instanceof Point);
    assert.equal(cloned.value, 1);
  });

  it("clone, Date and RegExp are shared, not copied", function () {
    const date = new Date();
    const regexp = /a/g;

    assert.equal(clone(date), date);
    assert.equal(clone(regexp), regexp);
    assert.equal(clone({ date }).date, date);
  });
});
