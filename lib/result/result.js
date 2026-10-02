/**
 * @description
 * Абстрактный базовый класс монады Result.
 * Используйте `Result.ok(value)` или `Result.err(value)` для создания экземпляров.
 *
 * @template O Тип успешного значения
 * @template E Тип значения ошибки
 */
class Result {
  /**
   * @template O
   * @param {O} value
   * @returns {OkResult<O>}
   */
  static ok(value) {
    return new OkResult(value);
  }

  /**
   * @template E
   * @param {E} value
   * @returns {ErrResult<E>}
   */
  static err(value) {
    return new ErrResult(value);
  }

  /**
   * @description
   * Выполняет функцию, оборачивая результат в `OkResult`, а брошенное исключение — в `ErrResult`.
   *
   * @template O
   * @param {() => O} fn
   * @returns {OkResult<O> | ErrResult<unknown>}
   *
   * @example
   *
   * Result.from(() => JSON.parse('{"a":1}'))
   * // OkResult { #value: { a: 1 } }
   *
   * Result.from(() => JSON.parse('invalid'))
   * // ErrResult { #value: SyntaxError }
   */
  static from(fn) {
    try {
      return Result.ok(fn());
    } catch (error) {
      return Result.err(error);
    }
  }

  /**
   * @description
   * Асинхронный вариант `Result.from`. Принимает промис или функцию, возвращающую промис.
   *
   * @template O
   * @param {Promise<O> | (() => Promise<O>)} value
   * @returns {Promise<OkResult<O> | ErrResult<unknown>>}
   *
   * @example
   *
   * await Result.fromAsync(fetch(url))
   * // OkResult { #value: Response }
   *
   * await Result.fromAsync(() => fetch(url))
   * // ErrResult { #value: TypeError }
   */
  static async fromAsync(value) {
    try {
      return Result.ok(await (typeof value === "function" ? value() : value));
    } catch (error) {
      return Result.err(error);
    }
  }

  /** @returns {boolean} */
  isOk() {
    throw new Error("Method not implemented.");
  }

  /** @returns {boolean} */
  isErr() {
    throw new Error("Method not implemented.");
  }

  /** @returns {O} */
  unwrap() {
    throw new Error("Method not implemented.");
  }

  /**
   * @template U
   * @param {U} value
   * @returns {O | U}
   */
  unwrapOr(value) {
    throw new Error("Method not implemented.");
  }

  /**
   * @template U
   * @param {(error: E) => U} fn
   * @returns {O | U}
   */
  unwrapOrElse(fn) {
    throw new Error("Method not implemented.");
  }

  /** @returns {E} */
  unwrapErr() {
    throw new Error("Method not implemented.");
  }

  /**
   * @template U
   * @param {(value: O) => U} fn
   * @returns {Result<U, E>}
   */
  map(fn) {
    throw new Error("Method not implemented.");
  }

  /**
   * @template F
   * @param {(error: E) => F} fn
   * @returns {Result<O, F>}
   */
  mapErr(fn) {
    throw new Error("Method not implemented.");
  }

  /**
   * @template U
   * @template F
   * @param {(value: O) => Result<U, F>} fn
   * @returns {Result<U, E | F>}
   */
  flatMap(fn) {
    throw new Error("Method not implemented.");
  }

  /**
   * @template U
   * @param {(value: O) => U | Promise<U>} fn
   * @returns {Promise<Result<U, E>>}
   */
  mapAsync(fn) {
    throw new Error("Method not implemented.");
  }

  /**
   * @template U
   * @template F
   * @param {(value: O) => Result<U, F> | Promise<Result<U, F>>} fn
   * @returns {Promise<Result<U, E | F>>}
   */
  flatMapAsync(fn) {
    throw new Error("Method not implemented.");
  }

  /**
   * @template U
   * @param {{ ok: (value: O) => U, err: (error: E) => U }} matcher
   * @returns {U}
   */
  match(matcher) {
    throw new Error("Method not implemented.");
  }

  /**
   * @param {(value: O) => void} fn
   * @returns {this}
   */
  tap(fn) {
    throw new Error("Method not implemented.");
  }

  /**
   * @param {(error: E) => void} fn
   * @returns {this}
   */
  tapErr(fn) {
    throw new Error("Method not implemented.");
  }
}

/**
 * @description
 * Представляет успешный результат операции.
 *
 * @template O Тип успешного значения
 * @extends {Result<O, never>}
 */
class OkResult extends Result {
  #value;

  /** @param {O} value */
  constructor(value) {
    super();
    this.#value = value;
  }

  /** @returns {true} */
  isOk() {
    return true;
  }

  /** @returns {false} */
  isErr() {
    return false;
  }

  /** @returns {O} */
  unwrap() {
    return this.#value;
  }

  /**
   * @param {unknown} value
   * @returns {O}
   */
  unwrapOr(value) {
    return this.#value;
  }

