/**
 * @description
 * Стек (LIFO) на массиве.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/list.js
 *
 * @template T
 *
 * @example
 *
 * const stack = new Stack([1, 2]);
 * stack.push(3);
 * stack.pop();
 * // 3
 */
class Stack {
  /** @type {T[]} */
  #items;

  /** @param {Iterable<T>} [values] Начальные элементы */
  constructor(values) {
    this.#items = values ? [...values] : [];
  }

  /**
   * @description
   * Количество элементов в стеке.
   *
   * @returns {number}
   */
  get size() {
    return this.#items.length;
  }

  /**
   * @description
   * Кладет элемент на вершину стека.
   *
   * @param {T} value
   * @returns {this}
   */
  push(value) {
    this.#items.push(value);

    return this;
  }

  /**
   * @description
   * Снимает элемент с вершины стека.
   *
   * @returns {T | undefined}
   */
  pop() {
    return this.#items.pop();
  }

  /**
   * @description
   * Возвращает верхний элемент, не снимая его.
   *
   * @returns {T | undefined}
   */
  peek() {
    return this.#items.at(-1);
  }

  /**
   * @description
   * Очищает стек.
   *
   * @returns {this}
   */
  clear() {
    this.#items = [];

    return this;
  }

  /**
   * @description
   * Возвращает элементы стека массивом в порядке снятия — от вершины к дну.
   *
   * @returns {T[]}
   */
  toArray() {
    return this.#items.slice().reverse();
  }

  /** @returns {IterableIterator<T>} */
  *[Symbol.iterator]() {
    for (let i = this.#items.length - 1; i >= 0; i--) yield this.#items[i];
  }
}

module.exports = { Stack };
