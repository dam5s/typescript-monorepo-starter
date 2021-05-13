import * as Maybe from '../prelude/Maybe';
import {Decoder} from 'schemawax';
import * as AsyncResult from '../prelude/AsyncResult';

export type Error =
    | { type: 'connection error' }
    | { type: 'unknown error', response: Response }
    | { type: 'api error', response: Response }
    | { type: 'server error', response: Response }
    | { type: 'deserialization error', response: Response }

type HttpRequest =
    | { method: 'GET', url: string }

export type Result<T> = AsyncResult.Type<T, Error>

export const connectionError: Error = {type: 'connection error'};
export const unknownError = (response: Response): Error => ({type: 'unknown error', response: response});
export const apiError = (response: Response): Error => ({type: 'api error', response: response});
export const serverError = (response: Response): Error => ({type: 'server error', response: response});
export const deserializationError = (response: Response): Error => ({
    type: 'deserialization error',
    response: response
});

const requestInit = (request: HttpRequest): RequestInit =>
    ({method: request.method});

export const sendRequest = (request: HttpRequest): Result<Response> =>
    AsyncResult
        .ofPromise(fetch(request.url, requestInit(request)))
        .mapError((): Error => connectionError)
        .flatMap((response: Response): AsyncResult.Type<Response, Error> => {
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

const decodeJson = <T>(decoder: Decoder<T>) => (response: Response): AsyncResult.Type<T, Error> =>
    AsyncResult
        .ofPromise(response.json())
        .mapError(() => deserializationError(response))
        .flatMap(object =>
            Maybe
                .ofNullable(decoder.decode(object))
                .map(json => AsyncResult.ok<T, Error>(json))
                .orElse(() => AsyncResult.failure<T, Error>(deserializationError(response)))
        );

export const sendRequestForJson = <T>(request: HttpRequest, decoder: Decoder<T>): Result<T> =>
    sendRequest(request).flatMap(decodeJson<T>(decoder));
