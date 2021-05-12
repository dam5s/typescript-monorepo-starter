import {MockWebServer, mockWebServer} from './MockWebServer';
import {sendRequest, sendRequestForJson} from '../Http';
import 'whatwg-fetch';
import {Decoder, number, object, string} from 'decoders';
import * as Result from '../../prelude/Result';

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

            sendRequest({url: server.url('/foo/bar'), method: 'GET'})
                .then(Result.chain)
                .then(async result => {
                    const maybeSuccess = result.orNull();
                    expect(maybeSuccess).not.toBeNull();
                    expect(await maybeSuccess?.json()).toEqual({hello: 'world'});

                    const lastRequest = server.lastRequest();
                    expect(lastRequest).not.toBeNull();
                    expect(lastRequest?.method).toEqual('GET');
                    expect(lastRequest?.url).toEqual('/foo/bar');
                })
                .then(done);
        });

        test('on 400 status code', (done) => {
            server.stub(400, {message: 'Oops'});

            sendRequest({url: server.url('/some/path'), method: 'GET'})
                .then(Result.chain)
                .then(result => {
                    result
                        .onError((httpError) => {
                            expect(httpError.type).toEqual('api error');
                            done();
                        });
                });
        });

        test('on 500 status code', (done) => {
            server.stub(500, {message: 'Oops'});

            sendRequest({url: server.url('/some/path'), method: 'GET'})
                .then(Result.chain)
                .then(result => {
                    result.onError((httpError) => {
                        expect(httpError.type).toEqual('server error');
                        done();
                    });
                });
        });

        test('on unhandled status code', (done) => {
            const unhandledStatus = 301;

            server.stub(unhandledStatus, {message: 'You are redirected?!'});

            sendRequest({url: server.url('/some/path'), method: 'GET'})
                .then(Result.chain)
                .then(result => {
                    result.onError((httpError) => {
                        expect(httpError.type).toEqual('unknown error');
                        done();
                    });
                });
        });

        test('on connection issue', (done) => {
            server.stop();

            sendRequest({url: 'http://localhost/incorrect/server', method: 'GET'})
                .then(Result.chain)
                .then(result => {
                    result.onError((httpError) => {
                        expect(httpError.type).toEqual('connection error');
                        done();
                    });
                });
        });
    });

    describe('sendRequestForJson', () => {

        interface JsonType {
            id: number,
            name: string,
        }

        const jsonDecoder: Decoder<JsonType> = object({
            id: number,
            name: string,
        });

        test('on successful parse', (done) => {
            server.stub(200, {id: 14, name: 'John Doe'});

            sendRequestForJson<JsonType>({url: server.url('/users/14'), method: 'GET'}, jsonDecoder)
                .then(Result.chain)
                .then(result => {
                    const maybeSuccess = result.orNull();
                    expect(maybeSuccess).toEqual({id: 14, name: 'John Doe'});
                    done();
                });
        });

        test('on parse error', (done) => {
            server.stub(200, {not: 'expected'});

            sendRequestForJson<JsonType>({url: server.url('/users/14'), method: 'GET'}, jsonDecoder)
                .then(Result.chain)
                .then(result => {
                    result.onError((httpError) => {
                        expect(httpError.type).toEqual('deserialization error');
                        done();
                    });
                });
        });
    });
});
