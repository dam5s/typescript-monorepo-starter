import {ReactElement} from 'react';
import {match} from 'ts-pattern';
import * as RemoteData from '../prelude/RemoteData';

interface RemoteDataRenderer<Value, Error> {
    whenNotLoaded: () => ReactElement,
    whenLoading: () => ReactElement,
    whenRefreshing: (value: Value) => ReactElement,
    whenLoaded: (value: Value) => ReactElement,
    whenFailed: (error: Error) => ReactElement
}

export const render = <Value, Error>(remoteData: RemoteData.Value<Value, Error>,
                                     renderer: RemoteDataRenderer<Value, Error>): ReactElement =>
    match(remoteData)
        .with({type: 'not loaded'}, renderer.whenNotLoaded)
        .with({type: 'loading'}, renderer.whenLoading)
        .with({type: 'refreshing'}, ({data}) => renderer.whenRefreshing(data))
        .with({type: 'loaded'}, ({data}) => renderer.whenLoaded(data))
        .with({type: 'failure'}, ({error}) => renderer.whenFailed(error))
        .exhaustive();
