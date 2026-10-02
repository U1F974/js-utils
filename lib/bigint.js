const { randomBytes } = require("node:crypto");

/**
 * @description
 * Возвращает случайное целое число в формате `BigInt`
 *
 * @param {number} [bits=64] По умолчанию `64`
 * @returns {bigint}
 *
 * @example
 *
 * randomBigInt(64)
 * // 9409313759732697550n
 *
 * randomBigInt(128)
 * // 40800982229429306396968830979296370940n
 *
 * randomBigInt(8)
 * // 141n
 */
const randomBigInt = (bits = 64) =>
  BigInt(`0x${randomBytes(bits / 8).toString("hex")}`);

module.exports = { randomBigInt };
