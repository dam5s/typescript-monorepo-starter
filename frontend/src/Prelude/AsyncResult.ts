import {Consumer, Mapping} from './FunctionTypes';
import {result, Result} from './Result';

export declare namespace AsyncResult {
    type Rejection = {
        reason: unknown
    }

    type Options = {
        onCancel?: () => void
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

class CancellationToken {
    private _isCancelled: boolean;
    private _onCancel: (() => void) | undefined;

    constructor(options: AsyncResult.Options) {
        this._isCancelled = false;
        this._onCancel = options.onCancel;
    }

    isCancelled(): boolean {
        return this._isCancelled;
    }

    cancel() {
        if (this._isCancelled) {
            return;
        }

        this._isCancelled = true;
        this._onCancel?.();
    }
}

const newAsyncResult = <T, E>(promise: Promise<Result<T, E>>, token: CancellationToken): AsyncResult<T, E> => {
    type Chainer<NewT, NewE> =
        (result: Result<T, E>, resolve: Consumer<Result<NewT, NewE>>) => void

    const transformWithCancellableChainer = <NewT, NewE>(chainer: Chainer<NewT, NewE>): AsyncResult<NewT, NewE> => {
        const newPromise = new Promise<Result<NewT, NewE>>(resolve => {
            promise.then(result => {
                if (!token.isCancelled()) {
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
        cancel: () => token.cancel(),
    };
};

const ofPromise = <T>(promise: Promise<T>, options: AsyncResult.Options = {}): AsyncResult<T> => {
    const token = new CancellationToken(options);

    const safePromise: Promise<Result<T, AsyncResult.Rejection>> = promise
        .then(data => result.ok<T, AsyncResult.Rejection>(data))
        .catch(reason => result.err({reason}));

    return newAsyncResult(safePromise, token);
};

const ok = <T, E>(data: T, options: AsyncResult.Options = {}): AsyncResult<T, E> => {
    const token = new CancellationToken(options);
    const res = result.ok<T, E>(data);
    const promise = Promise.resolve(res);

    return newAsyncResult(promise, token);
};

const err = <T, E>(reason: E, options: AsyncResult.Options = {}): AsyncResult<T, E> => {
    const token = new CancellationToken(options);
    const res = result.err<T, E>(reason);
    const promise = Promise.resolve(res);

    return newAsyncResult(promise, token);
};

export const asyncResult = {
    ofPromise,
    ok,
    err,
};
