const { describe, it } = require("node:test");
const assert = require("node:assert");

const { unixtime, toUnixtime, makeTimer } = require("../lib/time.js");

describe("time.js", function () {
  it("unixtime, matches Date.now in seconds", function () {
    assert.ok(Math.abs(unixtime() - Math.floor(Date.now() / 1000)) <= 1);
  });

  it("toUnixtime, from Date", function () {
    assert.equal(toUnixtime(new Date(1699035897494)), 1699035897);
  });

  it("toUnixtime, from milliseconds", function () {
    assert.equal(toUnixtime(1699035937494), 1699035937);
  });

  it("toUnixtime, agrees with unixtime", function () {
    assert.ok(Math.abs(toUnixtime(Date.now()) - unixtime()) <= 1);
  });

  it("makeTimer, formats elapsed seconds", function () {
    const timer = makeTimer();

    assert.match(timer.elapsed(), /^\d+\.\d{2}s$/);
  });

  it("makeTimer, elapsed time grows", function () {
    const timer = makeTimer();
    const first = Number.parseFloat(timer.elapsed());

    const until = Date.now() + 20;
    while (Date.now() < until);

    assert.ok(Number.parseFloat(timer.elapsed()) >= first);
  });

  it("makeTimer, timers are independent", function () {
    const first = makeTimer();
    const second = makeTimer();

    assert.notEqual(first.elapsed, second.elapsed);
  });
});
