const { randomFillSync } = require("node:crypto");

const urlAlphabet =
  "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

let pool = null;
let offset = 0;

/**
 * @description
 * Резервирует `bytes` случайных байт в общем пуле и сдвигает на них курсор.
 * Пул заполняется целиком и режется по кусочкам, поэтому криптоисточник
 * дергается примерно раз в `128` вызовов, а не на каждый.
 * Если запрошено больше, чем помещается, пул выделяется заново под новый размер.
 *
 * Свежевыделенный пул обязан быть заполнен: `Buffer.allocUnsafe` отдает
 * неинициализированную память, а не случайные байты.
 *
 * @param {number} bytes
 * @returns {void}
 */
const fillPool = (bytes) => {
  const resized = pool === null || pool.length < bytes;
  if (resized) pool = Buffer.allocUnsafe(bytes * 128);
  if (resized || offset + bytes > pool.length) {
    randomFillSync(pool);
    offset = 0;
  }
  offset += bytes;
};

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
function uid(size = 21) {
  fillPool(size);

  let result = "";
  for (let i = offset - size; i < offset; i++) {
    result += urlAlphabet[pool[i] & 63];
  }

  return result;
}

module.exports = { uid };
