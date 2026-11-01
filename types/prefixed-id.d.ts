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
export declare function genPrefixedId(
  prefix: string,
  options?: { owner?: string; time?: Date; mode?: string }
): string;
