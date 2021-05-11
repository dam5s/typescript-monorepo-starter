import {match} from 'ts-pattern';
import {RemoteData} from './RemoteData';

type ResultValue<Success, Error> =
    | { type: 'ok', data: Success }
    | { type: 'failure', error: Error }

type Mapping<A, B> = (a: A) => B
type Consumer<A> = Mapping<A, void>

const map = <S, E, NewS>(result: ResultValue<S, E>) => (mapping: Mapping<S, NewS>): ResultValue<NewS, E> =>
    match(result)
        .with({type: 'ok'}, ({data}): ResultValue<NewS, E> => ({type: 'ok', data: mapping(data)}))
        .with({type: 'failure'}, ({error}): ResultValue<NewS, E> => ({type: 'failure', error}))
        .exhaustive();

const onSuccess = <S, E>(result: ResultValue<S, E>) => (consumer: Consumer<S>): ResultValue<S, E> =>
    map<S, E, S>(result)((data: S) => {
        consumer(data);
        return data;
    });

const flatMap = <S, E, NewS>(result: ResultValue<S, E>) => (mapping: Mapping<S, ResultValue<NewS, E>>): ResultValue<NewS, E> =>
    match(result)
        .with({type: 'ok'}, ({data}): ResultValue<NewS, E> => mapping(data))
        .with({type: 'failure'}, ({error}): ResultValue<NewS, E> => ({type: 'failure', error}))
        .exhaustive();

const mapError = <S, E, NewE>(result: ResultValue<S, E>) => (mapping: Mapping<E, NewE>): ResultValue<S, NewE> =>
    match(result)
        .with({type: 'ok'}, ({data}): ResultValue<S, NewE> => ({type: 'ok', data}))
        .with({type: 'failure'}, ({error}): ResultValue<S, NewE> => ({type: 'failure', error: mapping(error)}))
        .exhaustive();

const onError = <S, E>(result: ResultValue<S, E>) => (consumer: Consumer<E>): ResultValue<S, E> =>
    mapError<S, E, E>(result)((error: E) => {
        consumer(error);
        return error;
    });

const flatMapError = <S, E, NewE>(result: ResultValue<S, E>) => (mapping: Mapping<E, ResultValue<S, NewE>>): ResultValue<S, NewE> =>
    match(result)
        .with({type: 'ok'}, ({data}): ResultValue<S, NewE> => ({type: 'ok', data}))
        .with({type: 'failure'}, ({error}): ResultValue<S, NewE> => mapping(error))
        .exhaustive();

const orElse = <S, E>(result: ResultValue<S, E>) => (fallback: S): S =>
    match(result)
        .with({type: 'ok'}, ({data}) => data)
        .with({type: 'failure'}, () => fallback)
        .exhaustive();

const orNull = <S, E>(result: ResultValue<S, E>): S | null =>
    match(result)
        .with({type: 'ok'}, ({data}) => data)
        .with({type: 'failure'}, () => null)
        .exhaustive();

const toRemoteData = <S, E>(result: ResultValue<S, E>): RemoteData<S, E> =>
    match(result)
        .with({type: 'ok'}, ({data}): RemoteData<S, E> => ({type: 'loaded', data}))
        .with({type: 'failure'}, ({error}): RemoteData<S, E> => ({type: 'failure', error}))
        .exhaustive();

export interface Result<S, E> {
    map: <NewS>(mapping: Mapping<S, NewS>) => Result<NewS, E>,
    onSuccess: (consumer: Consumer<S>) => Result<S, E>,
    flatMap: <NewS>(mapping: Mapping<S, ResultValue<NewS, E>>) => Result<NewS, E>,
    mapError: <NewE>(mapping: Mapping<E, NewE>) => Result<S, NewE>,
    onError: (consumer: Consumer<E>) => Result<S, E>,
    flatMapError: <NewE>(mapping: Mapping<E, ResultValue<S, NewE>>) => Result<S, NewE>,
    orElse: (fallback: S) => S,
    orNull: () => S | null,
    toRemoteData: () => RemoteData<S, E>,
}

const create = <S, E>(result: ResultValue<S, E>): Result<S, E> => ({
    map: <NewS>(mapping: Mapping<S, NewS>) => create(map<S, E, NewS>(result)(mapping)),
    onSuccess: (consumer: Consumer<S>) => create(onSuccess(result)(consumer)),
    flatMap: <NewS>(mapping: Mapping<S, ResultValue<NewS, E>>) => create(flatMap<S, E, NewS>(result)(mapping)),
    mapError: <NewE>(mapping: Mapping<E, NewE>) => create(mapError<S, E, NewE>(result)(mapping)),
    onError: (consumer: Consumer<E>) => create(onError(result)(consumer)),
    flatMapError: <NewE>(mapping: Mapping<E, ResultValue<S, NewE>>) => create(flatMapError<S, E, NewE>(result)(mapping)),
    orElse: (fallback) => orElse(result)(fallback),
    orNull: () => orNull(result),
    toRemoteData: () => toRemoteData(result),
});

const ok = <S, E>(data: S): Result<S, E> => (create({type: 'ok', data}));
const failure = <S, E>(error: E): Result<S, E> => (create({type: 'failure', error}));

export default create;
export {ok, failure};
