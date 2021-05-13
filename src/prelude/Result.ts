import {match} from 'ts-pattern';
import * as RemoteData from './RemoteData';
import {Consumer, Mapping} from './FunctionTypes';

export type Value<Success, Error> =
    | { type: 'ok', data: Success }
    | { type: 'failure', error: Error }

export interface ResultPipeline<S, E> {
    value: () => Value<S, E>;
    map: <NewS>(mapping: Mapping<S, NewS>) => ResultPipeline<NewS, E>;
    mapError: <NewE>(mapping: Mapping<E, NewE>) => ResultPipeline<S, NewE>;
    flatMap: <NewS>(mapping: Mapping<S, Value<NewS, E>>) => ResultPipeline<NewS, E>;
    flatMapError: <NewE>(mapping: Mapping<E, Value<S, NewE>>) => ResultPipeline<S, NewE>;
    onSuccess: (consumer: Consumer<S>) => ResultPipeline<S, E>;
    onError: (consumer: Consumer<E>) => ResultPipeline<S, E>;
    orElse: (fallback: S) => S;
    orNull: () => S | null;
    toRemoteData: () => RemoteData.Value<S, E>;
}

export const pipeline = <S, E>(result: Value<S, E>): ResultPipeline<S, E> => ({
    value: () => result,
    map: <NewS>(mapping: Mapping<S, NewS>) => pipeline(
        match(result)
            .with({type: 'ok'}, ({data}): Value<NewS, E> => ({type: 'ok', data: mapping(data)}))
            .with({type: 'failure'}, ({error}): Value<NewS, E> => ({type: 'failure', error}))
            .exhaustive()
    ),
    mapError: <NewE>(mapping: Mapping<E, NewE>) => pipeline(
        match(result)
            .with({type: 'ok'}, ({data}): Value<S, NewE> => ({type: 'ok', data}))
            .with({type: 'failure'}, ({error}): Value<S, NewE> => ({type: 'failure', error: mapping(error)}))
            .exhaustive()
    ),
    onSuccess: (consumer: Consumer<S>) => {
        match(result).with({type: 'ok'}, ({data}) => consumer(data));
        return pipeline(result);
    },
    onError: (consumer: Consumer<E>) => {
        match(result).with({type: 'failure'}, ({error}) => consumer(error));
        return pipeline(result);
    },
    flatMap: <NewS>(mapping: Mapping<S, Value<NewS, E>>) => pipeline(
        match(result)
            .with({type: 'ok'}, ({data}): Value<NewS, E> => mapping(data))
            .with({type: 'failure'}, ({error}): Value<NewS, E> => ({type: 'failure', error}))
            .exhaustive()
    ),
    flatMapError: <NewE>(mapping: Mapping<E, Value<S, NewE>>) => pipeline(
        match(result)
            .with({type: 'ok'}, ({data}): Value<S, NewE> => ({type: 'ok', data}))
            .with({type: 'failure'}, ({error}): Value<S, NewE> => mapping(error))
            .exhaustive()
    ),
    orElse: (fallback) =>
        match(result)
            .with({type: 'ok'}, ({data}) => data)
            .with({type: 'failure'}, () => fallback)
            .exhaustive(),
    orNull: () =>
        match(result)
            .with({type: 'ok'}, ({data}) => data)
            .with({type: 'failure'}, () => null)
            .exhaustive(),
    toRemoteData: () =>
        match(result)
            .with({type: 'ok'}, ({data}): RemoteData.Value<S, E> => ({type: 'loaded', data}))
            .with({type: 'failure'}, ({error}): RemoteData.Value<S, E> => ({type: 'failure', error}))
            .exhaustive(),
});

export const ok = <S, E>(data: S): Value<S, E> => ({type: 'ok', data});
export const failure = <S, E>(error: E): Value<S, E> => ({type: 'failure', error});
