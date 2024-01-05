import {match} from 'ts-pattern';
import {Result} from '../Prelude';
import {Http} from './Http';

export type RemoteData<T> =
    | { readonly type: 'not loaded' }
    | { readonly type: 'loading' }
    | { readonly type: 'refreshing', readonly data: T }
    | { readonly type: 'loaded', readonly data: T }
    | { readonly type: 'failure', readonly error: Http.Error }

const notLoaded = <T>(): RemoteData<T> =>
    ({type: 'not loaded'});

const loading = <T>(): RemoteData<T> =>
    ({type: 'loading'});

const refreshing = <T>(data: T): RemoteData<T> =>
    ({type: 'refreshing', data});

const loaded = <T>(data: T): RemoteData<T> =>
    ({type: 'loaded', data});

const failure = <T>(error: Http.Error): RemoteData<T> =>
    ({type: 'failure', error});

const startLoading = <T>(data: RemoteData<T>): RemoteData<T> =>
    match(data)
        .with({type: 'not loaded'}, () => loading<T>())
        .with({type: 'loading'}, () => loading<T>())
        .with({type: 'refreshing'}, ({data}) => refreshing<T>(data))
        .with({type: 'loaded'}, ({data}) => refreshing<T>(data))
        .with({type: 'failure'}, () => loading<T>())
        .exhaustive();

const ofResult = <T>(result: Result<T, Http.Error>): RemoteData<T> =>
    result.isOk ? loaded(result.data) : failure(result.reason);

type RemoteDataMapper<T, Output> = {
    readonly whenNotLoaded: () => Output,
    readonly whenLoading: () => Output,
    readonly whenRefreshing: (data: T) => Output,
    readonly whenLoaded: (data: T) => Output,
    readonly whenFailed: (error: Http.Error) => Output
}

const mapAll = <T, Output>(data: RemoteData<T>, mapper: RemoteDataMapper<T, Output>): Output =>
    match(data)
        .with({type: 'not loaded'}, () => mapper.whenNotLoaded())
        .with({type: 'loading'}, () => mapper.whenLoading())
        .with({type: 'refreshing'}, ({data}) => mapper.whenRefreshing(data))
        .with({type: 'loaded'}, ({data}) => mapper.whenLoaded(data))
        .with({type: 'failure'}, ({error}) => mapper.whenFailed(error))
        .exhaustive();

const orNull = <T>(data: RemoteData<T>): T | null =>
    match(data)
        .with({type: 'not loaded'}, () => null)
        .with({type: 'loading'}, () => null)
        .with({type: 'refreshing'}, ({data}) => data)
        .with({type: 'loaded'}, ({data}) => data)
        .with({type: 'failure'}, () => null)
        .exhaustive();

export const remoteData = {
    notLoaded,
    loading,
    refreshing,
    loaded,
    failure,
    startLoading,
    ofResult,
    mapAll,
    orNull,
};
