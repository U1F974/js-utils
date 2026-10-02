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
export declare function delay(
  msec: number,
  signal?: AbortSignal
): Promise<void>;

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
export declare function timeout(
  msec: number,
  signal?: AbortSignal
): Promise<never>;

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
export declare function timeoutify<T>(
  promise: Promise<T>,
  msec: number
): Promise<T>;

export interface LimitControl<T extends (...args: any[]) => void> {
  /** Обертка, которую нужно вызывать вместо исходной функции. */
  fn: (...args: Parameters<T>) => void;
  /** Забыть отложенный вызов. */
  cancel(): void;
  /** Выполнить отложенный вызов немедленно. */
  flush(): void;
}

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
export declare function throttle<T extends (...args: any[]) => void>(
  fn: T,
  msec: number
): LimitControl<T>;

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
export declare function debounce<T extends (...args: any[]) => void>(
  fn: T,
  msec: number
): LimitControl<T>;
