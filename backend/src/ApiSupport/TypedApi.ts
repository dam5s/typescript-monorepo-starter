import {Request, ResponseObject, ResponseToolkit, ServerRoute} from '@hapi/hapi';
import * as schema from 'schemawax';
import {apiError} from './ApiError';
import Decoders = TypedApi.Decoders;

export declare namespace TypedApi {

    type Decoders<Body=unknown, Query=unknown> = {
        body: schema.Decoder<Body>
        query: schema.Decoder<Query>
    }

    type Params<Body, Query> = {
        body: Body
        query: Query
    }

    type HapiObjects = {
        request: Request
        h: ResponseToolkit
    }

    type Handler<Body, Query> =
        (params: Params<Body, Query>, hapi: HapiObjects) => ResponseObject

    type RouteOptions<Body, Query> = {
        method: 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH'
        path: string
        decoders: Decoders<Body, Query>
        handler: Handler<Body, Query>
    }
}

const decoders: Decoders = {
    body: schema.unknown,
    query: schema.unknown,
};

const route = <Body, Query=unknown>(options: TypedApi.RouteOptions<Body, Query>): ServerRoute => ({
    method: options.method,
    path: options.path,
    handler: (request, h) => {
        const decoders = options.decoders;
        const bodyDecode = decoders.body.validate(request.payload);
        const queryDecode = decoders.query.validate(request.query);

        if (bodyDecode.type === 'ok' && queryDecode.type === 'ok') {
            const params = {
                body: bodyDecode.data,
                query: queryDecode.data,
            };
            return options.handler(params, {request, h});
        }

        const errors = [apiError.create('Failed to decode request')];

        return h.response({errors}).code(400);
    },
});

const queryRoute = <Query>(options: TypedApi.RouteOptions<unknown, Query>): ServerRoute =>
    route({...options, decoders: {...decoders, ...options.decoders}});

export const typedApi = {
    route,
    decoders,
    queryRoute,
};
