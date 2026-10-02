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
export declare function chunk<T>(array: T[], size: number): T[][];

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
export declare function uniq<T>(array: T[], iteratee?: Function): T[];

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
export declare function compact<T>(array: T[]): T[];

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
export declare function sum(array: number[]): number;

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
export declare function firstValue<T>(value?: T | T[]): T | undefined;
