const timers = require("node:timers/promises");

/**
 * @param {number} msec
 * @returns {Error & { code: "ETIMEOUT" }}
 */
const timeoutError = (msec) =>
  Object.assign(new Error(`Timeout of ${msec}ms reached`), {
    code: "ETIMEOUT",
  });

/**
 * @description
 * Пауза на `msec` миллисекунд.
 * Если передан `signal`, отмена реджектит промис с `AbortError`.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/async.js
 *
 * @param {number} msec
 * @param {AbortSignal} [signal]
 * @returns {Promise<void>}
 *
 * @example
 *
 * await delay(1000)
 *
 * await delay(1000, AbortSignal.timeout(500))
 * // AbortError
 */
const delay = (msec, signal) => timers.setTimeout(msec, undefined, { signal });

/**
 * @description
 * Промис, который реджектится через `msec` миллисекунд ошибкой `Error` с
 * `code: "ETIMEOUT"`.
 * Если передан `signal`, отмена реджектит промис с `AbortError`.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/async.js
 *
 * @param {number} msec
 * @param {AbortSignal} [signal]
 * @returns {Promise<never>}
 *
 * @example
 *
 * await Promise.race([request(), timeout(5000)])
 * // Error: Timeout of 5000ms reached
 */
const timeout = async (msec, signal) => {
  await timers.setTimeout(msec, undefined, { signal });
  throw timeoutError(msec);
};

/**
 * @description
 * Ограничивает время ожидания промиса. Таймер снимается, как только промис
 * завершился, поэтому процесс не удерживается лишним таймаутом.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/async.js
 *
 * @template T
 * @param {Promise<T>} promise
 * @param {number} msec
 * @returns {Promise<T>}
 *
 * @example
 *
 * await timeoutify(request(), 5000)
 * // Error: Timeout of 5000ms reached
 */
const timeoutify = (promise, msec) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(timeoutError(msec));
    }, msec);
    const clear = () => clearTimeout(timer);

    promise.then(resolve, reject).finally(clear);
  });

/**
 * @description
 * Ограничивает частоту вызовов: первый вызов проходит сразу, остальные — не чаще
 * раза в `msec` миллисекунд, с последними переданными аргументами.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/async.js
 *
 * @param {Function} fn
 * @param {number} msec
 * @returns {{ fn: Function, cancel: () => void, flush: () => void }}
 *
 * @example
 *
 * const limited = throttle(save, 1000);
 * limited.fn(data);
 * limited.flush();
 * limited.cancel();
 */
function throttle(fn, msec) {
  let timer = null;
  let args = null;
  let pending = false;

  const invoke = () => {
    pending = false;
    fn(...args);
  };

  const tick = () => {
    if (!pending) {
      timer = null;

      return;
    }

    invoke();
    timer = setTimeout(tick, msec);
  };

  const wrapped = function () {
    const { length } = arguments;
    if (args === null || args.length !== length) args = new Array(length);
    for (let i = 0; i < length; i++) args[i] = arguments[i];
    pending = true;

    if (timer !== null) return;

    invoke();
    timer = setTimeout(tick, msec);
  };

  const cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    args = null;
    pending = false;
  };

  const flush = () => {
    if (timer === null) return;

    clearTimeout(timer);
    timer = null;
    if (pending) invoke();
  };

  return { fn: wrapped, cancel, flush };
}

/**
 * @description
 * Откладывает вызов до паузы в `msec` миллисекунд: пока вызовы идут подряд,
 * выполняется только последний. Таймер не пересоздается на каждый вызов —
 * он один на серию и при необходимости продлевает сам себя.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/async.js
 *
 * @param {Function} fn
 * @param {number} msec
 * @returns {{ fn: Function, cancel: () => void, flush: () => void }}
 *
 * @example
 *
 * const deferred = debounce(search, 300);
 * deferred.fn(query);
 * deferred.flush();
 * deferred.cancel();
 */
function debounce(fn, msec) {
  let timer = null;
  let args = null;
  let pending = false;
  let last = 0;

  const invoke = () => {
    pending = false;
    fn(...args);
  };

  const tick = () => {
    const rest = msec - (Date.now() - last);

    if (rest > 0) {
      timer = setTimeout(tick, rest);

      return;
    }

    timer = null;
    if (pending) invoke();
  };

  const wrapped = function () {
    const { length } = arguments;
    if (args === null || args.length !== length) args = new Array(length);
    for (let i = 0; i < length; i++) args[i] = arguments[i];
    pending = true;
    last = Date.now();

    if (timer === null) timer = setTimeout(tick, msec);
  };

  const cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    args = null;
    pending = false;
  };

  const flush = () => {
    if (timer === null) return;

    clearTimeout(timer);
    timer = null;
    if (pending) invoke();
  };

  return { fn: wrapped, cancel, flush };
}

module.exports = { delay, timeout, timeoutify, throttle, debounce };
