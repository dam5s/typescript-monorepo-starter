import ApiConfig from '../ApiConfig';
import * as Json from 'schemawax';
import * as Http from './Http';
import {JokeData} from '../stateStore/joke/State';
import {HttpResult} from './Http';

const jokeDecoder = Json.object({
    required: {
        value: Json.object(
            {required: {joke: Json.string}}
        )
    }
});

export const fetchRandom = (baseUrl: string = ApiConfig.baseUrl()): HttpResult<JokeData> =>
    Http.sendRequestForJson({method: 'GET', url: `${baseUrl}/jokes/random`}, jokeDecoder)
        .map((json): JokeData => ({content: json.value.joke}));
