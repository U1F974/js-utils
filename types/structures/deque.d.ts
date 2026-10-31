/**
 * @description
 * Двусторонняя очередь: добавление и извлечение с обоих концов за O(1).
 * Построена на растущем кольцевом буфере. Память после пика не освобождается
 * до `clear()`.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/deque.js
 *
 * @example
 *
 * const deque = new Deque([2]);
 * deque.pushFront(1);
 * deque.pushBack(3);
 * deque.toArray();
 * // [1, 2, 3]
 */
export declare class Deque<T> implements Iterable<T> {
  constructor(values?: Iterable<T>);
  /** Количество элементов в очереди. */
  get size(): number;
  /** Добавляет элемент в начало. */
  pushFront(value: T): this;
  /** Добавляет элемент в конец. */
  pushBack(value: T): this;
  /** Извлекает элемент из начала. */
  popFront(): T | undefined;
  /** Извлекает элемент с конца. */
  popBack(): T | undefined;
  /** Возвращает первый элемент, не извлекая его. */
  peekFront(): T | undefined;
  /** Возвращает последний элемент, не извлекая его. */
  peekBack(): T | undefined;
  /** Очищает очередь. */
  clear(): this;
  /** Возвращает элементы массивом от начала к концу. */
  toArray(): T[];
  [Symbol.iterator](): IterableIterator<T>;
}
