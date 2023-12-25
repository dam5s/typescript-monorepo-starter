import {Mapping} from './FunctionTypes';

export declare namespace Result {
    type Ok<T> = {
        isOk: true
        data: T
    }

    type Err<E> = {
        isOk: false
        reason: E
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

const unpack = <T, E>(r: Result<T, E>): T | E =>
    r.isOk
        ? r.data
        : r.reason;

export const result = {
    ok,
    err,
    mapOk,
    mapErr,
    unpack,
};
