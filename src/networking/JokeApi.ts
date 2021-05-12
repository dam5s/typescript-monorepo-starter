import ApiConfig from '../ApiConfig';
import * as Result from '../prelude/Result';
import {JokeData} from '../stateStore/joke/State';
import * as Http from './Http';
import * as Json from 'schemawax';

type JokeJson = { value: { joke: string } }

const jokeDecoder = Json.object({
    required: {
        value: Json.object(
            {required: {joke: Json.string}}
        )
    }
});

export const fetchRandom = (baseUrl: string = ApiConfig.baseUrl()): Promise<Result.Value<JokeData, Http.HttpError>> =>
    Http.sendRequestForJson({method: 'GET', url: `${baseUrl}/jokes/random`}, jokeDecoder)
        .then((result: Result.Value<JokeJson, Http.HttpError>) =>
            Result
                .chain(result)
                .map((json): JokeData => ({content: json.value.joke}))
                .value()
        );
