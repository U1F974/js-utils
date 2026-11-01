const { randomFillSync, randomUUID } = require('node:crypto')

let pool = ''
let offset = 0
let time = { msec: -1, hex: '', dashed: '' }

/**
 * @description
 * Отдает hex байт 6-15 для UUID v7: версия `7`, вариант `10` и 74 случайных
 * бита. Пул на 1024 UUID заполняется одним `randomFillSync` и переводится
 * в hex одним `toString`, биты версии и варианта ставятся до перевода.
 *
 * @returns {string}
 */
function randomTail() {
    if (offset === pool.length) {
        const b = randomFillSync(Buffer.allocUnsafe(10 * 1024))
        for (let i = 0; i < b.length; i += 10) {
            // byte 6: version 7 | 4 random bits
            b[i] = 0x70 | (b[i] & 0x0f)
            // byte 8: variant 10 | 6 random bits
            b[i + 2] = 0x80 | (b[i + 2] & 0x3f)
        }
        pool = b.toString('hex')
        offset = 0
    }
    return pool.slice(offset, (offset += 20))
}

/**
 * @description
 * Hex текущей миллисекунды, 12 символов, и он же с дефисами для формата
 * `'uuid'`. Пересчитывается раз в миллисекунду.
 *
 * @returns {{ msec: number, hex: string, dashed: string }}
 */
function now() {
    const msec = Date.now()
    if (msec !== time.msec) {
        const hex = msec.toString(16).padStart(12, '0')
        time = { msec, hex, dashed: `${hex.slice(0, 8)}-${hex.slice(8)}-` }
    }
    return time
}

/**
 * @description
 * Утилиты для генерации UUID
 */
const uuid = {
  /**
   * @description
   * Генерация UUID v7 - UUID, сортируемый по времени.
   * Сортируется по миллисекунде создания, внутри одной миллисекунды
   * порядок случайный. 74 случайных бита.
   *
   * @see https://www.rfc-editor.org/rfc/rfc9562#name-uuid-version-7
   *
   * @param {'hex' | 'uuid'} [fmt='uuid'] Формат вывода: `'uuid'` (со дефисами) или `'hex'` (без)
   * @returns {string}
   *
   * @example
   *
   * uuid.v7()
   * // "018cdb97-0cd4-7000-90e0-709c93aaca9e"
   *
   * uuid.v7('hex')
   * // "018cdb970cd4700090e0709c93aaca9e"
   */
    v7: (fmt = 'uuid') => {
        const tail = randomTail()
        if (fmt === 'hex') return now().hex + tail
        return `${now().dashed}${tail.slice(0, 4)}-${tail.slice(4, 8)}-${tail.slice(8)}`
    },
  /**
   * @description
   * Генерация UUID v4 - случайный UUID.
   *
   * @param {'hex' | 'uuid'} [fmt='uuid'] Формат вывода: `'uuid'` (со дефисами) или `'hex'` (без)
   * @returns {string}
   *
   * @example
   *
   * uuid.v4()
   * // "110e8400-e29b-41d4-a716-446655440000"
   *
   * uuid.v4('hex')
   * // "110e8400e29b41d4a716446655440000"
   */
    v4: (fmt = 'uuid') => {
      if (fmt === 'uuid') return randomUUID()
      else return randomUUID().replaceAll('-', '')
    }
}

module.exports = { uuid }
