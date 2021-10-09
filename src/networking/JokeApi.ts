import ApiConfig from '../ApiConfig';
import * as Json from 'schemawax';
import {http, HttpResult} from './Http';
import {Joke} from '../stateStore/joke';

const jokeDecoder = Json.object({
    required: {
        value: Json.object(
            {required: {joke: Json.string}}
        )
    }
});

const fetchRandom = (baseUrl: string = ApiConfig.baseUrl()): HttpResult<Joke> =>
    http
        .sendRequest({method: 'GET', url: `${baseUrl}/jokes/random`})
        .flatMapOk(http.expectStatusCode(200))
        .flatMapOk(http.decodeJson(jokeDecoder))
        .mapOk((json): Joke => ({content: json.value.joke}));

export const jokeApi = {
    fetchRandom
};
