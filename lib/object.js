const { isObject, isDate, isRegExp } = require("./util.js");

/**
 * @description
 * Создайте глубокую копию предоставленного простого объекта.
 * Любые вложенные объекты или массивы будут дублироваться, а не скопированы по ссылке.
 *
 * @source https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L11087
 * @source https://github.com/jashkenas/underscore/blob/master/modules/clone.js
 * @source https://github.com/ramda/ramda/blob/v0.28.0/source/internal/_clone.js
 *
 * @template T
 * @param {T} object
 * @returns {T}
 */
function clone(object) {
  if (!isObject(object)) return object;
  if (isDate(object)) return object;
  if (isRegExp(object)) return object;
  if (Array.isArray(object)) return object.map((val) => clone(val));

  const tmp = Object.create(Object.getPrototypeOf(object));

  Object.entries(object).forEach(([key, value]) => {
    tmp[key] = clone(value);
  });

  return tmp;
}

module.exports = { clone };
