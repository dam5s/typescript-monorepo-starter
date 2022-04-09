import * as schema from 'schemawax';
import {decoders, typedRoute} from '..';
import {appServer} from '../../App';

describe('TypedRoute', () => {

    const server = appServer.create({routes: [
        typedRoute.post('/tenant/{tenantId}/session', {
            decoders: {
                body: schema.object({
                    required: {
                        username: schema.string,
                        password: schema.string,
                    },
                }),
                query: schema.object({
                    required: {
                        redirect: schema.string,
                    },
                }),
                path: schema.object({
                    required: {
                        tenantId: decoders.stringToInt,
                    },
                }),
            },
            handler: ({body, query, path}, {h}) =>
                h.response({
                    username: body.username,
                    password: body.password,
                    redirect: query.redirect,
                    tenantId: path.tenantId,
                }),
        }),
    ]});

    const validBody = {username: 'bob', password: 'secret'};

    test('with valid body, query and path params', async () => {
        const response = await server.inject({
            method: 'POST',
            url: 'http://localhost:3001/tenant/210/session?redirect=example.com',
            payload: validBody,
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            username: 'bob',
            password: 'secret',
            redirect: 'example.com',
            tenantId: 210,
        });
    });

    test('with invalid body', async () => {
        const response = await server.inject({
            method: 'POST',
            url: 'http://localhost:3001/tenant/210/session?redirect=example.com',
            payload: {hello: 'world'},
        });

        expect(response.statusCode).toEqual(400);
    });

    test('with invalid query', async () => {
        const response = await server.inject({
            method: 'POST',
            url: 'http://localhost:3001/tenant/210/session',
            payload: validBody,
        });

        expect(response.statusCode).toEqual(400);
    });

    test('with invalid path', async () => {
        const response = await server.inject({
            method: 'POST',
            url: 'http://localhost:3001/tenant/ABCD/session',
            payload: validBody,
        });

        expect(response.statusCode).toEqual(400);
    });
});
