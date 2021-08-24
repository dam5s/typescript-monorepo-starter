import {Action, applyMiddleware, combineReducers, createStore, Reducer} from 'redux';
import {jokeReducer, JokeState} from './joke';
import {effects} from './effects';

export type AppState = {
    joke: JokeState
};

const appReducer: Reducer<AppState, Action> = combineReducers({
    joke: jokeReducer
});

const stateEnhancer = applyMiddleware(effects.middleware);

export const stateStore = createStore(appReducer, stateEnhancer);
