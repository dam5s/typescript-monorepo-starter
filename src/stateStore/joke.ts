import * as RemoteData from '../prelude/RemoteData';
import * as Http from '../networking/Http';
import {Result} from '@ryandur/sand';
import {Action, Reducer} from 'redux';
import {match} from 'ts-pattern';

/* State */

export type JokeData = {
    content: string
};

export type JokeState = {
    data: RemoteData.Value<JokeData, Http.Failure>
};

const initialState: JokeState = {
    data: RemoteData.notLoaded()
};

/* Actions */

export type JokeAction =
    | { reducer: 'joke', type: 'start loading joke' }
    | { reducer: 'joke', type: 'finished loading joke', result: Result.Value<JokeData, Http.Failure> }

const isJokeAction = (variable: unknown): variable is JokeAction =>
    (variable as JokeAction).reducer === 'joke';

export const startLoadingJokeAction: JokeAction = {reducer: 'joke', type: 'start loading joke'};

export const finishedLoadingJokeAction = (result: Result.Value<JokeData, Http.Failure>): JokeAction =>
    ({reducer: 'joke', type: 'finished loading joke', result});

/* Reducer */

const startLoadingJoke = (state: JokeState): JokeState =>
    ({data: RemoteData.startLoading(state.data)});

const finishLoadingJoke = (state: JokeState, value: Result.Value<JokeData, Http.Failure>): JokeState =>
    ({data: RemoteData.ofResult(value)});

export const jokeReducer: Reducer<JokeState, Action> = (state = initialState, action: Action): JokeState => {
    if (!isJokeAction(action)) return state;

    return match(action)
        .with({type: 'start loading joke'}, () => startLoadingJoke(state))
        .with({type: 'finished loading joke'}, ({result}) => finishLoadingJoke(state, result))
        .exhaustive();
};
