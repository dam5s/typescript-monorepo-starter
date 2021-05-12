import {match} from 'ts-pattern';
import * as RemoteData from './RemoteData';

export type Value<Success, Error> =
    | { type: 'ok', data: Success }
    | { type: 'failure', error: Error }

type Mapping<A, B> = (a: A) => B
type Consumer<A> = Mapping<A, void>

const map = <S, E, NewS>(result: Value<S, E>) => (mapping: Mapping<S, NewS>): Value<NewS, E> =>
    match(result)
        .with({type: 'ok'}, ({data}): Value<NewS, E> => ({type: 'ok', data: mapping(data)}))
        .with({type: 'failure'}, ({error}): Value<NewS, E> => ({type: 'failure', error}))
        .exhaustive();

const onSuccess = <S, E>(result: Value<S, E>) => (consumer: Consumer<S>): Value<S, E> =>
    map<S, E, S>(result)((data: S) => {
        consumer(data);
        return data;
    });

const flatMap = <S, E, NewS>(result: Value<S, E>) => (mapping: Mapping<S, Value<NewS, E>>): Value<NewS, E> =>
    match(result)
        .with({type: 'ok'}, ({data}): Value<NewS, E> => mapping(data))
        .with({type: 'failure'}, ({error}): Value<NewS, E> => ({type: 'failure', error}))
        .exhaustive();

const mapError = <S, E, NewE>(result: Value<S, E>) => (mapping: Mapping<E, NewE>): Value<S, NewE> =>
    match(result)
        .with({type: 'ok'}, ({data}): Value<S, NewE> => ({type: 'ok', data}))
        .with({type: 'failure'}, ({error}): Value<S, NewE> => ({type: 'failure', error: mapping(error)}))
        .exhaustive();

const onError = <S, E>(result: Value<S, E>) => (consumer: Consumer<E>): Value<S, E> =>
    mapError<S, E, E>(result)((error: E) => {
        consumer(error);
        return error;
    });

const flatMapError = <S, E, NewE>(result: Value<S, E>) => (mapping: Mapping<E, Value<S, NewE>>): Value<S, NewE> =>
    match(result)
        .with({type: 'ok'}, ({data}): Value<S, NewE> => ({type: 'ok', data}))
        .with({type: 'failure'}, ({error}): Value<S, NewE> => mapping(error))
        .exhaustive();

const orElse = <S, E>(result: Value<S, E>) => (fallback: S): S =>
    match(result)
        .with({type: 'ok'}, ({data}) => data)
        .with({type: 'failure'}, () => fallback)
        .exhaustive();

const orNull = <S, E>(result: Value<S, E>): S | null =>
    match(result)
        .with({type: 'ok'}, ({data}) => data)
        .with({type: 'failure'}, () => null)
        .exhaustive();

const toRemoteData = <S, E>(result: Value<S, E>): RemoteData.Value<S, E> =>
    match(result)
        .with({type: 'ok'}, ({data}): RemoteData.Value<S, E> => ({type: 'loaded', data}))
        .with({type: 'failure'}, ({error}): RemoteData.Value<S, E> => ({type: 'failure', error}))
        .exhaustive();

export interface Chain<S, E> {
    value: () => Value<S, E>;
    map: <NewS>(mapping: Mapping<S, NewS>) => Chain<NewS, E>;
    onSuccess: (consumer: Consumer<S>) => Chain<S, E>;
    flatMap: <NewS>(mapping: Mapping<S, Value<NewS, E>>) => Chain<NewS, E>;
    mapError: <NewE>(mapping: Mapping<E, NewE>) => Chain<S, NewE>;
    onError: (consumer: Consumer<E>) => Chain<S, E>;
    flatMapError: <NewE>(mapping: Mapping<E, Value<S, NewE>>) => Chain<S, NewE>;
    orElse: (fallback: S) => S;
    orNull: () => S | null;
    toRemoteData: () => RemoteData.Value<S, E>;
}

export const chain = <S, E>(result: Value<S, E>): Chain<S, E> => ({
    value: () => result,
    map: <NewS>(mapping: Mapping<S, NewS>) => chain(map<S, E, NewS>(result)(mapping)),
    onSuccess: (consumer: Consumer<S>) => chain(onSuccess(result)(consumer)),
    flatMap: <NewS>(mapping: Mapping<S, Value<NewS, E>>) => chain(flatMap<S, E, NewS>(result)(mapping)),
    mapError: <NewE>(mapping: Mapping<E, NewE>) => chain(mapError<S, E, NewE>(result)(mapping)),
    onError: (consumer: Consumer<E>) => chain(onError(result)(consumer)),
    flatMapError: <NewE>(mapping: Mapping<E, Value<S, NewE>>) => chain(flatMapError<S, E, NewE>(result)(mapping)),
    orElse: (fallback) => orElse(result)(fallback),
    orNull: () => orNull(result),
    toRemoteData: () => toRemoteData(result),
});

export const ok = <S, E>(data: S): Value<S, E> => ({type: 'ok', data});
export const failure = <S, E>(error: E): Value<S, E> => ({type: 'failure', error});
