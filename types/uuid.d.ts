export declare const uuid: {
  /**
   * @description
   * Генерация UUID v7 с поддержкой формата вывода.
   *
   * @param {'hex' | 'uuid'} [fmt='uuid'] Формат вывода: `'uuid'` (по умолчанию) или `'hex'`
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
  v7(fmt?: 'hex' | 'uuid'): string;

  /**
   * @description
   * Генерация UUID v4 — случайный UUID.
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
  v4(fmt?: 'hex' | 'uuid'): string;
};
