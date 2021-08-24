import {Consumer, Mapping} from './FunctionTypes';
import {result, Result} from './Result';

export interface AsyncResult<T, E> {
    mapOk: <NewT>(mapping: Mapping<T, NewT>) => AsyncResult<NewT, E>
    mapErr: <NewE>(mapping: Mapping<E, NewE>) => AsyncResult<T, NewE>
    onComplete: (consumer: Consumer<Result<T, E>>) => AsyncResult<T, E>
    flatMapOk: <NewT>(mapping: Mapping<T, AsyncResult<NewT, E>>) => AsyncResult<NewT, E>
    promise: Promise<Result<T, E>>
}

export type Rejection = {
    reason: unknown
}

const newAsyncResult = <T, E>(promise: Promise<Result<T, E>>): AsyncResult<T, E> => ({

    mapOk: <NewT>(mapping: Mapping<T, NewT>): AsyncResult<NewT, E> =>
        newAsyncResult(promise.then(r => r.mapOk(mapping))),
    mapErr: <NewE>(mapping: Mapping<E, NewE>): AsyncResult<T, NewE> =>
        newAsyncResult(promise.then(r => r.mapErr(mapping))),
    onComplete: (consumer: Consumer<Result<T, E>>): AsyncResult<T, E> => {
        const newPromise = promise.then(r => { consumer(r); return r; });
        return newAsyncResult(newPromise);
    },
    flatMapOk: <NewT>(mapping: Mapping<T, AsyncResult<NewT, E>>): AsyncResult<NewT, E> => {
        const newPromise = new Promise<Result<NewT, E>>(resolve => {
            promise.then(res =>
                res
                    .onOk(data => mapping(data).onComplete(resolve))
                    .onErr(reason => resolve(result.err(reason)))
            );
        });
        return newAsyncResult(newPromise);
    },
    promise: promise
});

const ofPromise = <T>(promise: Promise<T>): AsyncResult<T, Rejection> => {
    const safePromise: Promise<Result<T, Rejection>> = promise
        .then(data => result.ok<T, Rejection>(data))
        .catch(reason => result.err({reason}));

    return newAsyncResult(safePromise);
};

const ok = <T, E>(data: T): AsyncResult<T, E> => {
    const res = result.ok<T, E>(data);
    const promise = Promise.resolve(res);
    return newAsyncResult(promise);
};

const err = <T, E>(reason: E): AsyncResult<T, E> => {
    const res = result.err<T, E>(reason);
    const promise = Promise.resolve(res);
    return newAsyncResult(promise);
};

export const asyncResult = {
    ofPromise,
    ok,
    err
};
