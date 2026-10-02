/**
 * @description
 * Узел двусвязного списка.
 *
 * @template T
 */
class ListNode {
  /** @param {T} value */
  constructor(value) {
    /** @type {T} */
    this.value = value;
    /** @type {ListNode<T> | null} */
    this.prev = null;
    /** @type {ListNode<T> | null} */
    this.next = null;
  }
}

/**
 * @description
 * Двусвязный список. Вставка и удаление с обоих концов за O(1).
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/list.js
 *
 * @template T
 *
 * @example
 *
 * const list = new LinkedList([1, 2]);
 * list.push(3);
 * list.shift();
 * // 1
 * [...list];
 * // [2, 3]
 */
class LinkedList {
  /** @type {ListNode<T> | null} */
  #head = null;
  /** @type {ListNode<T> | null} */
  #tail = null;
  #size = 0;

  /** @param {Iterable<T>} [values] Начальные элементы */
  constructor(values) {
    if (values) for (const value of values) this.push(value);
  }

  /**
   * @description
   * Количество элементов в списке.
   *
   * @returns {number}
   */
  get size() {
    return this.#size;
  }

  /**
   * @description
   * Первый элемент или `undefined`, если список пуст.
   *
   * @returns {T | undefined}
   */
  get first() {
    return this.#head?.value;
  }

  /**
   * @description
   * Последний элемент или `undefined`, если список пуст.
   *
   * @returns {T | undefined}
   */
  get last() {
    return this.#tail?.value;
  }

  /**
   * @description
   * Добавляет элемент в конец списка.
   *
   * @param {T} value
   * @returns {this}
   */
  push(value) {
    const node = new ListNode(value);

    if (this.#tail === null) {
      this.#head = node;
      this.#tail = node;
    } else {
      node.prev = this.#tail;
      this.#tail.next = node;
      this.#tail = node;
    }

    this.#size++;

    return this;
  }

  /**
   * @description
   * Добавляет элемент в начало списка.
   *
   * @param {T} value
   * @returns {this}
   */
  unshift(value) {
    const node = new ListNode(value);

    if (this.#head === null) {
      this.#head = node;
      this.#tail = node;
    } else {
      node.next = this.#head;
      this.#head.prev = node;
      this.#head = node;
    }

    this.#size++;

    return this;
  }

  /**
   * @description
   * Извлекает элемент с конца списка.
   *
   * @returns {T | undefined}
   */
  pop() {
    const node = this.#tail;
    if (node === null) return undefined;

    this.#tail = node.prev;

    if (this.#tail === null) this.#head = null;
    else this.#tail.next = null;

    node.prev = null;
    this.#size--;

    return node.value;
  }

  /**
   * @description
   * Извлекает элемент из начала списка.
   *
   * @returns {T | undefined}
   */
  shift() {
    const node = this.#head;
    if (node === null) return undefined;

    this.#head = node.next;

    if (this.#head === null) this.#tail = null;
    else this.#head.prev = null;

    node.next = null;
    this.#size--;

    return node.value;
  }

  /**
   * @description
   * Очищает список.
   *
   * @returns {this}
   */
  clear() {
    this.#head = null;
    this.#tail = null;
    this.#size = 0;

    return this;
  }

  /**
   * @description
   * Возвращает элементы списка массивом от начала к концу.
   *
   * @returns {T[]}
   */
  toArray() {
    return [...this];
  }

  /** @returns {IterableIterator<T>} */
  [Symbol.iterator]() {
    let node = this.#head;

    return {
      next: () => {
        if (node === null) return { value: undefined, done: true };

        const { value } = node;
        node = node.next;

        return { value, done: false };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

module.exports = { LinkedList, ListNode };
