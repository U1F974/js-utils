/**
 * @description
 * Генерация рандомной строки с символами (`A-Za-z0-9_-`)
 *
 * @source https://github.com/ai/nanoid/blob/main/index.js
 *
 * @param {number} [size=21] Какого размера нужно генерировать строку. По умолчанию `21`
 * @returns {string}
 *
 * @example
 *
 * uid(100)
 * // iFA27Jf8Jtn7WpqN-S2mw1nrBt9j8cbtxkb1q672C5RZOGcI5UrlSJUmlswiuqYzZfC6TxVkonf0YwiOX-bMLTJXRTg0zokfhR_2
 *
 * uid()
 * // Qt8kPUze4vD3akfa4NNHX
 */
export declare function uid(size?: number): string;
