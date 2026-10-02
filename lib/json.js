/**
 * @description
 * Безопасный парсинг JSON-строки. Возвращает `undefined` при ошибке вместо исключения.
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
 * safeJsonParse('invalid json')
 * // undefined
 */
function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {}
}

module.exports = { safeJsonParse };
