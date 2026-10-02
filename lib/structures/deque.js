const { LinkedList } = require("./linked-list.js");

/**
 * @description
 * Двусторонняя очередь: добавление и извлечение с обоих концов за O(1).
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/list.js
 *
 * @template T
 *
 * @example
 *
 * const deque = new Deque([2]);
 * deque.pushFront(1);
 * deque.pushBack(3);
 * deque.toArray();
 * // [1, 2, 3]
 */
class Deque {
  /** @type {LinkedList<T>} */
  #items;

  /** @param {Iterable<T>} [values] Начальные элементы */
  constructor(values) {
    this.#items = new LinkedList(values);
  }

  /**
   * @description
   * Количество элементов в очереди.
   *
   * @returns {number}
   */
  get size() {
    return this.#items.size;
  }

  /**
   * @description
   * Добавляет элемент в начало.
   *
   * @param {T} value
   * @returns {this}
   */
  pushFront(value) {
    this.#items.unshift(value);

    return this;
  }

  /**
   * @description
   * Добавляет элемент в конец.
   *
   * @param {T} value
   * @returns {this}
   */
  pushBack(value) {
    this.#items.push(value);

    return this;
  }

  /**
   * @description
   * Извлекает элемент из начала.
   *
   * @returns {T | undefined}
   */
  popFront() {
    return this.#items.shift();
  }

  /**
   * @description
   * Извлекает элемент с конца.
   *
   * @returns {T | undefined}
   */
  popBack() {
    return this.#items.pop();
  }

  /**
   * @description
   * Возвращает первый элемент, не извлекая его.
   *
   * @returns {T | undefined}
   */
  peekFront() {
    return this.#items.first;
  }

  /**
   * @description
   * Возвращает последний элемент, не извлекая его.
   *
   * @returns {T | undefined}
   */
  peekBack() {
    return this.#items.last;
  }

  /**
   * @description
   * Очищает очередь.
   *
   * @returns {this}
   */
  clear() {
    this.#items.clear();

    return this;
  }

  /**
   * @description
   * Возвращает элементы массивом от начала к концу.
   *
   * @returns {T[]}
   */
  toArray() {
    return this.#items.toArray();
  }

  /** @returns {IterableIterator<T>} */
  [Symbol.iterator]() {
    return this.#items[Symbol.iterator]();
  }
}

module.exports = { Deque };
