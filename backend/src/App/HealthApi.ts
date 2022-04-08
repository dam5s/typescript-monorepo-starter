import {ServerRoute} from '@hapi/hapi';

const getHealth = (): ServerRoute =>
    ({
        method: 'GET',
        path: '/api/health',
        handler: () => ({status: 'ok'}),
    });

export const healthApi = {
    route: getHealth,
};
