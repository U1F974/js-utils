const { describe, it } = require("node:test");
const assert = require("node:assert");

const _ = require("../lib/index.js");

const EXPORTS = [
  "chunk",
  "compact",
  "sum",
  "uniq",
  "firstValue",
  "randomBigInt",
  "uid",
  "factory",
  "late",
  "inspectFmt",
  "jsonFmt",
  "toLower",
  "toUpper",
  "capitalize",
  "clone",
  "md5",
  "sha256",
  "unixtime",
  "toUnixtime",
  "makeTimer",
  "delay",
  "timeout",
  "timeoutify",
  "throttle",
  "debounce",
  "safeJsonParse",
  "uuid",
  "isNil",
  "isNumber",
  "isObject",
  "isDate",
  "isRegExp",
  "isString",
  "isBigInt",
  "isEmpty",
  "isClassInstance",
  "notNullOrUndefined",
  "hasOwn",
  "ok",
  "err",
  "Result",
  "ErrResult",
  "OkResult",
  "LinkedList",
  "ListNode",
  "Queue",
  "Stack",
  "Deque",
  "CircularBuffer",
];

describe("index.js", function () {
  it("exports everything from the public list", function () {
    for (const name of EXPORTS) {
      assert.ok(_[name] !== undefined, `missing export: ${name}`);
    }
  });

  it("exports nothing beyond the public list", function () {
    const extra = Object.keys(_).filter(
      (name) => !EXPORTS.includes(name) && name !== "_" && name !== "default"
    );

    assert.deepStrictEqual(extra, []);
  });

  it("readme lists every export", function () {
    const readme = require("node:fs").readFileSync(
      require("node:path").join(__dirname, "..", "readme.md"),
      "utf8"
    );
    const missing = EXPORTS.filter((name) => !readme.includes(`\`${name}\``));

    assert.deepStrictEqual(missing, []);
  });

  it("'_' and 'default' point at the module itself", function () {
    assert.equal(_._, _);
    assert.equal(_.default, _);
  });

  it("named esm imports resolve", async function () {
    const esm = await import("../lib/index.js");

    assert.equal(typeof esm.chunk, "function");
    assert.equal(typeof esm.capitalize, "function");
    assert.equal(typeof esm.Result, "function");
    assert.equal(typeof esm.Queue, "function");
  });
});
