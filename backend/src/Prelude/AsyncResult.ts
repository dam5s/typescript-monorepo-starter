import {Consumer, Mapping} from './FunctionTypes';
import {result, Result} from './Result';

export declare namespace AsyncResult {
    type Rejection = {
        reason: unknown
    }

    type CancellationToken = {
        isCancelled: boolean
    }
}

export type AsyncResult<T, E = AsyncResult.Rejection> = {
    mapOk: <NewT>(mapping: Mapping<T, NewT>) => AsyncResult<NewT, E>
    mapErr: <NewE>(mapping: Mapping<E, NewE>) => AsyncResult<T, NewE>
    onComplete: (consumer: Consumer<Result<T, E>>) => AsyncResult<T, E>
    flatMapOk: <NewT>(mapping: Mapping<T, AsyncResult<NewT, E>>) => AsyncResult<NewT, E>
    flatMapErr: <NewE>(mapping: Mapping<E, AsyncResult<T, NewE>>) => AsyncResult<T, NewE>
    promise: Promise<Result<T, E>>
    cancel: () => void
}

const createToken = () => ({
    isCancelled: false,
});

const newAsyncResult = <T, E>(promise: Promise<Result<T, E>>, token: AsyncResult.CancellationToken): AsyncResult<T, E> => {
    type Chainer<NewT, NewE> =
        (result: Result<T, E>, resolve: Consumer<Result<NewT, NewE>>) => void

    const transformWithCancellableChainer = <NewT, NewE>(chainer: Chainer<NewT, NewE>): AsyncResult<NewT, NewE> => {
        const newPromise = new Promise<Result<NewT, NewE>>(resolve => {
            promise.then(result => {
                if (!token.isCancelled) {
                    chainer(result, resolve);
                }
            });
        });
        return newAsyncResult(newPromise, token);
    };

    return {
        mapOk: <NewT>(mapping: Mapping<T, NewT>): AsyncResult<NewT, E> =>
            transformWithCancellableChainer<NewT, E>((r, resolve) => {
                resolve(result.mapOk(mapping, r));
            }),
        mapErr: <NewE>(mapping: Mapping<E, NewE>): AsyncResult<T, NewE> =>
            transformWithCancellableChainer<T, NewE>((r, resolve) => {
                resolve(result.mapErr(mapping, r));
            }),
        onComplete: (consumer: Consumer<Result<T, E>>): AsyncResult<T, E> =>
            transformWithCancellableChainer<T, E>((r, resolve) => {
                consumer(r);
                resolve(r);
            }),
        flatMapOk: <NewT>(mapping: Mapping<T, AsyncResult<NewT, E>>): AsyncResult<NewT, E> =>
            transformWithCancellableChainer<NewT, E>((r, resolve) => {
                if (r.isOk) {
                    mapping(r.data).onComplete(resolve);
                } else {
                    resolve(result.err(r.reason));
                }
            }),
        flatMapErr: <NewE>(mapping: Mapping<E, AsyncResult<T, NewE>>): AsyncResult<T, NewE> =>
            transformWithCancellableChainer<T, NewE>((r, resolve) => {
                if (r.isOk) {
                    resolve(result.ok(r.data));
                } else {
                    mapping(r.reason).onComplete(resolve);
                }
            }),
        promise,
        cancel: () => {
            token.isCancelled = true;
        },
    };
};

const ofPromise = <T>(promise: Promise<T>): AsyncResult<T> => {
    const token = createToken();
    const safePromise: Promise<Result<T, AsyncResult.Rejection>> = promise
        .then(data => result.ok<T, AsyncResult.Rejection>(data))
        .catch(reason => result.err({reason}));

    return newAsyncResult(safePromise, token);
};

const ok = <T, E>(data: T): AsyncResult<T, E> => {
    const token = createToken();
    const res = result.ok<T, E>(data);
    const promise = Promise.resolve(res);

    return newAsyncResult(promise, token);
};

const err = <T, E>(reason: E): AsyncResult<T, E> => {
    const token = createToken();
    const res = result.err<T, E>(reason);
    const promise = Promise.resolve(res);

    return newAsyncResult(promise, token);
};

export const asyncResult = {
    ofPromise,
    ok,
    err,
};
