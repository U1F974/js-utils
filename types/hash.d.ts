/**
 * @description
 * Считает MD5-хеш строки или буфера.
 * Не криптостойкий — годится для контрольных сумм и ключей кеша, но не для паролей.
 *
 * @param {string | NodeJS.ArrayBufferView} data
 * @param {'hex' | 'base64' | 'base64url' | 'binary'} [encoding='hex'] Кодировка результата
 * @returns {string}
 *
 * @example
 *
 * md5("hello")
 * // "5d41402abc4b2a76b9719d911017c592"
 *
 * md5("hello", "base64")
 * // "XUFAKrxLKna5cZ2REBfFkg=="
 */
export declare function md5(
  data: string | NodeJS.ArrayBufferView,
  encoding?: "hex" | "base64" | "base64url" | "binary"
): string;

/**
 * @description
 * Считает SHA-256-хеш строки или буфера.
 *
 * @param {string | NodeJS.ArrayBufferView} data
 * @param {'hex' | 'base64' | 'base64url' | 'binary'} [encoding='hex'] Кодировка результата
 * @returns {string}
 *
 * @example
 *
 * sha256("hello")
 * // "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
 *
 * sha256("hello", "base64url")
 * // "LPJNul-wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ"
 */
export declare function sha256(
  data: string | NodeJS.ArrayBufferView,
  encoding?: "hex" | "base64" | "base64url" | "binary"
): string;
