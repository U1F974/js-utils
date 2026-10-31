/**
 * Начальная вместимость. Вместимость всегда степень двойки, поэтому
 * остаток от деления на нее считается через `& (length - 1)`.
 */
const INITIAL_CAPACITY = 16;

/**
 * @description
 * Растущий кольцевой буфер: добавление и извлечение с обоих концов за O(1).
 * В отличие от связного списка не создает объект на каждый элемент,
 * в отличие от `CircularBuffer` ничего не вытесняет, а растет вдвое при заполнении.
 * Буфер не уменьшается: после пика память держится до `clear()`.
 *
 * Внутренняя основа `Queue` и `Deque`, из пакета не экспортируется.
 * Интерфейс повторяет `LinkedList`.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/circular.js
 *
 * @template T
 */
class RingBuffer {
  /** @type {(T | undefined)[]} */
  #items = new Array(INITIAL_CAPACITY);
  #head = 0;
  #size = 0;

  /** @param {Iterable<T>} [values] Начальные элементы */
  constructor(values) {
    if (values) for (const value of values) this.push(value);
  }

  /** @returns {number} */
  get size() {
    return this.#size;
  }

  /** @returns {T | undefined} */
  get first() {
    return this.#size === 0 ? undefined : this.#items[this.#head];
  }

  /** @returns {T | undefined} */
  get last() {
    if (this.#size === 0) return undefined;

    return this.#items[this.#index(this.#size - 1)];
  }

  /**
   * @param {T} value
   * @returns {this}
   */
  push(value) {
    if (this.#size === this.#items.length) this.#grow();

    this.#items[this.#index(this.#size)] = value;
    this.#size++;

    return this;
  }

  /**
   * @param {T} value
   * @returns {this}
   */
  unshift(value) {
    if (this.#size === this.#items.length) this.#grow();

    this.#head = this.#index(-1);
    this.#items[this.#head] = value;
    this.#size++;

    return this;
  }

  /** @returns {T | undefined} */
  pop() {
    if (this.#size === 0) return undefined;

    const tail = this.#index(this.#size - 1);
    const value = this.#items[tail];
    this.#items[tail] = undefined;
    this.#size--;

    return value;
  }

  /** @returns {T | undefined} */
  shift() {
    if (this.#size === 0) return undefined;

    const value = this.#items[this.#head];
    this.#items[this.#head] = undefined;
    this.#head = this.#index(1);
    this.#size--;

    return value;
  }

  /** @returns {this} */
  clear() {
    this.#items = new Array(INITIAL_CAPACITY);
    this.#head = 0;
    this.#size = 0;

    return this;
  }

  /** @returns {T[]} */
  toArray() {
    const result = new Array(this.#size);
    for (let i = 0; i < this.#size; i++) {
      result[i] = this.#items[this.#index(i)];
    }

    return result;
  }

  /** @returns {IterableIterator<T>} */
  *[Symbol.iterator]() {
    for (let i = 0; i < this.#size; i++) yield this.#items[this.#index(i)];
  }

  /**
   * @description
   * Позиция в массиве для `offset`-го элемента от начала. Отрицательный
   * `offset` отсчитывается назад от начала.
   *
   * @param {number} offset
   * @returns {number}
   */
  #index(offset) {
    return (this.#head + offset) & (this.#items.length - 1);
  }

  /**
   * @description
   * Удваивает вместимость и раскладывает элементы с нуля.
   *
   * @returns {void}
   */
  #grow() {
    const items = new Array(this.#items.length * 2);
    for (let i = 0; i < this.#size; i++) {
      items[i] = this.#items[this.#index(i)];
    }

    this.#items = items;
    this.#head = 0;
  }
}

module.exports = { RingBuffer };
