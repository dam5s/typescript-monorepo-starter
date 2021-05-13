import {initialState, JokeData, JokeState} from './State';
import * as RemoteData from '../../prelude/RemoteData';
import * as Result from '../../prelude/Result';
import * as Http from '../../networking/Http';
import {match} from 'ts-pattern';
import {isJokeAction} from './Action';
import {Action, Reducer} from 'redux';

const startLoadingJoke = (state: JokeState): JokeState =>
    ({joke: RemoteData.startLoading(state.joke)});

const finishLoadingJoke = (state: JokeState, result: Result.Value<JokeData, Http.Error>): JokeState =>
    ({joke: Result.pipeline(result).toRemoteData()});

export const jokeReducer: Reducer<JokeState, Action> = (state = initialState, action: Action): JokeState => {
    if (!isJokeAction(action)) return state;

    return match(action)
        .with({type: 'start loading joke'}, () => startLoadingJoke(state))
        .with({type: 'finished loading joke'}, ({result}) => finishLoadingJoke(state, result))
        .exhaustive();
};
