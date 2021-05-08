import {match} from 'ts-pattern';
import {RemoteData} from './RemoteData';

type ResultType<Success, Error> =
    | { type: 'ok', data: Success }
    | { type: 'failure', error: Error }

type Mapping<A, B> = (a: A) => B
type Consumer<A> = Mapping<A, void>

const map = <S, E, NewS>(result: ResultType<S, E>) => (mapping: Mapping<S, NewS>): ResultType<NewS, E> =>
    match(result)
        .with({type: 'ok'}, ({data}): ResultType<NewS, E> => ({type: 'ok', data: mapping(data)}))
        .with({type: 'failure'}, ({error}): ResultType<NewS, E> => ({type: 'failure', error}))
        .exhaustive();

const onSuccess = <S, E>(result: ResultType<S, E>) => (consumer: Consumer<S>): ResultType<S, E> =>
    map<S, E, S>(result)((data: S) => {
        consumer(data);
        return data;
    });

const mapError = <S, E, NewE>(result: ResultType<S, E>) => (mapping: Mapping<E, NewE>): ResultType<S, NewE> =>
    match(result)
        .with({type: 'ok'}, ({data}): ResultType<S, NewE> => ({type: 'ok', data}))
        .with({type: 'failure'}, ({error}): ResultType<S, NewE> => ({type: 'failure', error: mapping(error)}))
        .exhaustive();

const onError = <S, E>(result: ResultType<S, E>) => (consumer: Consumer<E>): ResultType<S, E> =>
    mapError<S, E, E>(result)((error: E) => {
        consumer(error);
        return error;
    });

const orNull = <S, E>(result: ResultType<S, E>): S | null =>
    match(result)
        .with({type: 'ok'}, ({data}) => data)
        .with({type: 'failure'}, () => null)
        .exhaustive();

const toRemoteData = <S, E>(result: ResultType<S, E>): RemoteData<S, E> =>
    match(result)
        .with({type: 'ok'}, ({data}): RemoteData<S, E> => ({type: 'loaded', data}))
        .with({type: 'failure'}, ({error}): RemoteData<S, E> => ({type: 'failure', error}))
        .exhaustive();

export interface Result<S, E> {
    map: <NewS>(mapping: Mapping<S, NewS>) => Result<NewS, E>,
    onSuccess: (consumer: Consumer<S>) => Result<S, E>,
    mapError: <NewE>(mapping: Mapping<E, NewE>) => Result<S, NewE>,
    onError: (consumer: Consumer<E>) => Result<S, E>,
    orNull: () => S | null,
    toRemoteData: () => RemoteData<S, E>,
}

const create = <S, E>(result: ResultType<S, E>): Result<S, E> => ({
    map: <NewS>(mapping: Mapping<S, NewS>) => create(map<S, E, NewS>(result)(mapping)),
    onSuccess: (consumer: Consumer<S>) => create(onSuccess(result)(consumer)),
    mapError: <NewE>(mapping: Mapping<E, NewE>) => create(mapError<S, E, NewE>(result)(mapping)),
    onError: (consumer: Consumer<E>) => create(onError(result)(consumer)),
    orNull: () => orNull(result),
    toRemoteData: () => toRemoteData(result),
});

const ok = <S, E>(data: S): Result<S, E> => (create({type: 'ok', data}));
const failure = <S, E>(error: E): Result<S, E> => (create({type: 'failure', error}));

export default create;
export {ok, failure};
