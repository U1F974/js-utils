/**
 * @description
 * Отдает текущее время в [unixtime](https://wikiless.tiekoetter.com/wiki/Unix_time) — в секундах.
 *
 * @returns {number}
 *
 * @example
 *
 * unixtime()
 * // 1668283743
 */
export declare function unixtime(): number;

/**
 * @description
 * Перевод времени в [unixtime](https://wikiless.tiekoetter.com/wiki/Unix_time).
 *
 * @param {Date | number} value Дата или время в миллисекундах
 * @returns {number}
 *
 * @example
 *
 * toUnixtime(new Date())
 * // 1699035897
 *
 * toUnixtime(1699035937494)
 * // 1699035937
 */
export declare function toUnixtime(value: Date | number): number;

/**
 * @description
 * Создает таймер, измеряющий прошедшее время с момента вызова.
 *
 * @returns {{ elapsed: () => string }}
 *
 * @example
 *
 * const timer = makeTimer()
 * await doSomething()
 * console.log(timer.elapsed()) // "1.23s"
 */
export declare function makeTimer(): { elapsed: () => string };
