import {Action, Reducer} from 'redux';
import {match} from 'ts-pattern';
import {Result} from '../../prelude/Result';
import {remoteData, RemoteData} from '../../prelude/RemoteData';
import {HttpError} from '../../networking/Http';

/* State */

export type Joke = {
    content: string
};

export type JokeState = {
    data: RemoteData<Joke, HttpError>
};

const initialState: JokeState = {
    data: remoteData.notLoaded()
};

/* Actions */

export type JokeAction =
    | { type: 'joke/start loading joke' }
    | { type: 'joke/finished loading joke', value: Result<Joke, HttpError> }

const isJokeAction = (variable: unknown): variable is JokeAction =>
    (variable as JokeAction).type.startsWith('joke/');

const startLoading: JokeAction =
    {type: 'joke/start loading joke'};

const finishedLoading = (value: Result<Joke, HttpError>): JokeAction =>
    ({type: 'joke/finished loading joke', value});

/* Reducer */

const doStartLoading = (state: JokeState): JokeState =>
    ({data: remoteData.startLoading(state.data)});

const doFinishLoading = (state: JokeState, value: Result<Joke, HttpError>): JokeState =>
    ({data: remoteData.ofResult(value)});

const reducer: Reducer<JokeState, Action> = (state = initialState, action: Action): JokeState => {
    if (!isJokeAction(action)) return state;

    return match(action)
        .with({type: 'joke/start loading joke'}, () => doStartLoading(state))
        .with({type: 'joke/finished loading joke'}, ({value}) => doFinishLoading(state, value))
        .exhaustive();
};

export const jokeState = {
    startLoading,
    finishedLoading,
    reducer,
};
