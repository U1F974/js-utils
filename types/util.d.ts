/**
 * @description
 * Возвращает true, если `value` является типом `Object`.
 *
 * @source https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L11743
 * @source https://github.com/jashkenas/underscore/blob/master/modules/isObject.js
 *
 * @param {any} value
 * @returns {value is object}
 *
 * @example
 *
 * isObject({});
 * // true
 *
 * isObject([1, 2, 3]);
 * // true
 *
 *
 * isObject(null);
 * // false
 */
export declare function isObject(value: any): value is object;

/**
 * @description
 * Проверка `value` на `null` и `undefined`
 *
 * @source https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L11973
 *
 * @param {any} value
 * @returns {boolean}
 *
 * @example
 *
 * isNil(null);
 * // true
 *
 * isNil(void 0);
 * // true
 *
 * isNil(NaN);
 * // false
 */
export declare function isNil(value: any): boolean;

/**
 * @description
 * Возвращает true, если `value` является числом (включая NaN).
 *
 * @source https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L12003
 * @source https://github.com/jashkenas/underscore/blob/master/modules/isNumber.js
 *
 * @param {any} value
 * @returns {value is Number}
 *
 * @example
 *
 * isNumber(3);
 * // true
 *
 * isNumber(Number.MIN_VALUE);
 * // true
 *
 * isNumber(Infinity);
 * // true
 *
 * isNumber('3');
 * // false
 */
export declare function isNumber(value: any): value is number;

/**
 * @description
 * Возвращает true, если `value` является датой (Date).
 *
 * @param {any} value
 * @returns {value is Date}
 *
 * @example
 *
 * isDate(new Date());
 * // true
 *
 * isDate(new Date(Number.MIN_VALUE))
 * // true
 *
 * isDate(new Date(Number.MAX_VALUE))
 * // false
 *
 * isDate(new Date(''));
 * // false
 */
export declare function isDate(value: any): value is Date;

/**
 * @description
 * Возвращает true, если `value` является регуляркой (RegExp).
 *
 * @param {any} value
 * @returns {value is RegExp}
 *
 * @example
 *
 * isRegExp(new RegExp(/aboba/gi))
 * // true
 *
 * isRegExp(1)
 * // false
 */
export declare function isRegExp(value: any): value is RegExp;

/**
 * @description
 * Возвращает true, если `value` является строкой (String).
 *
 * @param {any} value
 * @returns {value is String}
 *
 * @example
 *
 * isString("kek")
 * // true
 *
 * isString(1)
 * // false
 */
export declare function isString(value: any): value is string;

/**
 * @description
 * Возвращает true, если `value` является bigint (BitInt).
 *
 * @param {any} value
 * @returns {value is bigint}
 *
 * @example
 *
 * isBigInt(123n)
 * // true
 *
 * isBigInt(1)
 * // false
 */
export declare function isBigInt(value: any): value is bigint;

/**
 * @description
 * Даже если элемент является объектом, у него может не быть конструктора, как в случае. когда он является объектом с нулевым прототипом, то есть созданным с помощью `Object.create(null)`.
 *
 * @param {any} value
 * @returns {boolean}
 *
 * @example
 *
 * isClassInstance({})
 * // false
 *
 * isClassInstance(new Error())
 * // true
 */
export declare function isClassInstance(value: any): boolean;

/**
 * @description
 * Предикат с защитой типа, используемый для отсеивания нулевых или неопределенных значений в операции фильтрации.
 *
 * @template T
 * @param {T | undefined | null} value
 * @returns {value is T}
 *
 * @example
 *
 * notNullOrUndefined(null)
 * // false
 *
 * notNullOrUndefined(0)
 * // true
 */
export declare function notNullOrUndefined<T>(
  value: T | undefined | null
): value is T;

/**
 * @description
 * Проверяет значение на "пустоту"
 *
 * @param {any} value
 * @returns {boolean}
 *
 * @example
 *
 * isEmpty(null)
 * // true
 *
 * isEmpty(0)
 * // false
 *
 * isEmpty("")
 * // true
 *
 * isEmpty({})
 * // true
 *
 * isEmpty({key: "value"})
 * // false
 */
export declare function isEmpty(value: any): boolean;

/**
 * @description
 * Проверяет, есть ли у объекта собственное (не унаследованное) свойство `key`.
 * В отличие от `Object.hasOwn` не бросает исключение на `null` и `undefined`.
 *
 * @param {any} object
 * @param {PropertyKey} key
 * @returns {boolean}
 *
 * @example
 *
 * hasOwn({ a: 1 }, "a")
 * // true
 *
 * hasOwn({}, "toString")
 * // false
 *
 * hasOwn(null, "a")
 * // false
 */
export declare function hasOwn(object: any, key: PropertyKey): boolean;
