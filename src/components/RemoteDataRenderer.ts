import {ReactElement} from 'react';
import {match} from 'ts-pattern';
import {RemoteData} from '../prelude/RemoteData';

interface RemoteDataRenderer<T, E> {
    whenNotLoaded: () => ReactElement,
    whenLoading: () => ReactElement,
    whenRefreshing: (value: T) => ReactElement,
    whenLoaded: (value: T) => ReactElement,
    whenFailed: (error: E) => ReactElement
}

export const render = <T, E>(remoteData: RemoteData<T, E>,
                             renderer: RemoteDataRenderer<T, E>): ReactElement =>
    match(remoteData)
        .with({type: 'not loaded'}, renderer.whenNotLoaded)
        .with({type: 'loading'}, renderer.whenLoading)
        .with({type: 'refreshing'}, ({data}) => renderer.whenRefreshing(data))
        .with({type: 'loaded'}, ({data}) => renderer.whenLoaded(data))
        .with({type: 'failure'}, ({error}) => renderer.whenFailed(error))
        .exhaustive();
