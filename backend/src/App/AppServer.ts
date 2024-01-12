import * as Hapi from '@hapi/hapi';
import {match} from 'ts-pattern';

type ServerOptions = {
    readonly port: number,
    readonly routes: readonly Hapi.ServerRoute[],
};

const create = (options: ServerOptions) => {

    const server = Hapi.server({
        port: options.port,
        host: '0.0.0.0',
    });

    server.route(options.routes.slice());

    server.ext({
        type: 'onPreResponse',
        method: (request, h) => {

            match(request.response)
                .with({isBoom: true}, (boom) => {
                    console.error('There was an exception', boom);
                });

            return h.continue;
        },
    });

    return server;
};

export const appServer = {
    create,
};
