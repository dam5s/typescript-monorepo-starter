import {Decoder} from 'schemawax';
import {asyncResult, AsyncResult} from '../Prelude';
import {match} from 'ts-pattern';

export declare namespace Http {

    type Error =
        | { readonly type: 'connection error' }
        | { readonly type: 'unexpected status code', readonly expected: number, readonly response: Response }
        | { readonly type: 'deserialization error', readonly response: Response }

    type Request =
        | { readonly method: 'GET', readonly url: string }

    type Result<T = Response> = AsyncResult<T, Error>
}

const connectionError: Http.Error =
    {type: 'connection error'};

const unexpectedStatusCode = (expected: number, response: Response): Http.Error =>
    ({type: 'unexpected status code', expected, response});

const deserializationError = (response: Response): Http.Error =>
    ({type: 'deserialization error', response});

const requestInit = (request: Http.Request, controller: AbortController): RequestInit =>
    ({method: request.method, signal: controller.signal});

const sendRequest = (request: Http.Request): Http.Result => {
    const controller = new AbortController();

    return asyncResult
        .ofPromise(fetch(request.url, requestInit(request, controller)), {onCancel: () => controller.abort()})
        .mapErr((): Http.Error => connectionError);
};

const expectStatusCode = (expected: number) => (response: Response): Http.Result =>
    match(response.status)
        .with(expected, () => asyncResult.ok<Response, Http.Error>(response))
        .otherwise(() => asyncResult.err(unexpectedStatusCode(expected, response)));

const decodeJson = <T>(decoder: Decoder<T>) => (response: Response): Http.Result<T> =>
    asyncResult
        .ofPromise(response.json())
        .mapErr(() => deserializationError(response))
        .flatMapOk((object) => {
            const decoded = decoder.decode(object);

            return decoded == null
                ? asyncResult.err<T, Http.Error>(deserializationError(response))
                : asyncResult.ok<T, Http.Error>(decoded);
        });

export const http = {
    connectionError,
    unexpectedStatusCode,
    deserializationError,
    sendRequest,
    decodeJson,
    expectStatusCode,
};
