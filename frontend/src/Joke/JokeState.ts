import * as ReduxToolkit from '@reduxjs/toolkit';
import {HttpResultAction, RemoteData, remoteData} from '../Networking';

export type Joke = {
    readonly content: string
};

export type JokeState = {
    readonly data: RemoteData<Joke>
};

const initialState: JokeState =
    {data: remoteData.notLoaded()};

export const jokeState = ReduxToolkit.createSlice({
    name: 'joke',
    initialState,
    reducers: {
        startLoading: (state: JokeState): JokeState =>
            ({...state, data: remoteData.startLoading(state.data)}),

        finishLoading: (state: JokeState, action: HttpResultAction<Joke>): JokeState =>
            ({...state, data: remoteData.ofResult(action.payload)}),
    },
});
