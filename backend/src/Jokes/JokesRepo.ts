import {jokesData} from './JokesData';

export type JokeFields = {
    readonly joke: string
}

export type JokeRecord =
    JokeFields & { readonly id: number }

export type JokesRepo = {
    readonly random: () => Promise<JokeRecord>
    readonly add: (fields: JokeFields) => Promise<JokeRecord>
    readonly find: (id: number) => Promise<JokeRecord|undefined>
    readonly findAll: () => Promise<readonly JokeRecord[]>
    readonly search: (query: string) => Promise<readonly JokeRecord[]>
}

const create = (initialJokes: readonly JokeRecord[] = jokesData): JokesRepo => {
    // eslint-disable-next-line functional/prefer-readonly-type
    const jokes: JokeRecord[] = initialJokes.slice();

    return {
        random: async () => {
            const index = Math.floor(Math.random() * jokes.length);
            return jokes[index];
        },
        add: async fields => {
            const lastJoke = jokes[jokes.length - 1];
            const newJoke = {...fields, id: lastJoke.id + 1};
            jokes.push(newJoke);
            return newJoke;
        },
        find: async (id: number) =>
            jokes.find(it => it.id === id),
        findAll: async () =>
            jokes.slice(),
        search: async (query: string) =>
            jokes.slice().filter(it => it.joke.includes(query)),
    };
};

const singleton = create();

export const jokesRepo = {
    create,
    singleton,
};
