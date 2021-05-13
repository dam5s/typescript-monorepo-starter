import * as RemoteData from '../../prelude/RemoteData';
import * as Http from '../../networking/Http';

export type JokeData = {
    content: string
};

export type JokeState = {
    joke: RemoteData.Value<JokeData, Http.Error>
};

export const initialState: JokeState = {
    joke: RemoteData.notLoaded()
};
