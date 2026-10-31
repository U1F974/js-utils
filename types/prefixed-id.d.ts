/**
 * @description
 * Генерация id вида `<prefix>_1<время><хвост>` из символов `0-9A-Za-z`.
 * `1` - версия формата, время - 6 символов секунды создания,
 * хвост - 20 случайных символов.
 *
 * С `mode` после префикса добавляется маркер стенда: `<prefix>_<mode>_1...`.
 * `mode` не проверяется. Он должен состоять из `0-9A-Za-z`, иначе ломается
 * формат id, и начинаться с буквы, иначе при сортировке id с маркером
 * перемешаются с id без маркера.
 * Пустой `mode` означает id без маркера. Если в префиксе есть `_`, id
 * с маркером может выглядеть как id другого префикса без маркера:
 * `chk` с `mode: "test"` и `chk_test` дают одинаковое начало.
 *
 * Id одного префикса сортируются по секунде создания при побайтовом сравнении
 * строк. Внутри одной секунды порядок случайный. Id с маркером идут после
 * всех id без маркера, каждый `mode` отдельной группой. Регистр значим:
 * в БД с регистронезависимой collation разные id могут совпасть.
 *
 * С `owner` первые 10 символов хвоста берутся из `owner.slice(-20, -10)`,
 * случайных остается 10. У id, созданного этой функцией, это начало его
 * хвоста, поэтому вся цепочка владельцев делит одни и те же 10 символов.
 * Если `owner` короче 20 символов, недостающее добивается `0`.
 *
 * @param {string} prefix
 * @param {{ owner?: string, time?: Date, mode?: string }} [options]
 * @param {string} [options.owner] Id владельца
 * @param {Date} [options.time] Время создания. По умолчанию текущее
 * @param {string} [options.mode] Стенд, например `"test"`. По умолчанию без маркера
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
 *
 * prefixedId("chk", { mode: "test" })
 * // "chk_test_11xN33Na1b046dW6fsjQsgCpF2t"
 */
export declare function prefixedId(
  prefix: string,
  options?: { owner?: string; time?: Date; mode?: string }
): string;
