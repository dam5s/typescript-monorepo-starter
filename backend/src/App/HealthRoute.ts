import {ServerRoute} from '@hapi/hapi';

const get = (): ServerRoute =>
    ({
        method: 'GET',
        path: '/api/health',
        handler: () => ({status: 'ok'}),
    });

export const healthRoute = {
    get,
};
