import {match} from 'ts-pattern';
import {Result} from './Result';

export type RemoteData<T, E> =
    | { type: 'not loaded' }
    | { type: 'loading' }
    | { type: 'refreshing', data: T }
    | { type: 'loaded', data: T }
    | { type: 'failure', error: E }

const notLoaded = <V, E>(): RemoteData<V, E> => ({type: 'not loaded'});
const loading = <V, E>(): RemoteData<V, E> => ({type: 'loading'});
const refreshing = <V, E>(data: V): RemoteData<V, E> => ({type: 'refreshing', data});
const loaded = <V, E>(data: V): RemoteData<V, E> => ({type: 'loaded', data});
const failure = <V, E>(error: E): RemoteData<V, E> => ({type: 'failure', error});

const startLoading = <V, E>(data: RemoteData<V, E>): RemoteData<V, E> =>
    match(data)
        .with({type: 'not loaded'}, () => loading<V, E>())
        .with({type: 'loading'}, () => loading<V, E>())
        .with({type: 'refreshing'}, ({data}) => refreshing<V, E>(data))
        .with({type: 'loaded'}, ({data}) => refreshing<V, E>(data))
        .with({type: 'failure'}, () => loading<V, E>())
        .exhaustive();

const ofResult = <V, E>(result: Result<V, E>): RemoteData<V, E> =>
    result.isOk ? loaded(result.data) : failure(result.reason);

export const remoteData = {
    notLoaded,
    loading,
    refreshing,
    loaded,
    failure,
    startLoading,
    ofResult
};
