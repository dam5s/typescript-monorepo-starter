import {Mapping} from './FunctionTypes';

export declare namespace Result {
    type Ok<T> = {
        readonly isOk: true
        readonly data: T
    }

    type Err<E> = {
        readonly isOk: false
        readonly reason: E
    }
}

export type Result<T, E> =
    Result.Ok<T> | Result.Err<E>

const ok = <T, E>(data: T): Result<T, E> =>
    ({isOk: true, data});

const err = <T, E>(reason: E): Result<T, E> =>
    ({isOk: false, reason});

const mapOk = <T, E, NewT>(mapping: Mapping<T, NewT>, r: Result<T, E>): Result<NewT, E> =>
    r.isOk
        ? result.ok(mapping(r.data))
        : result.err(r.reason);

const mapErr = <T, E, NewE>(mapping: Mapping<E, NewE>, r: Result<T, E>): Result<T, NewE> =>
    r.isOk
        ? result.ok(r.data)
        : result.err(mapping(r.reason));

export const result = {
    ok,
    err,
    mapOk,
    mapErr,
};
