import {Consumer, Mapping} from './FunctionTypes';

export type Ok<T> = {
    isOk: true
    data: T
}

export type Err<E> = {
    isOk: false
    reason: E
}

export type Result<T, E> = (Ok<T> | Err<E>) & {
    mapOk: <NewT>(mapping: Mapping<T, NewT>) => Result<NewT, E>
    mapErr: <NewE>(mapping: Mapping<E, NewE>) => Result<T, NewE>
    onOk: (consumer: Consumer<T>) => Result<T, E>
    onErr: (consumer: Consumer<E>) => Result<T, E>
}

const ok = <T, E>(data: T): Result<T, E> => ({
    isOk: true,
    data,
    mapOk: <NewT>(mapping: Mapping<T, NewT>) => ok<NewT, E>(mapping(data)),
    mapErr: <NewE>() => ok<T, NewE>(data),
    onOk: (consumer: Consumer<T>) => { consumer(data); return ok(data); },
    onErr: () => ok(data),
});

const err = <T, E>(reason: E): Result<T, E> => ({
    isOk: false,
    reason,
    mapOk: <NewT>() => err<NewT, E>(reason),
    mapErr: <NewE>(mapping: Mapping<E, NewE>) => err<T, NewE>(mapping(reason)),
    onOk: () => err(reason),
    onErr: (consumer: Consumer<E>) => { consumer(reason); return err(reason); },
});

export const result = {
    ok,
    err,
};
