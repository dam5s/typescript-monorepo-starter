import * as ReduxToolkit from '@reduxjs/toolkit';
import * as ReactRedux from 'react-redux';
import {jokeState} from '../Joke';

const createStore = () =>
    ReduxToolkit.configureStore({
        reducer: {
            joke: jokeState.reducer,
        },
    });

export declare namespace AppState {
    type Store = ReturnType<typeof createStore>
    type Dispatch = Store['dispatch']
}

export type AppState = ReturnType<AppState.Store['getState']>

const useDispatch = (): AppState.Dispatch => ReactRedux.useDispatch();
const useSelector = <T>(selector: (state: AppState) => T) => ReactRedux.useSelector<AppState, T>(selector);

export const appState = {
    createStore,
    useDispatch,
    useSelector,
};
