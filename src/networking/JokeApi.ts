import ApiConfig from '../ApiConfig';
import * as Json from 'schemawax';
import * as Http from './Http';
import {HttpResult} from './Http';
import {Joke} from '../stateStore/joke';

const jokeDecoder = Json.object({
    required: {
        value: Json.object(
            {required: {joke: Json.string}}
        )
    }
});

export const fetchRandom = (baseUrl: string = ApiConfig.baseUrl()): HttpResult<Joke> =>
    Http.sendRequestForJson({method: 'GET', url: `${baseUrl}/jokes/random`}, jokeDecoder)
        .map((json): Joke => ({content: json.value.joke}));
