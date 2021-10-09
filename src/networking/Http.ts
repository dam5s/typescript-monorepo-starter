import {Decoder} from 'schemawax';
import {asyncResult, AsyncResult} from '../prelude/AsyncResult';
import {maybe} from '../prelude/Maybe';
import {match} from 'ts-pattern';

export type HttpError =
    | { type: 'connection error' }
    | { type: 'unexpected status code', expected: number, response: Response }
    | { type: 'deserialization error', response: Response }

export type HttpRequest =
    | { method: 'GET', url: string }

export type HttpResult<T> = AsyncResult<T, HttpError>

const connectionError: HttpError =
    {type: 'connection error'};

const unexpectedStatusCode = (expected: number, response: Response): HttpError =>
    ({type: 'unexpected status code', expected, response});

const deserializationError = (response: Response): HttpError =>
    ({type: 'deserialization error', response});

const requestInit = (request: HttpRequest): RequestInit =>
    ({method: request.method});

const sendRequest = (request: HttpRequest): HttpResult<Response> =>
    asyncResult
        .ofPromise(fetch(request.url, requestInit(request)))
        .mapErr((): HttpError => connectionError);

const expectStatusCode = (expected: number) => (response: Response): HttpResult<Response> =>
    match(response.status)
        .with(expected, () => asyncResult.ok<Response, HttpError>(response))
        .otherwise(() => asyncResult.err(unexpectedStatusCode(expected, response)));

const decodeJson = <T>(decoder: Decoder<T>) => (response: Response): HttpResult<T> =>
    asyncResult
        .ofPromise(response.json())
        .mapErr(() => deserializationError(response))
        .flatMapOk(object =>
            maybe.of(decoder.decode(object) || undefined)
                .map(json => asyncResult.ok<T, HttpError>(json))
                .orElse(asyncResult.err<T, HttpError>(deserializationError(response)))
        );

export const http = {
    connectionError,
    unexpectedStatusCode,
    deserializationError,
    sendRequest,
    decodeJson,
    expectStatusCode,
};
