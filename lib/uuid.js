const { randomBytes, randomUUID } = require('node:crypto')

/**
 * @description
 * Утилиты для генерации UUID
 */
const uuid = {
  /**
   * @description
   * Генерация UUID v7 - монотонный, сортируемый по времени UUID.
   *
   * @source https://stackoverflow.com/a/77391845
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
        const b = randomBytes(16)

        const msec = Date.now()
        // top 16 bits of 48-bit ts
        const hi = ((msec / 0x100000000) & 0xffff) >>> 0
        // low 32 bits
        const lo = msec >>> 0

        // seq from original random bytes 6..9 (before we overwrite them)
        const seq = ((b[6] & 0x7f) << 24) | (b[7] << 16) | (b[8] << 8) | b[9]

        // timestamp (48 bits)
        b[0] = (hi >>> 8) & 0xff
        b[1] = hi & 0xff
        b[2] = (lo >>> 24) & 0xff
        b[3] = (lo >>> 16) & 0xff
        b[4] = (lo >>> 8) & 0xff
        b[5] = lo & 0xff

        // byte 6: `version` (4 bits) | sequence bits 28-31 (4 bits)
        b[6] = 0x70 | ((seq >>> 28) & 0x0f)
        // byte 7: sequence bits 20-27 (8 bits)
        b[7] = (seq >>> 20) & 0xff
        // byte 8: `variant` (2 bits) | sequence bits 14-19 (6 bits)
        b[8] = 0x80 | ((seq >>> 14) & 0x3f)
        // byte 9: sequence bits 6-13 (8 bits)
        b[9] = (seq >>> 6) & 0xff
        // byte 10: sequence bits 0-5 (6 bits) | random (2 bits)
        b[10] = ((seq << 2) & 0xff) | (b[10] & 0x03)

        const hex = b.toString('hex')

        if (fmt === 'hex') return hex
        else
            return (
                hex.slice(0, 8) +
                '-' +
                hex.slice(8, 12) +
                '-' +
                hex.slice(12, 16) +
                '-' +
                hex.slice(16, 20) +
                '-' +
                hex.slice(20)
            )
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
