import {jokeReducer} from './joke/Reducer';
import {Action, combineReducers, createStore, Reducer} from 'redux';
import {JokeState} from './joke/State';

export type AppState = {
    joke: JokeState
};

const appReducer: Reducer<AppState, Action> = combineReducers({
    joke: jokeReducer
});

export const stateStore = createStore(appReducer);
