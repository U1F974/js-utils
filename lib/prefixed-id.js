const { randomBytes } = require("node:crypto");

/**
 * Цифры, потом заглавные, потом строчные: порядок ASCII, поэтому id одного
 * префикса сортируются по секунде создания.
 */
const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/** Код символа для каждого значения байта, `0` для отбрасываемых байт. */
const CODES = new Uint8Array(256);
for (let byte = 0; byte < 248; byte++) CODES[byte] = BASE62.charCodeAt(byte % 62);

let pool = "";
let offset = 0;
let now = { second: -1, chars: "" };

/**
 * @description
 * Отдает `length` случайных символов base62 из общего пула.
 * Байты меньше `248` делятся на 62 символа поровну (248 = 4 x 62), остальные
 * отбрасываются, поэтому распределение равномерное.
 * Пул пополняется по `16384` случайных байт, это около 15 800 символов.
 *
 * @param {number} length
 * @returns {string}
 */
const randomBase62 = (length) => {
  if (offset + length > pool.length) {
    const bytes = randomBytes(16_384);
    let n = 0;
    for (let i = 0; i < bytes.length; i++) {
      const code = CODES[bytes[i]];
      if (code !== 0) bytes[n++] = code;
    }
    pool = bytes.toString("latin1", 0, n);
    offset = 0;
  }

  offset += length;
  
  return pool.slice(offset - length, offset);
};

/**
 * @description
 * Кодирует unixtime в секундах в 6 символов base62: хватает примерно
 * на 1800 лет от 1970 года.
 *
 * @param {number} seconds
 * @returns {string}
 */
const encodeSeconds = (seconds) => {
  if (!(seconds >= 0 && seconds < 62 ** 6)) throw new Error(`Second ${seconds} is out of the id range`);

  let chars = "";
  for (let i = 0; i < 6; i++, seconds = Math.floor(seconds / 62)) chars = BASE62[seconds % 62] + chars;

  return chars;
};

/**
 * @description
 * Текущая секунда в base62. Кодируется один раз за секунду.
 *
 * @returns {string}
 */
const encodeNow = () => {
  const second = Math.floor(Date.now() / 1000);
  if (second !== now.second) now = { second, chars: encodeSeconds(second) };
  
  return now.chars;
};

/**
 * @description
 * Генерация id вида `<prefix>_1<время><хвост>` из символов `0-9A-Za-z`.
 * `1` - версия формата, время - 6 символов секунды создания,
 * хвост - 20 случайных символов.
 *
 * Id одного префикса сортируются по секунде создания при побайтовом сравнении
 * строк. Внутри одной секунды порядок случайный. Регистр значим: в БД
 * с регистронезависимой collation разные id могут совпасть.
 *
 * С `owner` первые 10 символов хвоста берутся из `owner.slice(-20, -10)`,
 * случайных остается 10. У id, созданного этой функцией, это начало его
 * хвоста, поэтому вся цепочка владельцев делит одни и те же 10 символов.
 * Если `owner` короче 20 символов, недостающее добивается `0`.
 *
 * @param {string} prefix
 * @param {{ owner?: string, time?: Date }} [options]
 * @param {string} [options.owner] Id владельца
 * @param {Date} [options.time] Время создания. По умолчанию текущее
 * @returns {string}
 *
 * @example
 *
 * prefixedId("usr")
 * // "usr_11xN1gkBbC9wzTPJzppRHWC3v6i"
 *
 * prefixedId("tok", { owner: "usr_11xN1gkBbC9wzTPJzppRHWC3v6i" })
 * // "tok_11xN1gkBbC9wzTPJzqVnSMKg4kC"
 *
 * prefixedId("usr", { time: new Date(0) })
 * // "usr_1000000oyCMqleOc5RZWHlbOnRl"
 */
function prefixedId(prefix, { owner, time } = {}) {
  const tail =
    owner == null
      ? randomBase62(20)
      : owner.slice(-20, -10).padStart(10, "0") + randomBase62(10);
  const seconds =
    time == null
      ? encodeNow()
      : encodeSeconds(Math.floor(time.getTime() / 1000));

  return `${prefix}_1${seconds}${tail}`;
}

module.exports = { prefixedId };
