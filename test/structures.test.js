const { describe, it } = require("node:test");
const assert = require("node:assert");

const { LinkedList } = require("../lib/structures/linked-list.js");
const { Queue } = require("../lib/structures/queue.js");
const { Stack } = require("../lib/structures/stack.js");
const { Deque } = require("../lib/structures/deque.js");
const { CircularBuffer } = require("../lib/structures/circular-buffer.js");

describe("structures/linked-list.js", function () {
  it("constructor, fills from iterable", function () {
    assert.deepEqual(new LinkedList([1, 2, 3]).toArray(), [1, 2, 3]);
  });

  it("push and unshift", function () {
    const list = new LinkedList([2]);
    list.push(3).unshift(1);
    assert.deepEqual(list.toArray(), [1, 2, 3]);
    assert.equal(list.size, 3);
  });

  it("pop and shift", function () {
    const list = new LinkedList([1, 2, 3]);
    assert.equal(list.shift(), 1);
    assert.equal(list.pop(), 3);
    assert.deepEqual(list.toArray(), [2]);
  });

  it("pop and shift on empty list", function () {
    const list = new LinkedList();
    assert.equal(list.pop(), undefined);
    assert.equal(list.shift(), undefined);
    assert.equal(list.size, 0);
  });

  it("first and last", function () {
    const list = new LinkedList([1, 2]);
    assert.equal(list.first, 1);
    assert.equal(list.last, 2);
  });

  it("emptied list is reusable", function () {
    const list = new LinkedList([1]);
    list.pop();
    list.push(2);
    assert.deepEqual(list.toArray(), [2]);
    assert.equal(list.first, 2);
    assert.equal(list.last, 2);
  });

  it("clear", function () {
    const list = new LinkedList([1, 2]).clear();
    assert.equal(list.size, 0);
    assert.deepEqual(list.toArray(), []);
  });
});

describe("structures/queue.js", function () {
  it("enqueue and dequeue keep FIFO order", function () {
    const queue = new Queue([1, 2]);
    queue.enqueue(3);
    assert.equal(queue.dequeue(), 1);
    assert.equal(queue.dequeue(), 2);
    assert.equal(queue.dequeue(), 3);
    assert.equal(queue.dequeue(), undefined);
  });

  it("peek does not remove the element", function () {
    const queue = new Queue([1, 2]);
    assert.equal(queue.peek(), 1);
    assert.equal(queue.size, 2);
  });

  it("iterator yields in dequeue order", function () {
    assert.deepEqual([...new Queue([1, 2, 3])], [1, 2, 3]);
  });

  it("clear", function () {
    assert.equal(new Queue([1, 2]).clear().size, 0);
  });

  it("keeps FIFO order across wraparound and growth", function () {
    const queue = new Queue();
    const model = [];
    for (let i = 0; i < 1000; i++) {
      queue.enqueue(i);
      model.push(i);
      if (i % 3 === 0) assert.equal(queue.dequeue(), model.shift());
    }

    assert.equal(queue.size, model.length);
    assert.equal(queue.peek(), model[0]);
    assert.deepEqual(queue.toArray(), model);
    assert.deepEqual([...queue], model);
  });

  it("is reusable after clear", function () {
    const queue = new Queue();
    for (let i = 0; i < 100; i++) queue.enqueue(i);
    queue.clear().enqueue(1).enqueue(2);

    assert.deepEqual(queue.toArray(), [1, 2]);
    assert.equal(queue.peek(), 1);
  });
});

describe("structures/stack.js", function () {
  it("push and pop keep LIFO order", function () {
    const stack = new Stack([1, 2]);
    stack.push(3);
    assert.equal(stack.pop(), 3);
    assert.equal(stack.pop(), 2);
    assert.equal(stack.pop(), 1);
    assert.equal(stack.pop(), undefined);
  });

  it("peek does not remove the element", function () {
    const stack = new Stack([1, 2]);
    assert.equal(stack.peek(), 2);
    assert.equal(stack.size, 2);
  });

  it("iterator yields from top to bottom", function () {
    assert.deepEqual([...new Stack([1, 2, 3])], [3, 2, 1]);
  });

  it("clear", function () {
    assert.equal(new Stack([1, 2]).clear().size, 0);
  });
});

