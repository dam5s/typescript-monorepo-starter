import {MockWebServer, mockWebServer} from '../../testSupport/MockWebServer';
import {HttpRequest, http} from '../Http';
import 'whatwg-fetch';
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
        test('simple GET request, on 200', async () => {
            server.stub(200, {hello: 'world'});

            const res = await http.sendRequest({url: server.url('/foo/bar'), method: 'GET'}).promise;

            expect(res.isOk).toEqual(true);
            expect(res.isOk && res.data.status).toEqual(200);

            const lastRequest = server.lastRequest();
            expect(lastRequest?.method).toEqual('GET');
            expect(lastRequest?.url).toEqual('/foo/bar');
        });

        test('on 400 status code', async () => {
            server.stub(400, {message: 'Oops'});

            const res = await http.sendRequest({url: server.url('/some/path'), method: 'GET'}).promise;

            expect(res.isOk).toEqual(false);
            expect(res.isOk || res.reason.type).toEqual('api error');
        });

        test('on 500 status code', async () => {
            server.stub(500, {message: 'Oops'});

            const res = await http.sendRequest({url: server.url('/some/path'), method: 'GET'}).promise;

            expect(res.isOk).toEqual(false);
            expect(res.isOk || res.reason.type).toEqual('server error');
        });

        test('on unhandled status code', async () => {
            const unhandledStatus = 301;

            server.stub(unhandledStatus, {message: 'You are redirected?!'});

            const res = await http.sendRequest({url: server.url('/some/path'), method: 'GET'}).promise;

            expect(res.isOk).toEqual(false);
            expect(res.isOk || res.reason.type).toEqual('unknown error');
        });

        test('on connection issue', async () => {
            server.stop();

            const res = await http.sendRequest({url: 'http://localhost/incorrect/server', method: 'GET'}).promise;

            expect(res.isOk).toEqual(false);
            expect(res.isOk || res.reason.type).toEqual('connection error');
        });
    });

    describe('sendRequestForJson', () => {

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

            const res = await http.sendRequestForJson<JsonType>(request, decoder).promise;

            expect(res.isOk).toEqual(true);
            expect(res.isOk && res.data).toEqual({id: 14, name: 'John Doe'});
        });

        test('on parse error', async () => {
            server.stub(200, {not: 'expected'});
            const request = createRequest(server);

            const res = await http.sendRequestForJson<JsonType>(request, decoder).promise;

            expect(res.isOk).toEqual(false);
            expect(res.isOk || res.reason.type).toEqual('deserialization error');
        });
    });
});
