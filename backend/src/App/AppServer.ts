import * as Hapi from '@hapi/hapi';
import {jokesApi} from '../Jokes/JokesApi';
import {healthApi} from './HealthApi';

const defaultRoutes = [
    healthApi.route(),
    jokesApi.routes(),
].flat();

const defaultOptions = {
    port: 3001,
    routes: defaultRoutes,
};

type ServerOptions = typeof defaultOptions;

const create = (options: ServerOptions) => {

    const server = Hapi.server({
        port: options.port,
        host: '0.0.0.0',
    });

    server.route(options.routes);

    return server;
};

export const appServer = {
    create: (options: Partial<ServerOptions>) => create({...defaultOptions, ...options}),
};