describe("structures/deque.js", function () {
  it("pushFront and pushBack", function () {
    const deque = new Deque([2]);
    deque.pushFront(1).pushBack(3);
    assert.deepEqual(deque.toArray(), [1, 2, 3]);
  });

  it("popFront and popBack", function () {
    const deque = new Deque([1, 2, 3]);
    assert.equal(deque.popFront(), 1);
    assert.equal(deque.popBack(), 3);
    assert.equal(deque.size, 1);
  });

  it("peekFront and peekBack", function () {
    const deque = new Deque([1, 2]);
    assert.equal(deque.peekFront(), 1);
    assert.equal(deque.peekBack(), 2);
    assert.equal(deque.size, 2);
  });

  it("pop on empty deque", function () {
    const deque = new Deque();
    assert.equal(deque.popFront(), undefined);
    assert.equal(deque.popBack(), undefined);
  });

  it("matches an array across wraparound and growth", function () {
    const deque = new Deque();
    const model = [];
    for (let i = 0; i < 1000; i++) {
      if (i % 2 === 0) {
        deque.pushFront(i);
        model.unshift(i);
      } else {
        deque.pushBack(i);
        model.push(i);
      }
      if (i % 5 === 0) assert.equal(deque.popBack(), model.pop());
      if (i % 7 === 0) assert.equal(deque.popFront(), model.shift());
    }

    assert.equal(deque.size, model.length);
    assert.equal(deque.peekFront(), model[0]);
    assert.equal(deque.peekBack(), model.at(-1));
    assert.deepEqual(deque.toArray(), model);
    assert.deepEqual([...deque], model);
  });

  it("peek on empty deque", function () {
    const deque = new Deque([1]);
    deque.popBack();
    assert.equal(deque.peekFront(), undefined);
    assert.equal(deque.peekBack(), undefined);
  });
});

describe("structures/circular-buffer.js", function () {
  it("constructor, rejects non-positive capacity", function () {
    assert.throws(() => new CircularBuffer(0), /Capacity/);
    assert.throws(() => new CircularBuffer(1.5), /Capacity/);
  });

  it("push returns undefined while there is room", function () {
    const buffer = new CircularBuffer(2);
    assert.equal(buffer.push(1), undefined);
    assert.equal(buffer.push(2), undefined);
    assert.equal(buffer.isFull, true);
  });

  it("push evicts the oldest element when full", function () {
    const buffer = new CircularBuffer(2, [1, 2]);
    assert.equal(buffer.push(3), 1);
    assert.deepEqual(buffer.toArray(), [2, 3]);
  });

  it("constructor keeps only the last `capacity` values", function () {
    assert.deepEqual(new CircularBuffer(2, [1, 2, 3]).toArray(), [2, 3]);
  });

  it("shift takes the oldest element", function () {
    const buffer = new CircularBuffer(3, [1, 2, 3]);
    assert.equal(buffer.shift(), 1);
    assert.deepEqual(buffer.toArray(), [2, 3]);
    assert.equal(buffer.isFull, false);
  });

  it("shift on empty buffer", function () {
    const buffer = new CircularBuffer(2);
    assert.equal(buffer.shift(), undefined);
    assert.equal(buffer.isEmpty, true);
  });

  it("stays consistent after wrapping around", function () {
    const buffer = new CircularBuffer(3, [1, 2, 3]);
    buffer.push(4);
    buffer.push(5);
    buffer.shift();
    buffer.push(6);
    assert.deepEqual(buffer.toArray(), [4, 5, 6]);
    assert.equal(buffer.size, 3);
    assert.equal(buffer.peek(), 4);
  });

  it("clear", function () {
    const buffer = new CircularBuffer(2, [1, 2]).clear();
    assert.equal(buffer.size, 0);
    assert.deepEqual(buffer.toArray(), []);
    assert.equal(buffer.push(1), undefined);
  });
});
