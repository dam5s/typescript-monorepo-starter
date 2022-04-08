import {jokesData} from './JokesData';
import {TasksApi} from '../Tasks';

export type JokeFields = {
    readonly joke: string
}

export type JokeRecord =
    JokeFields & { readonly id: number }

export type TaskJoke = {
    joke: JokeRecord
    task: TasksApi.Task
}

export type JokesRepo = {
    foo: () => TaskJoke
    random: () => Promise<JokeRecord>
    add: (fields: JokeFields) => Promise<JokeRecord>
    find: (id: number) => Promise<JokeRecord|undefined>
    findAll: () => Promise<JokeRecord[]>
    search: (query: string) => Promise<JokeRecord[]>
}

const create = (initialJokes: JokeRecord[] = jokesData): JokesRepo => {
    const jokes: JokeRecord[] = initialJokes.slice();

    return {
        foo: (): TaskJoke => ({
            task: {name: 'hi'},
            joke: {id: 1, joke: 'nice'},
        }),
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
