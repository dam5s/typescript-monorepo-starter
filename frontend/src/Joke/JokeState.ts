import * as ReduxToolkit from '@reduxjs/toolkit';
import {Result} from '../Prelude';
import {Http, RemoteData, remoteData} from '../Networking';

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
            ({data: remoteData.startLoading(state.data)}),

        finishLoading: (state: JokeState, action: ReduxToolkit.PayloadAction<Result<Joke, Http.Error>>): JokeState =>
            ({data: remoteData.ofResult(action.payload)}),
    },
});
