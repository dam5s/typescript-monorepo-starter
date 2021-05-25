import {Action, applyMiddleware, combineReducers, createStore, Reducer} from 'redux';
import * as Interactions from './interactions';
import {jokeReducer, JokeState} from './joke';

export type AppState = {
    joke: JokeState
};

const appReducer: Reducer<AppState, Action> = combineReducers({
    joke: jokeReducer
});

const stateEnhancer = applyMiddleware(Interactions.middleware);

export const stateStore = createStore(appReducer, stateEnhancer);
