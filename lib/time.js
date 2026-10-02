const { performance } = require("node:perf_hooks");

/**
 * @description
 * Отдает текущее время в [unixtime](https://wikiless.tiekoetter.com/wiki/Unix_time) — в секундах.
 *
 * @returns {number}
 *
 * @example
 *
 * unixtime()
 * // 1668283743
 */
const unixtime = () => Math.floor(Date.now() / 1000);

/**
 * @description
 * Перевод времени в [unixtime](https://wikiless.tiekoetter.com/wiki/Unix_time).
 *
 * @param {Date | number} value Дата или время в миллисекундах
 * @returns {number}
 *
 * @example
 *
 * toUnixtime(new Date())
 * // 1699035897
 *
 * toUnixtime(1699035937494)
 * // 1699035937
 */
const toUnixtime = (value) => Math.floor(value / 1_000);

/**
 * @description
 * Создает таймер, измеряющий прошедшее время с момента вызова.
 *
 * @returns {{ elapsed: () => string }}
 *
 * @example
 *
 * const timer = makeTimer()
 * await doSomething()
 * console.log(timer.elapsed()) // "1.23s"
 */
function makeTimer() {
  const start = performance.now();

  return {
    elapsed: () => `${((performance.now() - start) / 1000).toFixed(2)}s`,
  };
}

module.exports = { unixtime, toUnixtime, makeTimer };
