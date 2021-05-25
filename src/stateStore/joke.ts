import * as RemoteData from '../prelude/RemoteData';
import * as Http from '../networking/Http';
import {Result} from '@ryandur/sand';
import {Action, Reducer} from 'redux';
import {match} from 'ts-pattern';

/* State */

export type Joke = {
    content: string
};

export type JokeState = {
    data: RemoteData.Value<Joke, Http.Failure>
};

const initialState: JokeState = {
    data: RemoteData.notLoaded()
};

/* Actions */

export type JokeAction =
    | { reducer: 'joke', type: 'start loading joke' }
    | { reducer: 'joke', type: 'finished loading joke', value: Result.Value<Joke, Http.Failure> }

const isJokeAction = (variable: unknown): variable is JokeAction =>
    (variable as JokeAction).reducer === 'joke';

const createAction = (type: string, value?: unknown): JokeAction =>
    ({reducer: 'joke', type, value} as JokeAction);

export const startLoadingJokeAction: JokeAction =
    createAction('start loading joke');

export const finishedLoadingJokeAction = (value: Result.Value<Joke, Http.Failure>): JokeAction =>
    createAction('finished loading joke', value);

/* Reducer */

const startLoadingJoke = (state: JokeState): JokeState =>
    ({data: RemoteData.startLoading(state.data)});

const finishLoadingJoke = (state: JokeState, value: Result.Value<Joke, Http.Failure>): JokeState =>
    ({data: RemoteData.ofResult(value)});

export const jokeReducer: Reducer<JokeState, Action> = (state = initialState, action: Action): JokeState => {
    if (!isJokeAction(action)) return state;

    return match(action)
        .with({type: 'start loading joke'}, () => startLoadingJoke(state))
        .with({type: 'finished loading joke'}, ({value}) => finishLoadingJoke(state, value))
        .exhaustive();
};
