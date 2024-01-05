import {Request, ResponseObject, ResponseToolkit, ServerRoute} from '@hapi/hapi';
import * as schema from 'schemawax';
import {apiError} from './ApiError';

export declare namespace TypedRoute {

    type Decoders<Body, Query, Path> = {
        readonly body: schema.Decoder<Body>
        readonly query: schema.Decoder<Query>
        readonly path: schema.Decoder<Path>
    }

    type Params<Body, Query, Path> = {
        readonly body: Body
        readonly query: Query
        readonly path: Path
    }

    type HapiObjects = {
        readonly request: Readonly<Request>
        readonly h : Readonly<ResponseToolkit>
    }

    type Handler<Body, Query, Path> =
        (params: Params<Body, Query, Path>, hapi: HapiObjects) => ResponseObject | Promise<ResponseObject>

    type Method = 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH'

    type RouteOptions<Body, Query, Path> = {
        readonly decoders: Decoders<Body, Query, Path>
        readonly handler: Handler<Body, Query, Path>
    }
}

const decoders: TypedRoute.Decoders<unknown, unknown, unknown> = {
    body: schema.unknown,
    query: schema.unknown,
    path: schema.unknown,
};

type Method = TypedRoute.Method
type RouteOptions<Body, Query, Path> = TypedRoute.RouteOptions<Body, Query, Path>

const route = <Body, Query, Path>(method: Method, path: string, options: RouteOptions<Body, Query, Path>): ServerRoute => ({
    method,
    path,
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

const routeWithoutBody = <Query, Path>(method: 'GET' | 'DELETE', path: string, options: RouteOptions<unknown, Query, Path>): ServerRoute =>
        route<unknown, Query, Path>(method, path, options);

export const typedRoute = {
    get: <Q=unknown, P=unknown>(path: string, options: RouteOptions<unknown, Q, P>) => routeWithoutBody('GET', path, options),
    delete: <Q=unknown, P=unknown>(path: string, options: RouteOptions<unknown, Q, P>) => routeWithoutBody('DELETE', path, options),
    post: <B=unknown, Q=unknown, P=unknown>(path: string, options: RouteOptions<B, Q, P>) => route('POST', path, options),
    put: <B=unknown, Q=unknown, P=unknown>(path: string, options: RouteOptions<B, Q, P>) => route('PUT', path, options),
    patch: <B=unknown, Q=unknown, P=unknown>(path: string, options: RouteOptions<B, Q, P>) => route('PATCH', path, options),
    decoders,
};
