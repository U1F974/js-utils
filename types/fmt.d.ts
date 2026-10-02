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
export declare function inspectFmt(data: unknown, compact?: boolean): string;

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
export declare function jsonFmt(data: unknown, space?: number): string;

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
export declare function toLower(str: string): string | undefined;

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
export declare function toUpper(str: string): string | undefined;

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
export declare function capitalize(str: string): string | undefined;
