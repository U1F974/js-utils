/**
 * @description
 * Очередь (FIFO). Построена на растущем кольцевом буфере, поэтому `dequeue`
 * работает за O(1), в отличие от `Array.prototype.shift`.
 * Память после пика не освобождается до `clear()`.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/queue.js
 *
 * @example
 *
 * const queue = new Queue([1, 2]);
 * queue.enqueue(3);
 * queue.dequeue();
 * // 1
 */
export declare class Queue<T> implements Iterable<T> {
  constructor(values?: Iterable<T>);
  /** Количество элементов в очереди. */
  get size(): number;
  /** Добавляет элемент в конец очереди. */
  enqueue(value: T): this;
  /** Извлекает элемент из начала очереди. */
  dequeue(): T | undefined;
  /** Возвращает первый элемент, не извлекая его. */
  peek(): T | undefined;
  /** Очищает очередь. */
  clear(): this;
  /** Возвращает элементы очереди массивом в порядке извлечения. */
  toArray(): T[];
  [Symbol.iterator](): IterableIterator<T>;
}
