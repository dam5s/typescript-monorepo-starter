import * as schema from 'schemawax';
import {DatabaseGateway} from '../DatabaseSupport';

export declare namespace JokesRepo {

    type Fields = {
        readonly content: string
    }

    type Record =
        Fields & { readonly id: string }
}

export type JokesRepo = {
    readonly random: () => Promise<JokesRepo.Record>
    readonly create: (fields: JokesRepo.Fields) => Promise<JokesRepo.Record>
    readonly find: (id: number) => Promise<JokesRepo.Record | null>
    readonly findAll: () => Promise<readonly JokesRepo.Record[]>
    readonly search: (query: string) => Promise<readonly JokesRepo.Record[]>
}

const jokeRecordDecoder: schema.Decoder<JokesRepo.Record> =
    schema.object({
        required: {
            id: schema.string,
            content: schema.string,
        },
    });

const create = (db: DatabaseGateway): JokesRepo => {
    return {
        random: async () =>
            db.queryOne('select * from jokes order by random() limit 1', jokeRecordDecoder),
        create: async fields =>
            db.queryOne('insert into jokes (content) values ($1) returning *', jokeRecordDecoder, [fields.content]),
        find: async (id: number) =>
            db.tryQueryOne('select * from jokes where id = $1', jokeRecordDecoder, [id]),
        findAll: async () =>
            db.queryMany('select * from jokes', jokeRecordDecoder),
        search: async (query: string) =>
            db.queryMany('select * from jokes where content ilike $1', jokeRecordDecoder, [`%${query}%`]),
    };
};

export const jokesRepo = {
    create,
};
