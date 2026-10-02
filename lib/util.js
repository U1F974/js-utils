const { toString } = Object.prototype;

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
const isNil = (value) => value == null;

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
const isObject = (value) =>
  !isNil(value) && (typeof value === "object" || typeof value === "function");

/**
 * @description
 * Возвращает true, если `value` является числом (включая NaN).
 *
 * @source https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L12003
 * @source https://github.com/jashkenas/underscore/blob/master/modules/isNumber.js
 *
 * @param {any} value
 * @returns {value is number}
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
const isNumber = (value) => typeof value == "number";

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
const isDate = (value) => value instanceof Date && !isNaN(value.valueOf());

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
const isRegExp = (value) => toString.call(value) === "[object RegExp]";

/**
 * @description
 * Возвращает true, если `value` является строкой (String).
 *
 * @param {any} value
 * @returns {value is string}
 *
 * @example
 *
 * isString("kek")
 * // true
 *
 * isString(1)
 * // false
 */
const isString = (value) => typeof value === "string";

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
const isBigInt = (value) => typeof value === "bigint";

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
const isClassInstance = (value) =>
  isObject(value) && value.constructor && value.constructor.name !== "Object";

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
const notNullOrUndefined = (value) => value !== undefined && value !== null;

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
function isEmpty(value) {
  if (isNil(value)) return true;
  if (Array.isArray(value) || isString(value)) return !value.length;
  if (isObject(value)) return !Object.keys(value).length;
  if (isNaN(value)) return false;
  if (isNumber(value)) return false;
}

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
function hasOwn(object, key) {
  if (isNil(object)) return false;

  return Object.hasOwn(object, key);
}

module.exports = {
  isNil,
  isObject,
  isNumber,
  isDate,
  isRegExp,
  isString,
  isBigInt,
  isClassInstance,
  notNullOrUndefined,
  isEmpty,
  hasOwn,
};
