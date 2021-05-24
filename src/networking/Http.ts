import {Decoder} from 'schemawax';
import {asyncResult, maybe, Result} from '@ryandur/sand';

export type Failure =
    | { type: 'connection error' }
    | { type: 'unknown error', response: Response }
    | { type: 'api error', response: Response }
    | { type: 'server error', response: Response }
    | { type: 'deserialization error', response: Response }

type HttpRequest =
    | { method: 'GET', url: string }

export type HttpResult<T> = Result.Async.Pipeline<T, Failure>

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

export const sendRequest = (request: HttpRequest): HttpResult<Response> =>
    asyncResult
        .ofPromise(fetch(request.url, requestInit(request)))
        .mapFailure((): Failure => connectionError)
        .flatMap((response: Response) => {
            switch (response.status) {
                case 200:
                    return asyncResult.success(response);
                case 400:
                    return asyncResult.failure(apiError(response));
                case 500:
                    return asyncResult.failure(serverError(response));
                default:
                    return asyncResult.failure(unknownError(response));
            }
        });

const decodeJson = <T>(decoder: Decoder<T>) => (response: Response): HttpResult<T> =>
    asyncResult
        .ofPromise(response.json())
        .mapFailure(() => deserializationError(response))
        .flatMap(object =>
            maybe(decoder.decode(object) || undefined)
                .map(json => asyncResult.success<T, Failure>(json))
                .orElse(asyncResult.failure<T, Failure>(deserializationError(response)))
        );

export const sendRequestForJson = <T>(request: HttpRequest, decoder: Decoder<T>): HttpResult<T> =>
    sendRequest(request).flatMap(decodeJson<T>(decoder));
