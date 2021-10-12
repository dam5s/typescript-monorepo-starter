import {Action, applyMiddleware, combineReducers, createStore, Reducer, Store} from 'redux';
import {jokeState, JokeState} from '../components/joke/JokeState';
import {effects} from './effects';

export type AppState = {
    joke: JokeState
};

const appReducer: Reducer<AppState, Action> =
    combineReducers({
        joke: jokeState.reducer
    });

const stateEnhancer =
    applyMiddleware(effects.middleware);

const create = (): Store<AppState> =>
    createStore(appReducer, stateEnhancer);

export const stateStore = {
    create
};
