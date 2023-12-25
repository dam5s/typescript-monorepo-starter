import * as schema from 'schemawax';
import {http, Http} from '../Networking';
import {Joke} from './JokeState';
import {json} from '../ApiSupport';


const decoder =
    schema.object({
        required: {joke: schema.string},
    });

const jokeDecoder: schema.Decoder<Joke> =
    decoder.andThen(json => ({content: json.joke}));

const fetchRandom = (baseUrl: string): Http.Result<Joke> =>
    http
        .sendRequest({method: 'GET', url: `${baseUrl}/jokes/random`})
        .flatMapOk(http.expectStatusCode(200))
        .flatMapOk(http.decodeJson(json.dataDecoder(jokeDecoder)));

export const jokesApi = {
    fetchRandom,
};
