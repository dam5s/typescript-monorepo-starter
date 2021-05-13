import * as Maybe from '../prelude/Maybe';
import {Decoder} from 'schemawax';
import * as AsyncResult from '../prelude/AsyncResult';

export type Failure =
    | { type: 'connection error' }
    | { type: 'unknown error', response: Response }
    | { type: 'api error', response: Response }
    | { type: 'server error', response: Response }
    | { type: 'deserialization error', response: Response }

type HttpRequest =
    | { method: 'GET', url: string }

export type Result<T> = AsyncResult.Pipeline<T, Failure>

export const connectionError: Failure = {type: 'connection error'};
export const unknownError = (response: Response): Failure => ({type: 'unknown error', response: response});
export const apiError = (response: Response): Failure => ({type: 'api error', response: response});
export const serverError = (response: Response): Failure => ({type: 'server error', response: response});
export const deserializationError = (response: Response): Failure => ({
    type: 'deserialization error',
    response: response
});

const requestInit = (request: HttpRequest): RequestInit =>
    ({method: request.method});

export const sendRequest = (request: HttpRequest): Result<Response> =>
    AsyncResult
        .ofPromise(fetch(request.url, requestInit(request)))
        .mapError((): Failure => connectionError)
        .flatMap((response: Response): AsyncResult.Pipeline<Response, Failure> => {
            switch (response.status) {
                case 200:
                    return AsyncResult.ok(response);
                case 400:
                    return AsyncResult.failure(apiError(response));
                case 500:
                    return AsyncResult.failure(serverError(response));
                default:
                    return AsyncResult.failure(unknownError(response));
            }
        });

const decodeJson = <T>(decoder: Decoder<T>) => (response: Response): AsyncResult.Pipeline<T, Failure> =>
    AsyncResult
        .ofPromise(response.json())
        .mapError(() => deserializationError(response))
        .flatMap(object =>
            Maybe
                .ofNullable(decoder.decode(object))
                .map(json => AsyncResult.ok<T, Failure>(json))
                .orElse(() => AsyncResult.failure<T, Failure>(deserializationError(response)))
        );

export const sendRequestForJson = <T>(request: HttpRequest, decoder: Decoder<T>): Result<T> =>
    sendRequest(request).flatMap(decodeJson<T>(decoder));
