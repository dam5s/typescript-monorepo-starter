import {ServerRoute} from '@hapi/hapi';
import {jokesRepo, JokesRepo} from './JokesRepo';

const getRandomRoute = (repo: JokesRepo): ServerRoute => ({
    path: '/api/jokes/random',
    method: 'GET',
    handler: () => repo.random(),
});

export const jokeRoutes = {
    all: (repo: JokesRepo = jokesRepo.create()) => [
        getRandomRoute(repo),
    ],
};
