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

const addRoute = (repo: JokesRepo): ServerRoute => typedApi.route<JokeFields>({
    method: 'POST',
    path: '/api/jokes',
    decoders: {
        ...typedApi.decoders,
        body: fieldsDecoder,
    },
    handler: ({body}, {h}) => {
        const data = repo.add(body);
        return h.response({data}).code(201);
    },
});

type SearchQuery = {
    search?: string
}

const searchQueryDecoder: schema.Decoder<SearchQuery> =
    schema.object({optional: {search: schema.string}});

const listRoute = (repo: JokesRepo): ServerRoute => typedApi.queryRoute<SearchQuery>({
    method: 'GET',
    path: '/api/jokes',
    decoders: {
        ...typedApi.decoders,
        query: searchQueryDecoder,
    },
    handler: ({query}, {h}) => {
        const data = query.search
            ? repo.search(query.search)
            : repo.findAll();
        return h.response({data});
    },
});

export const jokeRoutes = {
    all: (repo: JokesRepo = jokesRepo.create()) => [
        getRandomRoute(repo),
        addRoute(repo),
        listRoute(repo),
    ],
};
