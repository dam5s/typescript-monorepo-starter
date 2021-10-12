import {MockWebServer, mockWebServer} from '../../testSupport/MockWebServer';
import {HttpRequest, http} from '../Http';
import * as Json from 'schemawax';

describe('Http module', () => {

    let server: MockWebServer;
    let oldConsoleError: (message?: unknown, ...optionalParams: unknown[]) => void;

    beforeEach(() => {
        server = mockWebServer();
        server.start();

        oldConsoleError = console.error;
        console.error = () => 'do nothing';
    });

    afterEach(() => {
        console.error = oldConsoleError;
        server.stop();
    });

    describe('sendRequest', () => {
        test('simple GET request', async () => {
            server.stub(200, {hello: 'world'});

            const res = await http.sendRequest({url: server.url('/foo/bar'), method: 'GET'}).promise;

            expect(res.isOk).toEqual(true);
            expect(res.isOk && res.data.status).toEqual(200);

            const lastRequest = server.lastRequest();
            expect(lastRequest?.method).toEqual('GET');
            expect(lastRequest?.path).toEqual('/foo/bar');
        });

        test('on connection issue', async () => {
            server.stop();

            const res = await http.sendRequest({url: 'http://localhost/incorrect/server', method: 'GET'}).promise;

            expect(res.isOk).toEqual(false);
            expect(res.isOk || res.reason.type).toEqual('connection error');
        });
    });

    describe('expectStatusCode', () => {
        test('when expected', async () => {
            server.stub(201, {message: 'Nice'});

            const res = await http
                .sendRequest({url: server.url('/some/path'), method: 'GET'})
                .flatMapOk(http.expectStatusCode(201))
                .promise;

            expect(res.isOk).toEqual(true);
        });

        test('when unexpected', async () => {
            server.stub(400, {message: 'Oops'});

            const res = await http
                .sendRequest({url: server.url('/some/path'), method: 'GET'})
                .flatMapOk(http.expectStatusCode(201))
                .promise;

            expect(res.isOk).toEqual(false);
            expect(res.isOk || res.reason.type).toEqual('unexpected status code');
        });
    });

    describe('decodeJson', () => {

        interface JsonType {
            id: number,
            name: string,
        }

        const decoder: Json.Decoder<JsonType> = Json.object({
            required: {
                id: Json.number,
                name: Json.string,
            }
        });

        const createRequest = (server: MockWebServer): HttpRequest =>
            ({url: server.url('/users/14'), method: 'GET'});

        test('on successful parse', async () => {
            server.stub(200, {id: 14, name: 'John Doe'});
            const request = createRequest(server);

            const res = await http
                .sendRequest(request)
                .flatMapOk(http.decodeJson(decoder))
                .promise;

            expect(res.isOk).toEqual(true);
            expect(res.isOk && res.data).toEqual({id: 14, name: 'John Doe'});
        });

        test('on parse error', async () => {
            server.stub(200, {not: 'expected'});
            const request = createRequest(server);

            const res = await http
                .sendRequest(request)
                .flatMapOk(http.decodeJson(decoder))
                .promise;

            expect(res.isOk).toEqual(false);
            expect(res.isOk || res.reason.type).toEqual('deserialization error');
        });
    });
});
