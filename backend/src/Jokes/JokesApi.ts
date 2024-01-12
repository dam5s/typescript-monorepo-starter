import * as schema from 'schemawax';
import {ServerRoute} from '@hapi/hapi';
import {JokesRepo} from './JokesRepo';
import {decoders, typedRoute} from '../ApiSupport';

type SearchQuery =
    { readonly search?: string }

type ShowPathParams =
    { readonly id: number }


const fieldsDecoder: schema.Decoder<JokesRepo.Fields> =
    schema.object({required: {content: schema.string}});

const searchQueryDecoder: schema.Decoder<SearchQuery> =
    schema.object({optional: {search: schema.string}});

const showPathParamsDecoder: schema.Decoder<ShowPathParams> =
    schema.object({required: {id: decoders.stringToInt}});


const random = (deps: Dependencies): ServerRoute =>
    typedRoute.get('/api/jokes/random', {
        decoders: typedRoute.decoders,
        handler: async (_, {h}) => h.response({data: await deps.jokes.random()}),
    });

const create = (deps: Dependencies): ServerRoute =>
    typedRoute.post<JokesRepo.Fields>('/api/jokes', {
        decoders: {...typedRoute.decoders, body: fieldsDecoder},
        handler: async ({body}, {h}) => {
            const data = await deps.jokes.create(body);
            return h.response({data}).code(201);
        },
    });

const list = (deps: Dependencies): ServerRoute =>
    typedRoute.get<SearchQuery>('/api/jokes', {
        decoders: {...typedRoute.decoders, query: searchQueryDecoder},
        handler: async ({query}, {h}) => {
            const data = query.search
                ? await deps.jokes.search(query.search)
                : await deps.jokes.findAll();
            return h.response({data});
        },
    });

const show = (deps: Dependencies): ServerRoute =>
    typedRoute.get<unknown, ShowPathParams>('/api/jokes/{id}', {
        decoders: {...typedRoute.decoders, path: showPathParamsDecoder},
        handler: async ({path}, {h}) => {
            const maybeJoke = await deps.jokes.find(path.id);

            return maybeJoke
                ? h.response({data: maybeJoke})
                : h.response().code(204);
        },
    });

type Dependencies = {
    readonly jokes: JokesRepo,
};

export const jokesApi = {
    routes: (deps: Dependencies) => [
        random(deps),
        create(deps),
        list(deps),
        show(deps),
    ],
};
