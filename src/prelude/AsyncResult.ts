import * as Result from './Result';
import {Consumer, Mapping} from './FunctionTypes';

export type RejectionError = { reason: unknown }

const create = <S, E>(promise: Promise<Result.Value<S, E>>): Pipeline<S, E> => ({
    map: <NewS>(mapping: Mapping<S, NewS>): Pipeline<NewS, E> =>
        create(
            promise.then(result => Result
                .pipeline(result)
                .map(mapping)
                .value()
            )
        ),
    mapError: <NewE>(mapping: Mapping<E, NewE>): Pipeline<S, NewE> =>
        create(
            promise.then(result => Result
                .pipeline(result)
                .mapError(mapping)
                .value()
            )
        ),
    flatMap: <NewS>(mapping: Mapping<S, Pipeline<NewS, E>>): Pipeline<NewS, E> =>
        create(new Promise<Result.Value<NewS, E>>(resolve => {
            promise.then(result => {
                Result
                    .pipeline(result)
                    .onSuccess(value => {
                        mapping(value).onComplete(resolve);
                    })
                    .onError(error => resolve(Result.failure<NewS, E>(error)));
            });
        })),
    flatMapError: <NewE>(mapping: Mapping<E, Pipeline<S, NewE>>): Pipeline<S, NewE> =>
        create(new Promise<Result.Value<S, NewE>>(resolve => {
            promise.then(result => {
                Result
                    .pipeline(result)
                    .onSuccess(value => resolve(Result.ok<S, NewE>(value)))
                    .onError(error => {
                        mapping(error).onComplete(resolve);
                    });
            });
        })),
    onSuccess: (consumer: Consumer<S>): Pipeline<S, E> =>
        create(
            promise.then(result => Result
                .pipeline(result)
                .onSuccess(consumer)
                .value()
            )
        ),
    onError: (consumer: Consumer<E>): Pipeline<S, E> =>
        create(
            promise.then(result => Result
                .pipeline(result)
                .onError(consumer)
                .value()
            )
        ),
    onComplete: (consumer: Consumer<Result.Value<S, E>>): Pipeline<S, E> =>
        create(
            promise.then(result => {
                consumer(result);
                return result;
            })
        )
});

export const ofPromise = <S>(promise: Promise<S>): Pipeline<S, RejectionError> => {
    const newPromise = promise
        .then(value => Result.ok<S, RejectionError>(value))
        .catch(reason => Result.failure<S, RejectionError>({reason}));

    return create(newPromise);
};

export const ofResult = <S, E>(result: Result.Value<S, E>): Pipeline<S, E> =>
    create(new Promise<Result.Value<S, E>>(resolve => resolve(result)));

export const ok = <S, E>(value: S): Pipeline<S, E> =>
    ofResult(Result.ok(value));

export const failure = <S, E>(error: E): Pipeline<S, E> =>
    ofResult(Result.failure(error));

export interface Pipeline<S, E> {
    map: <NewS>(mapping: Mapping<S, NewS>) => Pipeline<NewS, E>
    mapError: <NewE>(mapping: Mapping<E, NewE>) => Pipeline<S, NewE>
    flatMap: <NewS>(mapping: Mapping<S, Pipeline<NewS, E>>) => Pipeline<NewS, E>
    flatMapError: <NewE>(mapping: Mapping<E, Pipeline<S, NewE>>) => Pipeline<S, NewE>
    onSuccess: (consumer: Consumer<S>) => Pipeline<S, E>
    onError: (consumer: Consumer<E>) => Pipeline<S, E>
    onComplete: (consumer: Consumer<Result.Value<S, E>>) => Pipeline<S, E>
}
