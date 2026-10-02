/**
 * @description
 * Узел двусвязного списка.
 */
export declare class ListNode<T> {
  constructor(value: T);
  value: T;
  prev: ListNode<T> | null;
  next: ListNode<T> | null;
}

/**
 * @description
 * Двусвязный список. Вставка и удаление с обоих концов за O(1).
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/list.js
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
export declare class LinkedList<T> implements Iterable<T> {
  constructor(values?: Iterable<T>);
  /** Количество элементов в списке. */
  get size(): number;
  /** Первый элемент или `undefined`, если список пуст. */
  get first(): T | undefined;
  /** Последний элемент или `undefined`, если список пуст. */
  get last(): T | undefined;
  /** Добавляет элемент в конец списка. */
  push(value: T): this;
  /** Добавляет элемент в начало списка. */
  unshift(value: T): this;
  /** Извлекает элемент с конца списка. */
  pop(): T | undefined;
  /** Извлекает элемент из начала списка. */
  shift(): T | undefined;
  /** Очищает список. */
  clear(): this;
  /** Возвращает элементы списка массивом от начала к концу. */
  toArray(): T[];
  [Symbol.iterator](): IterableIterator<T>;
}
