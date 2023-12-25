import {Decoder} from 'schemawax';
import {asyncResult, AsyncResult, maybe} from '../Prelude';
import {match} from 'ts-pattern';

export declare namespace Http {

    type Error =
        | { type: 'connection error' }
        | { type: 'unexpected status code', expected: number, response: Response }
        | { type: 'deserialization error', response: Response }

    type Request =
        | { method: 'GET', url: string }

    type Result<T = Response> = AsyncResult<T, Error>
}

const connectionError: Http.Error =
    {type: 'connection error'};

const unexpectedStatusCode = (expected: number, response: Response): Http.Error =>
    ({type: 'unexpected status code', expected, response});

const deserializationError = (response: Response): Http.Error =>
    ({type: 'deserialization error', response});

const requestInit = (request: Http.Request): RequestInit =>
    ({method: request.method});

const sendRequest = (request: Http.Request): Http.Result =>
    asyncResult
        .ofPromise(fetch(request.url, requestInit(request)))
        .mapErr((): Http.Error => connectionError);

const expectStatusCode = (expected: number) => (response: Response): Http.Result =>
    match(response.status)
        .with(expected, () => asyncResult.ok<Response, Http.Error>(response))
        .otherwise(() => asyncResult.err(unexpectedStatusCode(expected, response)));

const decodeJson = <T>(decoder: Decoder<T>) => (response: Response): Http.Result<T> =>
    asyncResult
        .ofPromise(response.json())
        .mapErr(() => deserializationError(response))
        .flatMapOk(object =>
            maybe.of(decoder.decode(object) || undefined)
                .map(json => asyncResult.ok<T, Http.Error>(json))
                .orElse(asyncResult.err<T, Http.Error>(deserializationError(response)))
        );

export const http = {
    connectionError,
    unexpectedStatusCode,
    deserializationError,
    sendRequest,
    decodeJson,
    expectStatusCode,
};
