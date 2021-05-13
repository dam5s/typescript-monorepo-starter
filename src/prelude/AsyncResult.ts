import * as Result from './Result';

export type RejectionError = { reason: unknown }

const create = <S, E>(promise: Promise<Result.Value<S, E>>): Type<S, E> => ({
    map: <NewS>(mapping: Mapping<S, NewS>): Type<NewS, E> =>
        create(
            promise.then(result => Result
                .chain(result)
                .map(mapping)
                .value()
            )
        ),
    onSuccess: (consumer: Consumer<S>): Type<S, E> =>
        create(
            promise.then(result => Result
                .chain(result)
                .onSuccess(consumer)
                .value()
            )
        ),
    flatMap: <NewS>(mapping: Mapping<S, Type<NewS, E>>): Type<NewS, E> =>
        create(new Promise<Result.Value<NewS, E>>(resolve => {
            promise.then(result => {
                Result
                    .chain(result)
                    .onSuccess(value => {
                        mapping(value).onComplete(resolve);
                    })
                    .onError(error => resolve(Result.failure<NewS, E>(error)));
            });
        })),
    mapError: <NewE>(mapping: Mapping<E, NewE>): Type<S, NewE> =>
        create(
            promise.then(result => Result
                .chain(result)
                .mapError(mapping)
                .value()
            )
        ),
    onError: (consumer: Consumer<E>): Type<S, E> =>
        create(
            promise.then(result => Result
                .chain(result)
                .onError(consumer)
                .value()
            )
        ),
    flatMapError: <NewE>(mapping: Mapping<E, Type<S, NewE>>): Type<S, NewE> =>
        create(new Promise<Result.Value<S, NewE>>(resolve => {
            promise.then(result => {
                Result
                    .chain(result)
                    .onSuccess(value => resolve(Result.ok<S, NewE>(value)))
                    .onError(error => {
                        mapping(error).onComplete(resolve);
                    });
            });
        })),
    onComplete: (consumer: Consumer<Result.Value<S, E>>): Type<S, E> =>
        create(
            promise.then(result => {
                consumer(result);
                return result;
            })
        )
});

export const ofPromise = <S>(promise: Promise<S>): Type<S, RejectionError> => {
    const newPromise = promise
        .then(value => Result.ok<S, RejectionError>(value))
        .catch(reason => Result.failure<S, RejectionError>({reason}));

    return create(newPromise);
};

export const ofResult = <S, E>(result: Result.Value<S, E>): Type<S, E> =>
    create(new Promise<Result.Value<S, E>>(resolve => resolve(result)));

export const ok = <S, E>(value: S): Type<S, E> =>
    ofResult(Result.ok(value));

export const failure = <S, E>(error: E): Type<S, E> =>
    ofResult(Result.failure(error));

type Mapping<A, B> = (a: A) => B
type Consumer<A> = Mapping<A, void>

export interface Type<S, E> {
    map: <NewS>(mapping: Mapping<S, NewS>) => Type<NewS, E>
    onSuccess: (consumer: Consumer<S>) => Type<S, E>
    flatMap: <NewS>(mapping: Mapping<S, Type<NewS, E>>) => Type<NewS, E>
    mapError: <NewE>(mapping: Mapping<E, NewE>) => Type<S, NewE>
    onError: (consumer: Consumer<E>) => Type<S, E>
    flatMapError: <NewE>(mapping: Mapping<E, Type<S, NewE>>) => Type<S, NewE>
    onComplete: (consumer: Consumer<Result.Value<S, E>>) => Type<S, E>
}
