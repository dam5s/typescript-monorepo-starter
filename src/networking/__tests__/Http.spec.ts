import {MockWebServer, mockWebServer} from '../../testSupport/MockWebServer';
import {sendRequest, sendRequestForJson} from '../Http';
import 'whatwg-fetch';
import * as Json from 'schemawax';
import {expectAsync} from '../../testSupport/ExpectAsync';

describe('Http module', () => {

    let server: MockWebServer;

    beforeEach(() => {
        server = mockWebServer();
        server.start();
    });

    afterEach(() => {
        server.stop();
    });

    describe('sendRequest', () => {
        test('simple GET request, on 200', (done) => {
            server.stub(200, {hello: 'world'});

            const httpResult = sendRequest({url: server.url('/foo/bar'), method: 'GET'});

            expectAsync(httpResult).toSucceed(done, response => {
                expect(response.status).toEqual(200);

                const lastRequest = server.lastRequest();
                expect(lastRequest?.method).toEqual('GET');
                expect(lastRequest?.url).toEqual('/foo/bar');
            });
        });

        test('on 400 status code', (done) => {
            server.stub(400, {message: 'Oops'});

            const httpResult = sendRequest({url: server.url('/some/path'), method: 'GET'});

            expectAsync(httpResult).toFail(done, httpError => {
                expect(httpError.type).toEqual('api error');
            });
        });

        test('on 500 status code', (done) => {
            server.stub(500, {message: 'Oops'});

            const httpResult = sendRequest({url: server.url('/some/path'), method: 'GET'});

            expectAsync(httpResult).toFail(done, httpError => {
                expect(httpError.type).toEqual('server error');
            });
        });

        test('on unhandled status code', (done) => {
            const unhandledStatus = 301;

            server.stub(unhandledStatus, {message: 'You are redirected?!'});

            const httpResult = sendRequest({url: server.url('/some/path'), method: 'GET'});

            expectAsync(httpResult).toFail(done, httpError => {
                expect(httpError.type).toEqual('unknown error');
            });
        });

        test('on connection issue', (done) => {
            server.stop();

            const httpResult = sendRequest({url: 'http://localhost/incorrect/server', method: 'GET'});

            expectAsync(httpResult).toFail(done, httpError => {
                expect(httpError.type).toEqual('connection error');
            });
        });
    });

    describe('sendRequestForJson', () => {

        interface JsonType {
            id: number,
            name: string,
        }

        const jsonDecoder: Json.Decoder<JsonType> = Json.object({
            required: {
                id: Json.number,
                name: Json.string,
            }
        });

        test('on successful parse', (done) => {
            server.stub(200, {id: 14, name: 'John Doe'});

            const httpResult = sendRequestForJson<JsonType>({url: server.url('/users/14'), method: 'GET'}, jsonDecoder);

            expectAsync(httpResult).toSucceed(done, json => {
                expect(json).toEqual({id: 14, name: 'John Doe'});
            });
        });

        test('on parse error', (done) => {
            server.stub(200, {not: 'expected'});

            const httpResult = sendRequestForJson<JsonType>({url: server.url('/users/14'), method: 'GET'}, jsonDecoder);

            expectAsync(httpResult).toFail(done, httpError => {
                expect(httpError.type).toEqual('deserialization error');
            });
        });
    });
});
