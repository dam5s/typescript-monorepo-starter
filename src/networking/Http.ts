import {Decoder} from 'schemawax';
import {asyncResult, AsyncResult} from '../prelude/AsyncResult';
import {maybe} from '../prelude/Maybe';
import {match} from 'ts-pattern';

export type HttpError =
    | { type: 'connection error' }
    | { type: 'unknown error', response: Response }
    | { type: 'api error', response: Response }
    | { type: 'server error', response: Response }
    | { type: 'deserialization error', response: Response }

export type HttpRequest =
    | { method: 'GET', url: string }

export type HttpResult<T> = AsyncResult<T, HttpError>

const connectionError: HttpError = {type: 'connection error'};
const unknownError = (response: Response): HttpError => ({type: 'unknown error', response});
const apiError = (response: Response): HttpError => ({type: 'api error', response});
const serverError = (response: Response): HttpError => ({type: 'server error', response});
const deserializationError = (response: Response): HttpError => ({type: 'deserialization error', response});

const requestInit = (request: HttpRequest): RequestInit =>
    ({method: request.method});

const sendRequest = (request: HttpRequest): HttpResult<Response> =>
    asyncResult
        .ofPromise(fetch(request.url, requestInit(request)))
        .mapErr((): HttpError => connectionError)
        .flatMapOk((response: Response) =>
            match(response.status)
                .with(200, () => asyncResult.ok<Response, HttpError>(response))
                .with(400, () => asyncResult.err<Response, HttpError>(apiError(response)))
                .with(500, () => asyncResult.err<Response, HttpError>(serverError(response)))
                .otherwise(() => asyncResult.err(unknownError(response)))
        );

const decodeJson = <T>(decoder: Decoder<T>) => (response: Response): HttpResult<T> =>
    asyncResult
        .ofPromise(response.json())
        .mapErr(() => deserializationError(response))
        .flatMapOk(object =>
            maybe.of(decoder.decode(object) || undefined)
                .map(json => asyncResult.ok<T, HttpError>(json))
                .orElse(asyncResult.err<T, HttpError>(deserializationError(response)))
        );

const sendRequestForJson = <T>(request: HttpRequest, decoder: Decoder<T>): HttpResult<T> =>
    sendRequest(request).flatMapOk(decodeJson<T>(decoder));

export const http = {
    connectionError,
    unknownError,
    apiError,
    serverError,
    deserializationError,
    sendRequest,
    sendRequestForJson,
};
