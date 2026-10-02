const { describe, it } = require("node:test");
const assert = require("node:assert");

const {
  isNil,
  isObject,
  isNumber,
  isDate,
  isRegExp,
  isString,
  isBigInt,
  isClassInstance,
  notNullOrUndefined,
  isEmpty,
  hasOwn,
} = require("../lib/util.js");

describe("util.js", function () {
  it("isNil", function () {
    assert.equal(isNil(null), true);
    assert.equal(isNil(undefined), true);
    assert.equal(isNil(NaN), false);
    assert.equal(isNil(0), false);
    assert.equal(isNil(""), false);
  });

  it("isObject", function () {
    assert.equal(isObject({}), true);
    assert.equal(isObject([1, 2, 3]), true);
    assert.equal(isObject(() => {}), true);
    assert.equal(isObject(new Date()), true);
    assert.equal(isObject(null), false);
    assert.equal(isObject("str"), false);
  });

  it("isNumber", function () {
    assert.equal(isNumber(3), true);
    assert.equal(isNumber(NaN), true);
    assert.equal(isNumber(Infinity), true);
    assert.equal(isNumber("3"), false);
    assert.equal(isNumber(3n), false);
  });

  it("isDate", function () {
    assert.equal(isDate(new Date()), true);
    assert.equal(isDate(new Date("")), false);
    assert.equal(isDate(Date.now()), false);
  });

  it("isRegExp", function () {
    assert.equal(isRegExp(/aboba/gi), true);
    assert.equal(isRegExp(new RegExp("a")), true);
    assert.equal(isRegExp("/a/"), false);
  });

  it("isRegExp, ignores a patched globalThis.toString", function () {
    const original = globalThis.toString;
    globalThis.toString = () => "[object Nope]";

    try {
      assert.equal(isRegExp(/a/), true);
    } finally {
      globalThis.toString = original;
    }
  });

  it("isString", function () {
    assert.equal(isString("kek"), true);
    assert.equal(isString(""), true);
    assert.equal(isString(1), false);
    assert.equal(isString(new String("kek")), false);
  });

  it("isBigInt", function () {
    assert.equal(isBigInt(123n), true);
    assert.equal(isBigInt(1), false);
  });

  it("isClassInstance", function () {
    assert.equal(isClassInstance(new Error()), true);
    assert.equal(isClassInstance(new Date()), true);
    assert.equal(isClassInstance([]), true);
    assert.equal(isClassInstance({}), false);
  });

  it("isClassInstance, object without a prototype is falsy", function () {
    assert.ok(!isClassInstance(Object.create(null)));
  });

  it("notNullOrUndefined, value '0'", function () {
    assert.equal(notNullOrUndefined(0), true);
  });

  it("notNullOrUndefined, value 'null'", function () {
    assert.equal(notNullOrUndefined(null), false);
  });

  it("notNullOrUndefined, value 'undefined'", function () {
    assert.equal(notNullOrUndefined(undefined), false);
  });

  it("isEmpty, value '{}'", function () {
    assert.equal(isEmpty({}), true);
  });

  it("isEmpty, value 'null'", function () {
    assert.equal(isEmpty(null), true);
  });

  it("isEmpty, value 'undefined'", function () {
    assert.equal(isEmpty(undefined), true);
  });

  it("isEmpty, value 'NaN'", function () {
    assert.equal(isEmpty(NaN), false);
  });

  it("isEmpty, value 'Object'", function () {
    assert.equal(isEmpty(new Object({ key: "value" })), false);
  });

  it("isEmpty, value '0'", function () {
    assert.equal(isEmpty(0), false);
  });

  it("isEmpty, value ''", function () {
    assert.equal(isEmpty(""), true);
  });

  it("isEmpty, value 'asd'", function () {
    assert.equal(isEmpty("asd"), false);
  });

  it("hasOwn, own property", function () {
    assert.equal(hasOwn({ a: 1 }, "a"), true);
  });

  it("hasOwn, inherited property", function () {
    assert.equal(hasOwn({}, "toString"), false);
  });

  it("hasOwn, missing property", function () {
    assert.equal(hasOwn({ a: 1 }, "b"), false);
  });

  it("hasOwn, value 'null'", function () {
    assert.equal(hasOwn(null, "a"), false);
  });

  it("hasOwn, value 'undefined'", function () {
    assert.equal(hasOwn(undefined, "a"), false);
  });
});
