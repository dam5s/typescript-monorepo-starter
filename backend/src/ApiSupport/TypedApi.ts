import {Request, ResponseObject, ResponseToolkit, ServerRoute} from '@hapi/hapi';
import * as schema from 'schemawax';
import {apiError} from './ApiError';
import Decoders = TypedApi.Decoders;

export declare namespace TypedApi {

    type Decoders<Body=unknown, Query=unknown, Route=unknown> = {
        body: schema.Decoder<Body>
        query: schema.Decoder<Query>
        route: schema.Decoder<Route>
    }

    type Params<Body, Query, Route> = {
        body: Body
        query: Query
        route: Route
    }

    type HapiObjects = {
        request: Request
        h: ResponseToolkit
    }

    type Handler<Body, Query, Route> =
        (params: Params<Body, Query, Route>, hapi: HapiObjects) => ResponseObject

    type RouteOptions<Body, Query, Route> = {
        method: 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH'
        path: string
        decoders: Decoders<Body, Query, Route>
        handler: Handler<Body, Query, Route>
    }
}

const decoders: Decoders = {
    body: schema.unknown,
    query: schema.unknown,
    route: schema.unknown,
};

const route = <Body, Query=unknown, Route=unknown>(options: TypedApi.RouteOptions<Body, Query, Route>): ServerRoute => ({
    method: options.method,
    path: options.path,
    handler: (request, h) => {
        const decoders = options.decoders;
        const bodyDecode = decoders.body.validate(request.payload);
        const queryDecode = decoders.query.validate(request.query);
        const routeDecode = decoders.route.validate(request.params);

        if (bodyDecode.type === 'ok' && queryDecode.type === 'ok' && routeDecode.type === 'ok') {
            const params = {
                body: bodyDecode.data,
                query: queryDecode.data,
                route: routeDecode.data,
            };
            return options.handler(params, {request, h});
        }

        const errors = [apiError.create('Failed to decode request')];

        return h.response({errors}).code(400);
    },
});

export const typedApi = {
    route,
    decoders,
};
