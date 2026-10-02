const { chunk, compact, sum, uniq, firstValue } = require("./array.js");
const {
  delay,
  timeout,
  timeoutify,
  throttle,
  debounce,
} = require("./async.js");
const { randomBigInt } = require("./bigint.js");
const { uid } = require("./uid.js");
const { factory } = require("./factory.js");
const { late } = require("./late.js");
const {
  inspectFmt,
  jsonFmt,
  toLower,
  toUpper,
  capitalize,
} = require("./fmt.js");
const { clone } = require("./object.js");
const { md5, sha256 } = require("./hash.js");
const { unixtime, toUnixtime, makeTimer } = require("./time.js");
const { safeJsonParse } = require("./json.js");
const { uuid } = require("./uuid.js");
const {
  isNil,
  isNumber,
  isObject,
  isDate,
  isRegExp,
  isString,
  isBigInt,
  isClassInstance,
  isEmpty,
  notNullOrUndefined,
  hasOwn,
} = require("./util.js");

const { err, ok } = require("./result/result.factory.js");
const { ErrResult, OkResult, Result } = require("./result/result.js");

const { LinkedList, ListNode } = require("./structures/linked-list.js");
const { Queue } = require("./structures/queue.js");
const { Stack } = require("./structures/stack.js");
const { Deque } = require("./structures/deque.js");
const { CircularBuffer } = require("./structures/circular-buffer.js");

module.exports = {
  chunk,
  compact,
  sum,
  uniq,
  firstValue,
  randomBigInt,
  uid,
  factory,
  late,
  inspectFmt,
  jsonFmt,
  toLower,
  toUpper,
  capitalize,
  clone,
  md5,
  sha256,
  unixtime,
  toUnixtime,
  makeTimer,
  delay,
  timeout,
  timeoutify,
  throttle,
  debounce,
  safeJsonParse,
  uuid,
  isNil,
  isNumber,
  isObject,
  isDate,
  isRegExp,
  isString,
  isBigInt,
  isEmpty,
  isClassInstance,
  notNullOrUndefined,
  hasOwn,
  ok,
  err,
  Result,
  ErrResult,
  OkResult,
  LinkedList,
  ListNode,
  Queue,
  Stack,
  Deque,
  CircularBuffer,
};

module.exports._ = module.exports;
module.exports.default = module.exports;
