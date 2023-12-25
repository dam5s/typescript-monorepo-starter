import {Action, Reducer} from 'redux';
import {match} from 'ts-pattern';
import {remoteData, RemoteData, Result} from '../Prelude';
import {Http} from '../Networking';

/* State */

export type Joke = {
    content: string
};

export type JokeState = {
    data: RemoteData<Joke, Http.Error>
};

const initialState: JokeState = {
    data: remoteData.notLoaded(),
};

/* Actions */

type JokeAction =
    | { type: 'joke/start loading joke' }
    | { type: 'joke/finished loading joke', value: Result<Joke, Http.Error> }

const isJokeAction = (variable: unknown): variable is JokeAction =>
    (variable as JokeAction).type.startsWith('joke/');

const startLoading: JokeAction =
    {type: 'joke/start loading joke'};

const finishedLoading = (value: Result<Joke, Http.Error>): JokeAction =>
    ({type: 'joke/finished loading joke', value});

/* Reducer */

const doStartLoading = (state: JokeState): JokeState =>
    ({data: remoteData.startLoading(state.data)});

const doFinishLoading = (state: JokeState, value: Result<Joke, Http.Error>): JokeState =>
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
