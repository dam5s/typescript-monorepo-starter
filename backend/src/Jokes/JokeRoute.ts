import {ServerRoute} from '@hapi/hapi';

interface JokeJson {
    id: number
    joke: string
    categories: string[]
}

const someJoke: JokeJson = {
    id: 584,
    joke: 'Only Chuck Norris shuts down websites without due process, not SOPA or PIPA.',
    categories: ['nerdy'],
};

const create = (): ServerRoute => ({
    path: '/api/jokes/random',
    method: 'GET',
    handler: () => someJoke,
});

export const jokeRoute = {
    create,
};
