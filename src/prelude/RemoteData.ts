import {match} from 'ts-pattern';
import {Result} from '@ryandur/sand';

export type Value<Value, Error> =
    | { type: 'not loaded' }
    | { type: 'loading' }
    | { type: 'refreshing', data: Value }
    | { type: 'loaded', data: Value }
    | { type: 'failure', error: Error }

export const notLoaded = <V, E>(): Value<V, E> => ({type: 'not loaded'});
export const loading = <V, E>(): Value<V, E> => ({type: 'loading'});
export const refreshing = <V, E>(data: V): Value<V, E> => ({type: 'refreshing', data});
export const loaded = <V, E>(data: V): Value<V, E> => ({type: 'loaded', data});
export const failure = <V, E>(error: E): Value<V, E> => ({type: 'failure', error});

export const startLoading = <V, E>(data: Value<V, E>): Value<V, E> =>
    match(data)
        .with({type: 'not loaded'}, () => loading<V, E>())
        .with({type: 'loading'}, () => loading<V, E>())
        .with({type: 'refreshing'}, ({data}) => refreshing<V, E>(data))
        .with({type: 'loaded'}, ({data}) => refreshing<V, E>(data))
        .with({type: 'failure'}, () => loading<V, E>())
        .exhaustive();

export const ofResult = <V, E>(result: Result.Value<V, E>): Value<V, E> =>
    result.isOk ? loaded(result.data) : failure(result.explanation);
