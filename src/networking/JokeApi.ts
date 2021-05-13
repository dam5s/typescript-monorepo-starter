import ApiConfig from '../ApiConfig';
import * as Json from 'schemawax';
import * as Http from './Http';
import {JokeData} from '../stateStore/joke/State';

const jokeDecoder = Json.object({
    required: {
        value: Json.object(
            {required: {joke: Json.string}}
        )
    }
});

export const fetchRandom = (baseUrl: string = ApiConfig.baseUrl()): Http.Result<JokeData> =>
    Http.sendRequestForJson({method: 'GET', url: `${baseUrl}/jokes/random`}, jokeDecoder)
        .map((json): JokeData => ({content: json.value.joke}));
