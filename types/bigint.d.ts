/**
 * @description
 * Возвращает случайное целое число в формате `BigInt`
 *
 * @param {number} bits По умолчанию `64`
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
export declare function randomBigInt(bits?: number): bigint;
