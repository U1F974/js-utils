import { ErrResult, OkResult } from "./result";

export declare function ok<O>(value: O): OkResult<O>;
export declare function err<E>(value: E): ErrResult<E>;
