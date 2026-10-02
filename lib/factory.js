/**
 * @description
 * Создает массив классов на основе массивов данные
 *
 * @source https://pkolt.ru/this-expression-is-not-constructable
 *
 * @template T
 * @param {any[]} values
 * @param {new T} cls
 * @returns {T[] | []}
 */
const factory = (values, cls) =>
  values?.length ? values.map((val) => new cls(val)) : [];

module.exports = { factory };