  /**
   * @param {(error: never) => unknown} fn
   * @returns {O}
   */
  unwrapOrElse(fn) {
    return this.#value;
  }

  /** @returns {never} */
  unwrapErr() {
    throw new ReferenceError("Cannot unwrap a success as a failure");
  }

  /**
   * @description
   * Применяет `fn` к успешному значению.
   *
   * @template U
   * @param {(value: O) => U} fn
   * @returns {OkResult<U>}
   *
   * @example
   *
   * ok(2).map((x) => x * 2)
   * // OkResult { #value: 4 }
   */
  map(fn) {
    return Result.ok(fn(this.#value));
  }

  /**
   * @param {(error: never) => unknown} fn
   * @returns {this}
   */
  mapErr(fn) {
    return this;
  }

  /**
   * @description
   * Применяет `fn`, возвращающую `Result`, к успешному значению, не вкладывая результат.
   *
   * @template U
   * @template F
   * @param {(value: O) => Result<U, F>} fn
   * @returns {Result<U, F>}
   *
   * @example
   *
   * ok(2).flatMap((x) => ok(x + 1))
   * // OkResult { #value: 3 }
   */
  flatMap(fn) {
    return fn(this.#value);
  }

  /**
   * @template U
   * @param {(value: O) => U | Promise<U>} fn
   * @returns {Promise<OkResult<U>>}
   */
  async mapAsync(fn) {
    return Result.ok(await fn(this.#value));
  }

  /**
   * @template U
   * @template F
   * @param {(value: O) => Result<U, F> | Promise<Result<U, F>>} fn
   * @returns {Promise<Result<U, F>>}
   */
  async flatMapAsync(fn) {
    return await fn(this.#value);
  }

  /**
   * @template U
   * @param {{ ok: (value: O) => U, err: (error: never) => U }} matcher
   * @returns {U}
   */
  match(matcher) {
    return matcher.ok(this.#value);
  }

  /**
   * @param {(value: O) => void} fn
   * @returns {this}
   */
  tap(fn) {
    fn(this.#value);
    return this;
  }

  /**
   * @param {(error: never) => void} fn
   * @returns {this}
   */
  tapErr(fn) {
    return this;
  }
}

/**
 * @description
 * Представляет результат операции с ошибкой.
 *
 * @template E Тип значения ошибки
 * @extends {Result<never, E>}
 */
class ErrResult extends Result {
  #value;

  /** @param {E} value */
  constructor(value) {
    super();
    this.#value = value;
  }

  /** @returns {false} */
  isOk() {
    return false;
  }

  /** @returns {true} */
  isErr() {
    return true;
  }

  /** @returns {never} */
  unwrap() {
    throw new Error("Cannot unwrap a failure");
  }

  /**
   * @template U
   * @param {U} value
   * @returns {U}
   */
  unwrapOr(value) {
    return value;
  }

  /**
   * @description
   * Возвращает результат вызова `fn` от значения ошибки.
   *
   * @template U
   * @param {(error: E) => U} fn
   * @returns {U}
   *
   * @example
   *
   * err('boom').unwrapOrElse((e) => e.length)
   * // 4
   */
  unwrapOrElse(fn) {
    return fn(this.#value);
  }

  /** @returns {E} */
  unwrapErr() {
    return this.#value;
  }

  /**
   * @param {(value: never) => unknown} fn
   * @returns {this}
   */
  map(fn) {
    return this;
  }

  /**
   * @description
   * Применяет `fn` к значению ошибки.
   *
   * @template F
   * @param {(error: E) => F} fn
   * @returns {ErrResult<F>}
   *
   * @example
   *
   * err('boom').mapErr((e) => new Error(e))
   * // ErrResult { #value: Error }
   */
  mapErr(fn) {
    return Result.err(fn(this.#value));
  }

  /**
   * @param {(value: never) => unknown} fn
   * @returns {this}
   */
  flatMap(fn) {
    return this;
  }

  /**
   * @param {(value: never) => unknown} fn
   * @returns {Promise<this>}
   */
  async mapAsync(fn) {
    return this;
  }

  /**
   * @param {(value: never) => unknown} fn
   * @returns {Promise<this>}
   */
  async flatMapAsync(fn) {
    return this;
  }

  /**
   * @template U
   * @param {{ ok: (value: never) => U, err: (error: E) => U }} matcher
   * @returns {U}
   */
  match(matcher) {
    return matcher.err(this.#value);
  }

  /**
   * @param {(value: never) => void} fn
   * @returns {this}
   */
  tap(fn) {
    return this;
  }

  /**
   * @param {(error: E) => void} fn
   * @returns {this}
   */
  tapErr(fn) {
    fn(this.#value);
    return this;
  }
}

module.exports = { Result, OkResult, ErrResult };
