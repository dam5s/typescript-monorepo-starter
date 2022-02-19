import * as Hapi from '@hapi/hapi';
import {jokeRoute} from '../Jokes/JokeRoute';

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

    server.route(jokeRoute.create());

    return server;
};

export const appServer = {
    create,
};
