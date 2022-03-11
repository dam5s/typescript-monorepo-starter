import * as Hapi from '@hapi/hapi';
import {jokeRoutes} from '../Jokes/JokeRoutes';

interface ServerOptions {
    port?: number
}

const defaultOptions: ServerOptions =
    {};

const create = (options: ServerOptions = defaultOptions) => {

    const server = Hapi.server({
        port: options.port,
        host: '0.0.0.0',
    });

    server.route(jokeRoutes.all());

    return server;
};

export const appServer = {
    create,
};
