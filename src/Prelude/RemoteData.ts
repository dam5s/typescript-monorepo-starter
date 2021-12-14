import {match} from 'ts-pattern';
import {Result} from './Result';

interface RemoteDataMapper<T, E, Output> {
    whenNotLoaded: () => Output,
    whenLoading: () => Output,
    whenRefreshing: (value: T) => Output,
    whenLoaded: (value: T) => Output,
    whenFailed: (error: E) => Output
}

interface RemoteDataFunctions<T, E> {
    mapAll: <Output>(mapper: RemoteDataMapper<T, E, Output>) => Output
}

type RemoteDataValue<T, E> =
    | { type: 'not loaded' }
    | { type: 'loading' }
    | { type: 'refreshing', data: T }
    | { type: 'loaded', data: T }
    | { type: 'failure', error: E }

export type RemoteData<T, E> =
    RemoteDataValue<T, E> & RemoteDataFunctions<T, E>

const notLoaded = <V, E>(): RemoteData<V, E> => ({
    type: 'not loaded',
    mapAll: mapper => mapper.whenNotLoaded(),
});

const loading = <V, E>(): RemoteData<V, E> => ({
    type: 'loading',
    mapAll: mapper => mapper.whenLoading(),
});

const refreshing = <V, E>(data: V): RemoteData<V, E> => ({
    type: 'refreshing',
    data,
    mapAll: mapper => mapper.whenRefreshing(data),
});

const loaded = <V, E>(data: V): RemoteData<V, E> => ({
    type: 'loaded',
    data,
    mapAll: mapper => mapper.whenLoaded(data),
});

const failure = <V, E>(error: E): RemoteData<V, E> => ({
    type: 'failure',
    error,
    mapAll: mapper => mapper.whenFailed(error),
});

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
