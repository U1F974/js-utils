const { describe, it } = require("node:test");
const assert = require("node:assert");

const { ok, err } = require("../lib/result/result.factory.js");
const { Result, OkResult, ErrResult } = require("../lib/result/result.js");

describe("result.js", function () {
  it("unwrapOr, ok returns own value", function () {
    assert.equal(ok(1).unwrapOr(2), 1);
  });

  it("unwrapOr, err returns default", function () {
    assert.equal(err("e").unwrapOr(2), 2);
  });

  it("unwrapOrElse, ok ignores fn", function () {
    assert.equal(ok(1).unwrapOrElse(() => 2), 1);
  });

  it("unwrapOrElse, err calls fn with error", function () {
    assert.equal(err("boom").unwrapOrElse((e) => e.length), 4);
  });

  it("map, ok applies fn", function () {
    assert.equal(ok(2).map((x) => x * 2).unwrap(), 4);
  });

  it("map, err is untouched", function () {
    const result = err("e");
    assert.equal(result.map(() => 1), result);
  });

  it("mapErr, err applies fn", function () {
    assert.equal(err("e").mapErr((e) => e + "!").unwrapErr(), "e!");
  });

  it("mapErr, ok is untouched", function () {
    const result = ok(1);
    assert.equal(result.mapErr(() => "e"), result);
  });

  it("flatMap, ok does not nest results", function () {
    assert.equal(ok(2).flatMap((x) => ok(x + 1)).unwrap(), 3);
  });

  it("flatMap, ok can return err", function () {
    assert.equal(ok(2).flatMap(() => err("e")).unwrapErr(), "e");
  });

  it("flatMap, err is untouched", function () {
    const result = err("e");
    assert.equal(result.flatMap(() => ok(1)), result);
  });

  it("match, ok calls ok branch", function () {
    assert.equal(ok(2).match({ ok: (v) => v * 2, err: () => 0 }), 4);
  });

  it("match, err calls err branch", function () {
    assert.equal(err("e").match({ ok: () => 0, err: (e) => e }), "e");
  });

  it("tap, ok calls fn and returns itself", function () {
    let seen;
    const result = ok(1);
    assert.equal(result.tap((v) => (seen = v)), result);
    assert.equal(seen, 1);
  });

  it("tap, err does not call fn", function () {
    let called = false;
    err("e").tap(() => (called = true));
    assert.equal(called, false);
  });

  it("tapErr, err calls fn and returns itself", function () {
    let seen;
    const result = err("e");
    assert.equal(result.tapErr((e) => (seen = e)), result);
    assert.equal(seen, "e");
  });

  it("tapErr, ok does not call fn", function () {
    let called = false;
    ok(1).tapErr(() => (called = true));
    assert.equal(called, false);
  });

  it("mapAsync, ok awaits fn", async function () {
    const result = await ok(2).mapAsync(async (x) => x * 2);
    assert.equal(result.unwrap(), 4);
  });

  it("mapAsync, err is untouched", async function () {
    const result = err("e");
    assert.equal(await result.mapAsync(async () => 1), result);
  });

  it("flatMapAsync, ok does not nest results", async function () {
    const result = await ok(2).flatMapAsync(async (x) => ok(x + 1));
    assert.equal(result.unwrap(), 3);
  });

  it("flatMapAsync, err is untouched", async function () {
    const result = err("e");
    assert.equal(await result.flatMapAsync(async () => ok(1)), result);
  });

  it("Result.from, returns ok on success", function () {
    const result = Result.from(() => JSON.parse('{"a":1}'));
    assert.ok(result instanceof OkResult);
    assert.deepEqual(result.unwrap(), { a: 1 });
  });

  it("Result.from, returns err on throw", function () {
    const result = Result.from(() => JSON.parse("invalid"));
    assert.ok(result instanceof ErrResult);
    assert.ok(result.unwrapErr() instanceof SyntaxError);
  });

  it("Result.fromAsync, resolved promise", async function () {
    const result = await Result.fromAsync(Promise.resolve(1));
    assert.equal(result.unwrap(), 1);
  });

  it("Result.fromAsync, rejected promise", async function () {
    const result = await Result.fromAsync(Promise.reject(new Error("boom")));
    assert.equal(result.unwrapErr().message, "boom");
  });

  it("Result.fromAsync, function throwing synchronously", async function () {
    const result = await Result.fromAsync(() => {
      throw new Error("boom");
    });
    assert.equal(result.unwrapErr().message, "boom");
  });

  it("chain, err short-circuits the pipeline", function () {
    const result = ok(2)
      .flatMap(() => err("e"))
      .map((x) => x * 2)
      .mapErr((e) => e + "!");

    assert.equal(result.unwrapErr(), "e!");
  });

  it("ok and err build the matching classes", function () {
    assert.ok(ok(1) instanceof OkResult);
    assert.ok(ok(1) instanceof Result);
    assert.ok(err("e") instanceof ErrResult);
    assert.ok(err("e") instanceof Result);
  });

  it("Result.ok and Result.err match the factories", function () {
    assert.equal(Result.ok(1).unwrap(), ok(1).unwrap());
    assert.equal(Result.err("e").unwrapErr(), err("e").unwrapErr());
  });

  it("unwrap, err throws", function () {
    assert.throws(() => err("e").unwrap(), /Cannot unwrap a failure/);
  });

  it("unwrapErr, ok throws", function () {
    assert.throws(() => ok(1).unwrapErr(), ReferenceError);
  });

  it("isOk and isErr are mutually exclusive", function () {
    assert.deepStrictEqual([ok(1).isOk(), ok(1).isErr()], [true, false]);
    assert.deepStrictEqual([err("e").isOk(), err("e").isErr()], [false, true]);
  });
});
