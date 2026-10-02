/**
 * @description
 * Создает массив элементов, разбитых на группы длиной `size`.
 * Если массив не может быть разделен равномерно, последним фрагментом будут оставшиеся элементы.
 *
 * @source https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L6839
 * @source https://github.com/DustFoundation/utils/blob/main/src/functions/chunk.ts
 *
 * @template T
 * @param {T[]} array
 * @param {number} size
 * @returns {T[][]}
 *
 * @example
 *
 * chunk(['a', 'b', 'c', 'd'], 2);
 * // [['a', 'b'], ['c', 'd']]
 *
 * chunk(['a', 'b', 'c', 'd'], 3);
 * // [['a', 'b', 'c'], ['d']]
 *
 */
function chunk(array, size) {
  if (size < 1) throw new Error("Chunk size cannot be less than 1!");

  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
}

/**
 * @description
 * Создает версию массива без дубликатов, используя === для проверки равенства объектов.
 * В частности, сохраняется только первое вхождение каждого значения.
 * Если вы хотите вычислить уникальные элементы на основе преобразования, передайте итерируемую функцию.
 *
 * @source https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L8417
 * @source https://github.com/jashkenas/underscore/blob/master/modules/uniq.js
 *
 * @template T
 * @param {T[]} array
 * @param {Function} iteratee
 * @returns {T[]}
 */
function uniq(array, iteratee) {
  const result = [];
  const seen = new Set();

  for (const val of array) {
    const computed = iteratee ? iteratee(val) : val;

    if (seen.has(computed)) continue;

    seen.add(computed);
    result.push(val);
  }

  return result;
}

/**
 * @description
 * Возвращает копию списка с удаленными всеми ложными значениями.
 * В JavaScript значения `false`, `null`, `0`, `""`, `undefined` и `NaN` являются ложными.
 *
 * @source https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L6874
 * @source https://github.com/jashkenas/underscore/blob/master/modules/compact.js
 *
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 *
 * @example
 *
 * compact([0, 1, false, 2, '', 3]);
 * // [1, 2, 3]
 */
const compact = (array) => array.filter((val) => val);

/**
 * @description
 * Вычисляет сумму значений в массиве.
 *
 * @param {number[]} array
 * @returns {number}
 *
 * @example
 *
 * sum([4, 2, 8, 6]);
 * // 20
 */
const sum = (array) => array.reduce((prev, val) => prev + val, 0);

/**
 * @description
 * Отдает одно значение там, где может прийти как значение, так и массив
 * значений: из массива берется первый элемент, одиночное значение
 * возвращается как есть. Пригодно для заголовков и query-параметров, которые
 * в запросе могут повторяться.
 *
 * @template T
 * @param {T | T[]} [value]
 * @returns {T | undefined}
 *
 * @example
 *
 * firstValue(["a", "b"])
 * // "a"
 *
 * firstValue("a")
 * // "a"
 *
 * firstValue([])
 * // undefined
 */
const firstValue = (value) => (Array.isArray(value) ? value[0] : value);

module.exports = { chunk, uniq, compact, sum, firstValue };
