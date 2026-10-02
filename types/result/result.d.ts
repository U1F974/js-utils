export declare abstract class Result<O, E> {
  static ok<O>(value: O): OkResult<O>;
  static err<E>(value: E): ErrResult<E>;
  static from<O>(fn: () => O): OkResult<O> | ErrResult<unknown>;
  static fromAsync<O>(
    value: Promise<O> | (() => Promise<O>)
  ): Promise<OkResult<O> | ErrResult<unknown>>;
  isOk(): this is OkResult<O>;
  isErr(): this is ErrResult<E>;
  unwrap(): O | never;
  unwrapOr<U>(value: U): O | U;
  unwrapOrElse<U>(fn: (error: E) => U): O | U;
  unwrapErr(): E | never;
  map<U>(fn: (value: O) => U): Result<U, E>;
  mapErr<F>(fn: (error: E) => F): Result<O, F>;
  flatMap<U, F>(fn: (value: O) => Result<U, F>): Result<U, E | F>;
  mapAsync<U>(fn: (value: O) => U | Promise<U>): Promise<Result<U, E>>;
  flatMapAsync<U, F>(
    fn: (value: O) => Result<U, F> | Promise<Result<U, F>>
  ): Promise<Result<U, E | F>>;
  match<U>(matcher: { ok: (value: O) => U; err: (error: E) => U }): U;
  tap(fn: (value: O) => void): this;
  tapErr(fn: (error: E) => void): this;
}

export declare class OkResult<O> extends Result<O, never> {
  isOk(): this is OkResult<O>;
  isErr(): this is ErrResult<never>;
  unwrap(): O;
  unwrapOr<U>(value: U): O;
  unwrapOrElse<U>(fn: (error: never) => U): O;
  unwrapErr(): never;
  map<U>(fn: (value: O) => U): OkResult<U>;
  mapErr<F>(fn: (error: never) => F): this;
  flatMap<U, F>(fn: (value: O) => Result<U, F>): Result<U, F>;
  mapAsync<U>(fn: (value: O) => U | Promise<U>): Promise<OkResult<U>>;
  flatMapAsync<U, F>(
    fn: (value: O) => Result<U, F> | Promise<Result<U, F>>
  ): Promise<Result<U, F>>;
  match<U>(matcher: { ok: (value: O) => U; err: (error: never) => U }): U;
  tap(fn: (value: O) => void): this;
  tapErr(fn: (error: never) => void): this;
}

export declare class ErrResult<E> extends Result<never, E> {
  isOk(): this is OkResult<never>;
  isErr(): this is ErrResult<E>;
  unwrap(): never;
  unwrapOr<U>(value: U): U;
  unwrapOrElse<U>(fn: (error: E) => U): U;
  unwrapErr(): E;
  map<U>(fn: (value: never) => U): this;
  mapErr<F>(fn: (error: E) => F): ErrResult<F>;
  flatMap<U, F>(fn: (value: never) => Result<U, F>): this;
  mapAsync<U>(fn: (value: never) => U | Promise<U>): Promise<this>;
  flatMapAsync<U, F>(
    fn: (value: never) => Result<U, F> | Promise<Result<U, F>>
  ): Promise<this>;
  match<U>(matcher: { ok: (value: never) => U; err: (error: E) => U }): U;
  tap(fn: (value: never) => void): this;
  tapErr(fn: (error: E) => void): this;
}
