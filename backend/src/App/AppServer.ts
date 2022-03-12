import * as Hapi from '@hapi/hapi';
import {jokesRoutes} from '../Jokes/JokesRoutes';

interface ServerOptions {
    port: number
}

const defaultOptions: ServerOptions =
    { port: 3000 };

const create = (options: ServerOptions = defaultOptions) => {

    const server = Hapi.server({
        port: options.port,
        host: '0.0.0.0',
    });

    server.route(jokesRoutes.all());

    return server;
};

export const appServer = {
    create,
};
