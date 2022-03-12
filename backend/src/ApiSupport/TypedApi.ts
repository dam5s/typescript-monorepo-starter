import {Request, ResponseObject, ResponseToolkit, ServerRoute} from '@hapi/hapi';
import * as schema from 'schemawax';
import {apiError} from './ApiError';
import Decoders = TypedApi.Decoders;

export declare namespace TypedApi {

    type Decoders<Body=unknown, Query=unknown, Path=unknown> = {
        body: schema.Decoder<Body>
        query: schema.Decoder<Query>
        path: schema.Decoder<Path>
    }

    type Params<Body, Query, Path> = {
        body: Body
        query: Query
        path: Path
    }

    type HapiObjects = {
        request: Request
        h: ResponseToolkit
    }

    type Handler<Body, Query, Path> =
        (params: Params<Body, Query, Path>, hapi: HapiObjects) => ResponseObject

    type RouteOptions<Body, Query, Path> = {
        method: 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH'
        path: string
        decoders: Decoders<Body, Query, Path>
        handler: Handler<Body, Query, Path>
    }
}

const decoders: Decoders = {
    body: schema.unknown,
    query: schema.unknown,
    path: schema.unknown,
};

const route = <Body, Query=unknown, Path=unknown>(options: TypedApi.RouteOptions<Body, Query, Path>): ServerRoute => ({
    method: options.method,
    path: options.path,
    handler: (request, h) => {
        const decoders = options.decoders;
        const bodyDecode = decoders.body.validate(request.payload);
        const queryDecode = decoders.query.validate(request.query);
        const pathDecode = decoders.path.validate(request.params);

        if (bodyDecode.type === 'ok' && queryDecode.type === 'ok' && pathDecode.type === 'ok') {
            const params = {
                body: bodyDecode.data,
                query: queryDecode.data,
                path: pathDecode.data,
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
