const { Result } = require("./result.js");

/**
 * @description
 * Создает успешный результат.
 *
 * @template O
 * @param {O} value
 * @returns {import('./result.js').OkResult<O>}
 *
 * @example
 *
 * ok(42)
 * // OkResult { #value: 42 }
 */
const ok = (value) => Result.ok(value);

/**
 * @description
 * Создает результат с ошибкой.
 *
 * @template E
 * @param {E} value
 * @returns {import('./result.js').ErrResult<E>}
 *
 * @example
 *
 * err(new Error('something went wrong'))
 * // ErrResult { #value: Error }
 */
const err = (value) => Result.err(value);

module.exports = { ok, err };
