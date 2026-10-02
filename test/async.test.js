const { describe, it } = require("node:test");
const assert = require("node:assert");

const {
  delay,
  timeout,
  timeoutify,
  throttle,
  debounce,
} = require("../lib/async.js");

const collector = () => {
  const calls = [];
  const fn = (...args) => calls.push(args);

  return { calls, fn };
};

describe("async.js", function () {
  it("delay, waits for the given time", async function () {
    const start = Date.now();
    await delay(30);

    assert.ok(Date.now() - start >= 25);
  });

  it("delay, rejects on abort", async function () {
    const controller = new AbortController();
    const promise = delay(1000, controller.signal);
    controller.abort();

    await assert.rejects(promise, { name: "AbortError" });
  });

  it("delay, an already aborted signal rejects at once", async function () {
    await assert.rejects(delay(1000, AbortSignal.abort()), {
      name: "AbortError",
    });
  });

  it("timeout, rejects with ETIMEOUT", async function () {
    await assert.rejects(timeout(20), (error) => {
      assert.ok(error instanceof Error);
      assert.equal(error.code, "ETIMEOUT");
      assert.match(error.message, /20ms/);

      return true;
    });
  });

  it("timeout, rejects on abort", async function () {
    await assert.rejects(timeout(1000, AbortSignal.abort()), {
      name: "AbortError",
    });
  });

  it("timeoutify, passes the value through", async function () {
    assert.equal(await timeoutify(Promise.resolve(7), 1000), 7);
  });

  it("timeoutify, passes the original error through", async function () {
    const promise = Promise.reject(new Error("inner"));

    await assert.rejects(timeoutify(promise, 1000), /inner/);
  });

  it("timeoutify, rejects when the promise is too slow", async function () {
    const slow = new Promise((resolve) => setTimeout(resolve, 200));

    await assert.rejects(timeoutify(slow, 20), (error) => {
      assert.ok(error instanceof Error);
      assert.equal(error.code, "ETIMEOUT");

      return true;
    });
  });

  it("timeoutify, does not hold the timer after settling", async function () {
    const timers = () =>
      process.getActiveResourcesInfo().filter((res) => res === "Timeout");

    const before = timers().length;
    await timeoutify(Promise.resolve(1), 60000);
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(timers().length, before);
  });

  it("throttle, the first call goes through at once", function () {
    const { calls, fn } = collector();
    const limited = throttle(fn, 1000);

    limited.fn(1);

    assert.deepStrictEqual(calls, [[1]]);
    limited.cancel();
  });

  it("throttle, calls inside the window are collapsed", async function () {
    const { calls, fn } = collector();
    const limited = throttle(fn, 30);

    limited.fn(1);
    limited.fn(2);
    limited.fn(3);

    assert.deepStrictEqual(calls, [[1]]);
    await delay(60);
    assert.deepStrictEqual(calls, [[1], [3]]);
    limited.cancel();
  });

  it("throttle, stops when there are no new calls", async function () {
    const { calls, fn } = collector();
    const limited = throttle(fn, 20);

    limited.fn(1);
    await delay(80);

    assert.deepStrictEqual(calls, [[1]]);
    limited.cancel();
  });

  it("throttle, flush runs the pending call at once", function () {
    const { calls, fn } = collector();
    const limited = throttle(fn, 1000);

    limited.fn(1);
    limited.fn(2);
    limited.flush();

    assert.deepStrictEqual(calls, [[1], [2]]);
  });

  it("throttle, cancel drops the pending call", async function () {
    const { calls, fn } = collector();
    const limited = throttle(fn, 20);

    limited.fn(1);
    limited.fn(2);
    limited.cancel();
    await delay(60);

    assert.deepStrictEqual(calls, [[1]]);
  });

  it("debounce, runs only the last call", async function () {
    const { calls, fn } = collector();
    const deferred = debounce(fn, 30);

    deferred.fn(1);
    deferred.fn(2);
    deferred.fn(3);

    assert.deepStrictEqual(calls, []);
    await delay(80);
    assert.deepStrictEqual(calls, [[3]]);
  });

  it("debounce, the pause is counted from the last call", async function () {
    const { calls, fn } = collector();
    const deferred = debounce(fn, 50);

    deferred.fn(1);
    await delay(30);
    deferred.fn(2);
    await delay(30);

    assert.deepStrictEqual(calls, []);
    await delay(60);
    assert.deepStrictEqual(calls, [[2]]);
  });

  it("debounce, flush runs the pending call at once", function () {
    const { calls, fn } = collector();
    const deferred = debounce(fn, 1000);

    deferred.fn(1);
    deferred.flush();

    assert.deepStrictEqual(calls, [[1]]);
  });

  it("debounce, cancel drops the pending call", async function () {
    const { calls, fn } = collector();
    const deferred = debounce(fn, 20);

    deferred.fn(1);
    deferred.cancel();
    await delay(60);

    assert.deepStrictEqual(calls, []);
  });

  it("flush and cancel are safe without a pending call", function () {
    const limited = throttle(() => {}, 1000);
    const deferred = debounce(() => {}, 1000);

    assert.doesNotThrow(() => {
      limited.flush();
      limited.cancel();
      deferred.flush();
      deferred.cancel();
    });
  });

  it("arguments are not shared between calls", async function () {
    const { calls, fn } = collector();
    const deferred = debounce(fn, 20);

    deferred.fn(1, 2);
    deferred.flush();
    deferred.fn(3, 4);
    deferred.flush();

    assert.deepStrictEqual(calls, [
      [1, 2],
      [3, 4],
    ]);
  });
});
