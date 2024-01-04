import * as Redux from 'redux';
import {jokeState, JokeState} from '../Joke';

export type AppState = {
    joke: JokeState
};

const appReducer: Redux.Reducer<AppState, Redux.Action> =
    Redux.combineReducers({
        joke: jokeState.reducer,
    });

const create = (): Redux.Store<AppState> =>
    Redux.createStore(appReducer);

export const stateStore = {
    create,
};
