import * as Result from '../prelude/Result';
import {Decoder} from 'decoders';

export type HttpError =
    | { type: 'connection error' }
    | { type: 'unknown error', response: Response }
    | { type: 'api error', response: Response }
    | { type: 'server error', response: Response }
    | { type: 'deserialization error', response: Response }

type HttpRequest =
    | { method: 'GET', url: string }

export type HttpPromise = Promise<Result.Value<Response, HttpError>>
export type JsonPromise<T> = Promise<Result.Value<T, HttpError>>

export const connectionError: HttpError = {type: 'connection error'};
export const unknownError = (response: Response): HttpError => ({type: 'unknown error', response: response});
export const apiError = (response: Response): HttpError => ({type: 'api error', response: response});
export const serverError = (response: Response): HttpError => ({type: 'server error', response: response});
export const deserializationError = (response: Response): HttpError => ({
    type: 'deserialization error',
    response: response
});

const requestInit = (request: HttpRequest): RequestInit => ({method: request.method});

export const sendRequest = (request: HttpRequest): HttpPromise => {
    return fetch(request.url, requestInit(request))
        .then((response: Response): Result.Value<Response, HttpError> => {
            switch (response.status) {
                case 200:
                    return Result.ok(response);
                case 400:
                    return Result.failure(apiError(response));
                case 500:
                    return Result.failure(serverError(response));
                default:
                    return Result.failure(unknownError(response));
            }
        })
        .catch(() => Result.failure<Response, HttpError>(connectionError));
};

const decodeJson = <T>(response: Response, decoder: Decoder<T>, resolve: (result: Result.Value<T, HttpError>) => void) => {
    response.json().then(object => {
        decoder(object)
            .map((json) => resolve(Result.ok(json)))
            .mapError(() => resolve(Result.failure(deserializationError(response))));
    });
};

export const sendRequestForJson = <T>(request: HttpRequest, decoder: Decoder<T>): JsonPromise<T> => {
    return new Promise<Result.Value<T, HttpError>>((resolve) => {
        sendRequest(request).then(result => {
            Result
                .chain(result)
                .onSuccess((response) => decodeJson<T>(response, decoder, resolve))
                .onError((error) => resolve(Result.failure(error)));
        });
    });
};
