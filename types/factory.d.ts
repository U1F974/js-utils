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
export declare function factory<T>(
  values: any[],
  cls: new (...args: any[]) => T
): T[] | [];
