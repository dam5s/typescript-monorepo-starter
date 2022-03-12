import {ServerRoute} from '@hapi/hapi';
import {JokeFields, jokesRepo, JokesRepo} from './JokesRepo';
import * as schema from 'schemawax';
import {typedApi} from '../ApiSupport/TypedApi';

const fieldsDecoder: schema.Decoder<JokeFields> =
    schema.object({
        required: {
            joke: schema.string,
        },
    });

const getRandomRoute = (repo: JokesRepo): ServerRoute => ({
    method: 'GET',
    path: '/api/jokes/random',
    handler: () => repo.random(),
});

const addJokeRoute = (repo: JokesRepo): ServerRoute => typedApi.route<JokeFields>({
    method: 'POST',
    path: '/api/jokes',
    decoders: {
        ...typedApi.decoders,
        body: fieldsDecoder,
    },
    handler: ({body}, {h}) => {
        const newJoke = repo.add(body);
        return h.response(newJoke).code(201);
    },
});

export const jokeRoutes = {
    all: (repo: JokesRepo = jokesRepo.create()) => [
        getRandomRoute(repo),
        addJokeRoute(repo),
    ],
};
