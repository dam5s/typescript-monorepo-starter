import {jokeReducer} from './joke/Reducer';
import {Action, applyMiddleware, combineReducers, createStore, Reducer} from 'redux';
import {JokeState} from './joke/State';
import * as Interactions from './Interactions';

export type AppState = {
    joke: JokeState
};

const appReducer: Reducer<AppState, Action> = combineReducers({
    joke: jokeReducer
});

const stateEnhancer = applyMiddleware(Interactions.middleware);

export const stateStore = createStore(appReducer, stateEnhancer);
