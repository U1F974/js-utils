/**
 * @description
 * Кольцевой буфер фиксированной вместимости.
 * При переполнении `push` затирает самый старый элемент и возвращает его.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/list.js
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
export declare class CircularBuffer<T> implements Iterable<T> {
  constructor(capacity: number, values?: Iterable<T>);
  /** Количество элементов в буфере. */
  get size(): number;
  /** Вместимость буфера. */
  get capacity(): number;
  /** Буфер пуст. */
  get isEmpty(): boolean;
  /** Буфер заполнен: следующий `push` вытеснит самый старый элемент. */
  get isFull(): boolean;
  /** Добавляет элемент. Если буфер заполнен, возвращает вытесненный элемент. */
  push(value: T): T | undefined;
  /** Извлекает самый старый элемент. */
  shift(): T | undefined;
  /** Возвращает самый старый элемент, не извлекая его. */
  peek(): T | undefined;
  /** Очищает буфер. */
  clear(): this;
  /** Возвращает элементы массивом от старых к новым. */
  toArray(): T[];
  [Symbol.iterator](): IterableIterator<T>;
}
