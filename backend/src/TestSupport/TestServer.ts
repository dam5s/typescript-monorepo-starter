import * as Hapi from '@hapi/hapi';
import {Server, ServerRoute} from '@hapi/hapi';

const create = (route: ServerRoute[]): Server => {
    const server = Hapi.server({port: '3001'});
    server.route(route);
    return server;
};

export const testServer = {
    create,
};
