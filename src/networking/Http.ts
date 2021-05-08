import {failure as failureResult, ok as okResult, Result} from '../prelude/Result';
import {Decoder} from 'decoders';

export type HttpError =
    | { type: 'connection error' }
    | { type: 'unknown error', response: Response }
    | { type: 'api error', response: Response }
    | { type: 'server error', response: Response }
    | { type: 'deserialization error', response: Response }

type HttpRequest =
    | { method: 'GET', url: string }

export type HttpPromise = Promise<Result<Response, HttpError>>
export type JsonPromise<T> = Promise<Result<T, HttpError>>

const connectionError: HttpError = {type: 'connection error'};
const unknownError = (response: Response): HttpError => ({type: 'unknown error', response: response});
const apiError = (response: Response): HttpError => ({type: 'api error', response: response});
const serverError = (response: Response): HttpError => ({type: 'server error', response: response});
const deserializationError = (response: Response): HttpError => ({type: 'deserialization error', response: response});

const requestInit = (request: HttpRequest): RequestInit => ({method: request.method});

export const sendRequest = (request: HttpRequest): HttpPromise => {
    return fetch(request.url, requestInit(request))
        .then((response: Response): Result<Response, HttpError> => {
            switch (response.status) {
                case 200:
                    return okResult(response);
                case 400:
                    return failureResult(apiError(response));
                case 500:
                    return failureResult(serverError(response));
                default:
                    return failureResult(unknownError(response));
            }
        })
        .catch(() => failureResult<Response, HttpError>(connectionError));
};

const decodeJson = <T>(response: Response, decoder: Decoder<T>, resolve: (result: Result<T, HttpError>) => void) => {
    response.json().then(object => {
        decoder(object)
            .map((json) => resolve(okResult(json)))
            .mapError(() => resolve(failureResult(deserializationError(response))));
    });
};

export const sendRequestForJson = <T>(request: HttpRequest, decoder: Decoder<T>): JsonPromise<T> => {
    return new Promise<Result<T, HttpError>>((resolve) => {
        sendRequest(request).then(result => {
            result
                .onSuccess((response) => decodeJson<T>(response, decoder, resolve))
                .onError((error) => resolve(failureResult(error)));
        });
    });
};
