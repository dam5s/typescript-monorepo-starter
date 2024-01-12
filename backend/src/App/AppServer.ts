import * as Hapi from '@hapi/hapi';

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

    return server;
};

export const appServer = {
    create,
};
