import {Request, ResponseObject, ResponseToolkit, ServerRoute} from '@hapi/hapi';
import * as schema from 'schemawax';
import {apiError} from './ApiError';
import Decoders = TypedApi.Decoders;

export declare namespace TypedApi {
    type Decoders<Body=unknown> = {
        body: schema.Decoder<Body>
    }

    type Params<Body> = {
        body: Body
    }

    type HapiObjects = {
        request: Request
        h: ResponseToolkit
    }

    type Handler<Body> =
        (params: Params<Body>, hapi: HapiObjects) => ResponseObject

    type RouteOptions<Body> = {
        method: 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH'
        path: string
        decoders: Decoders<Body>
        handler: Handler<Body>
    }
}

const decoders: Decoders = {
    body: schema.unknown,
};

const route = <Body>(options: TypedApi.RouteOptions<Body>): ServerRoute => ({
    method: options.method,
    path: options.path,
    handler: (request, h) => {
        const decoders = options.decoders;
        const bodyDecode = decoders.body.validate(request.payload);

        if (bodyDecode.type === 'ok') {
            return options.handler({body: bodyDecode.data}, {request, h});
        }

        const errors = [apiError.create('Failed to decode request')];

        return h.response({errors}).code(400);
    },
});

export const typedApi = {
    route,
    decoders,
};
