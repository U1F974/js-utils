const { LinkedList } = require("./linked-list.js");

/**
 * @description
 * Очередь (FIFO). Построена на связном списке, поэтому `dequeue` работает за O(1),
 * в отличие от `Array.prototype.shift`.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/list.js
 *
 * @template T
 *
 * @example
 *
 * const queue = new Queue([1, 2]);
 * queue.enqueue(3);
 * queue.dequeue();
 * // 1
 */
class Queue {
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
   * Добавляет элемент в конец очереди.
   *
   * @param {T} value
   * @returns {this}
   */
  enqueue(value) {
    this.#items.push(value);

    return this;
  }

  /**
   * @description
   * Извлекает элемент из начала очереди.
   *
   * @returns {T | undefined}
   */
  dequeue() {
    return this.#items.shift();
  }

  /**
   * @description
   * Возвращает первый элемент, не извлекая его.
   *
   * @returns {T | undefined}
   */
  peek() {
    return this.#items.first;
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
   * Возвращает элементы очереди массивом в порядке извлечения.
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

module.exports = { Queue };
