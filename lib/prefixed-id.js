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
 * Тело корня для id потомка: у корня это вся его часть после префикса,
 * у потомка - последние 31 символ.
 *
 * @param {string} owner
 * @returns {string}
 */
const rootBody = (owner) => {
  const body = owner.slice(owner.lastIndexOf("_") + 1);
  if (body.length === 49) return body.slice(-31);
  if (body.length === 31) return body;

  throw new Error(`Owner ${owner} is not an id of genPrefixedId`);
};

/**
 * @description
 * Генерация id из символов `0-9A-Za-z`. Время - 6 символов base62,
 * unixtime в секундах.
 *
 * Без `owner`, 31 символ после префикса: `<prefix>_<время><25 случайных>`.
 *
 * С `owner`, 49 символов: `<prefix>_<время><12 случайных><тело корня>`.
 * Тело корня - его 31 символ после префикса, целиком, поэтому id корня
 * восстанавливается как его префикс и последние 31 символ. Если у `owner`
 * уже есть тело корня, берется оно, поэтому потомки одного корня на любой
 * глубине несут одно и то же тело, а длина id не растет. Тип `owner`
 * определяется по длине его части после последнего `_`: 31 - корень,
 * 49 - потомок. Любая другая длина - ошибка. Префикс и `mode` корня
 * не встраиваются.
 *
 * С `mode` после префикса добавляется маркер стенда: `<prefix>_<mode>_...`.
 * `mode` не проверяется. Он должен состоять из `0-9A-Za-z`, иначе ломается
 * формат id, и начинаться с буквы, иначе при сортировке id с маркером
 * перемешаются с id без маркера.
 * Пустой `mode` означает id без маркера. Если в префиксе есть `_`, id
 * с маркером может выглядеть как id другого префикса без маркера:
 * `chk` с `mode: "test"` и `chk_test` дают одинаковое начало.
 *
 * Id одного префикса сортируются по секунде создания при побайтовом сравнении
 * строк, с `owner` и без него вперемешку. Внутри одной секунды порядок
 * случайный. Id с маркером идут после всех id без маркера, каждый `mode`
 * отдельной группой, пока первый символ времени - цифра, то есть
 * до 2260-04-23. Регистр значим: в БД с регистронезависимой collation
 * разные id могут совпасть.
 *
 * @param {string} prefix
 * @param {{ owner?: string, time?: Date, mode?: string }} [options]
 * @param {string} [options.owner] Id корня или любого его потомка
 * @param {Date} [options.time] Время создания. По умолчанию текущее
 * @param {string} [options.mode] Стенд, например `"test"`. По умолчанию без маркера
 * @returns {string}
 *
 * @example
 *
 * genPrefixedId("org")
 * // "org_1xNamjduJcoVvkIz67kmxlQmWwmAAYm"
 *
 * genPrefixedId("usr", { owner: "org_1xNamjduJcoVvkIz67kmxlQmWwmAAYm" })
 * // "usr_1xNamjTokq7MNgEtJc1xNamjduJcoVvkIz67kmxlQmWwmAAYm"
 *
 * genPrefixedId("tok", { owner: "usr_1xNamjTokq7MNgEtJc1xNamjduJcoVvkIz67kmxlQmWwmAAYm" })
 * // "tok_1xNamjGkXoZa7KykZJ1xNamjduJcoVvkIz67kmxlQmWwmAAYm"
 *
 * genPrefixedId("usr", { time: new Date(0) })
 * // "usr_000000cI3iyzANqvtjFKnnKiqYiem4I"
 *
 * genPrefixedId("chk", { mode: "test" })
 * // "chk_test_1xNamjpze3iG8PQncEN4TkgPo6gbWnr"
 */
function genPrefixedId(prefix, { owner, time, mode } = {}) {
  const tail =
    owner == null ? randomBase62(25) : randomBase62(12) + rootBody(owner);
  const seconds =
    time == null
      ? encodeNow()
      : encodeSeconds(Math.floor(time.getTime() / 1000));
  const marker = mode ? `_${mode}` : "";

  return `${prefix}${marker}_${seconds}${tail}`;
}

module.exports = { genPrefixedId };
