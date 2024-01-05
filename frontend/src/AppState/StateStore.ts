import * as ReduxToolkit from '@reduxjs/toolkit';
import * as ReactRedux from 'react-redux';
import {jokeState} from '../Joke';

const create = () =>
    ReduxToolkit.configureStore({
        reducer: {
            joke: jokeState.reducer,
        },
    });

export type AppStateStore = ReturnType<typeof create>
export type AppState = ReturnType<AppStateStore['getState']>
export type AppDispatch = AppStateStore['dispatch']

const useDispatch = (): AppDispatch => ReactRedux.useDispatch();
const useSelector = <T>(selector: (state: AppState) => T) => ReactRedux.useSelector<AppState, T>(selector);

export const stateStore = {
    create,
    useDispatch,
    useSelector,
};
