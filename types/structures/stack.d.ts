/**
 * @description
 * Стек (LIFO) на массиве.
 *
 * @source https://github.com/metarhia/metautil/blob/master/lib/list.js
 *
 * @example
 *
 * const stack = new Stack([1, 2]);
 * stack.push(3);
 * stack.pop();
 * // 3
 */
export declare class Stack<T> implements Iterable<T> {
  constructor(values?: Iterable<T>);
  /** Количество элементов в стеке. */
  get size(): number;
  /** Кладет элемент на вершину стека. */
  push(value: T): this;
  /** Снимает элемент с вершины стека. */
  pop(): T | undefined;
  /** Возвращает верхний элемент, не снимая его. */
  peek(): T | undefined;
  /** Очищает стек. */
  clear(): this;
  /** Возвращает элементы стека массивом в порядке снятия — от вершины к дну. */
  toArray(): T[];
  [Symbol.iterator](): IterableIterator<T>;
}
