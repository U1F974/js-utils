/**
 * @description
 * Кольцевой буфер фиксированной вместимости.
 * При переполнении `push` затирает самый старый элемент и возвращает его.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/list.js
 *
 * @template T
 *
 * @example
 *
 * const buffer = new CircularBuffer(2);
 * buffer.push(1);
 * buffer.push(2);
 * buffer.push(3);
 * // 1 — вытесненный элемент
 * buffer.toArray();
 * // [2, 3]
 */
class CircularBuffer {
  /** @type {T[]} */
  #items;
  #capacity;
  #head = 0;
  #size = 0;

  /**
   * @param {number} capacity Вместимость буфера
   * @param {Iterable<T>} [values] Начальные элементы
   */
  constructor(capacity, values) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new Error("Capacity must be a positive integer!");
    }

    this.#capacity = capacity;
    this.#items = new Array(capacity);

    if (values) for (const value of values) this.push(value);
  }

  /**
   * @description
   * Количество элементов в буфере.
   *
   * @returns {number}
   */
  get size() {
    return this.#size;
  }

  /**
   * @description
   * Вместимость буфера.
   *
   * @returns {number}
   */
  get capacity() {
    return this.#capacity;
  }

  /**
   * @description
   * Буфер пуст.
   *
   * @returns {boolean}
   */
  get isEmpty() {
    return this.#size === 0;
  }

  /**
   * @description
   * Буфер заполнен: следующий `push` вытеснит самый старый элемент.
   *
   * @returns {boolean}
   */
  get isFull() {
    return this.#size === this.#capacity;
  }

  /**
   * @description
   * Добавляет элемент. Если буфер заполнен, возвращает вытесненный элемент.
   *
   * @param {T} value
   * @returns {T | undefined}
   */
  push(value) {
    const index = (this.#head + this.#size) % this.#capacity;

    if (this.isFull) {
      const evicted = this.#items[this.#head];
      this.#items[this.#head] = value;
      this.#head = (this.#head + 1) % this.#capacity;

      return evicted;
    }

    this.#items[index] = value;
    this.#size++;

    return undefined;
  }

  /**
   * @description
   * Извлекает самый старый элемент.
   *
   * @returns {T | undefined}
   */
  shift() {
    if (this.isEmpty) return undefined;

    const value = this.#items[this.#head];
    this.#items[this.#head] = undefined;
    this.#head = (this.#head + 1) % this.#capacity;
    this.#size--;

    return value;
  }

  /**
   * @description
   * Возвращает самый старый элемент, не извлекая его.
   *
   * @returns {T | undefined}
   */
  peek() {
    return this.isEmpty ? undefined : this.#items[this.#head];
  }

  /**
   * @description
   * Очищает буфер.
   *
   * @returns {this}
   */
  clear() {
    this.#items = new Array(this.#capacity);
    this.#head = 0;
    this.#size = 0;

    return this;
  }

  /**
   * @description
   * Возвращает элементы массивом от старых к новым.
   *
   * @returns {T[]}
   */
  toArray() {
    return [...this];
  }

  /** @returns {IterableIterator<T>} */
  *[Symbol.iterator]() {
    for (let i = 0; i < this.#size; i++) {
      yield this.#items[(this.#head + i) % this.#capacity];
    }
  }
}

module.exports = { CircularBuffer };
