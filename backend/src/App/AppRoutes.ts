import * as Hapi from '@hapi/hapi';
import {jokesApi, jokesRepo} from '../Jokes';
import {databaseGateway} from '../DatabaseSupport';
import {healthApi} from './HealthApi';
import {env} from './Env';

const build = (): readonly Hapi.ServerRoute[] => {
    const dbUrl = env.require('DATABASE_URL');
    const db = databaseGateway.create(dbUrl);
    const jokes = jokesRepo.create(db);

    return [
        healthApi.route(),
        jokesApi.routes({jokes}),
    ].flat();
};

export const appRoutes = {
    build,
};
