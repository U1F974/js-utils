const { inspect } = require("node:util");

const { isNil, isBigInt } = require("./util.js");

/**
 * @description
 * Форматирует в строку через `inspect` из `node:util` данные принимаемые в `data`
 *
 * @param {unknown} data Любое значение
 * @param {boolean} [compact] Если установить для этого параметра значение «false», каждый ключ объекта будет отображаться в новой строке. По умолчанию `false`
 * @returns {string}
 *
 * @example
 *
 * inspectFmt({name: "ivan", age: 11 })
 * // {
 * //   name: 'ivan',
 * //   age: 11
 * // }
 */
const inspectFmt = (data, compact = false) =>
  inspect(data, { depth: null, compact });

/**
 * @description
 * Форматирует в строку через `JSON.stringify` данные принимаемые в `data`.
 *
 * Используется кастомный [replacer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#replacer) для работы с `bigint`
 * ```js
 * (_, value) => (isBigInt(value) ? String(value) : value)
 * ```
 *
 * @param {unknown} data Любое значение
 * @param {number} [space] Добавляет отступы, пробелы и символы разрыва строки в текст JSON возвращаемого значения, чтобы его было легче читать. По умолчанию равен `2`
 * @returns {string}
 *
 * @example
 *
 * jsonFmt({ name: "ivan", age: 11, wallet: { balance: 1233675445217861n } })
 * // {
 * //   "name": "ivan",
 * //   "age": 11,
 * //   "wallet": {
 * //     "balance": "1233675445217861"
 * //   }
 * // }
 */
const jsonFmt = (data, space = 2) =>
  JSON.stringify(
    data,
    (_, value) => (isBigInt(value) ? String(value) : value),
    space
  );

/**
 * @description
 * Приводит строку к нижнему регистру.
 *
 * @param {string} str
 * @returns {string | undefined}
 *
 * @example
 *
 * toLower("Hello World")
 * // "hello world"
 */
const toLower = (str) => str?.toLowerCase();

/**
 * @description
 * Приводит строку к верхнему регистру.
 *
 * @param {string} str
 * @returns {string | undefined}
 *
 * @example
 *
 * toUpper("Hello World")
 * // "HELLO WORLD"
 */
const toUpper = (str) => str?.toUpperCase();

/**
 * @description
 * Поднимает первый символ строки в верхний регистр, остальные — в нижний.
 *
 * @param {string} str
 * @returns {string | undefined}
 *
 * @example
 *
 * capitalize("hello world")
 * // "Hello world"
 *
 * capitalize("hELLO")
 * // "Hello"
 */
const capitalize = (str) =>
  isNil(str)
    ? undefined
    : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

module.exports = {
  inspectFmt,
  jsonFmt,
  toLower,
  toUpper,
  capitalize,
};
