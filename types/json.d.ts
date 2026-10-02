/**
 * @description
 * Безопасный парсинг JSON-строки. Возвращает `undefined` при ошибке.
 *
 * @template T
 * @param {string} value
 * @returns {T | undefined}
 *
 * @example
 *
 * safeJsonParse('{"a":1}')
 * // { a: 1 }
 *
 * safeJsonParse('invalid')
 * // undefined
 */
export declare function safeJsonParse<T = any>(value: string): T | undefined;
