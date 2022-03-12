import {ServerRoute} from '@hapi/hapi';
import {JokeFields, jokesRepo, JokesRepo} from './JokesRepo';
import * as schema from 'schemawax';
import {typedApi} from '../ApiSupport/TypedApi';
import {decoders} from '../ApiSupport/Decoders';

type SearchQuery =
    { search?: string }

type ShowPathParams =
    { id: number }


const fieldsDecoder: schema.Decoder<JokeFields> =
    schema.object({
        required: {joke: schema.string},
    });

const searchQueryDecoder: schema.Decoder<SearchQuery> =
    schema.object({optional: {search: schema.string}});

const showPathParamsDecoder: schema.Decoder<ShowPathParams> =
    schema.object({
        required: {id: decoders.stringToInt},
    });


const randomRoute = (repo: JokesRepo): ServerRoute =>
    ({
        method: 'GET',
        path: '/api/jokes/random',
        handler: () => ({data: repo.random()}),
    });

const addRoute = (repo: JokesRepo): ServerRoute =>
    typedApi.route<JokeFields>({
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

const listRoute = (repo: JokesRepo): ServerRoute =>
    typedApi.route<unknown, SearchQuery>({
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

const showRoute = (repo: JokesRepo): ServerRoute =>
    typedApi.route<unknown, unknown, ShowPathParams>({
        method: 'GET',
        path: '/api/jokes/{id}',
        decoders: {
            ...typedApi.decoders,
            route: showPathParamsDecoder,
        },
        handler: ({route}, {h}) => {
            const maybeJoke = repo.find(route.id);

            return maybeJoke
                ? h.response({data: maybeJoke})
                : h.response().code(204);
        },
    });


export const jokeRoutes = {
    all: (repo: JokesRepo = jokesRepo.create()) => [
        randomRoute(repo),
        addRoute(repo),
        listRoute(repo),
        showRoute(repo),
    ],
};
