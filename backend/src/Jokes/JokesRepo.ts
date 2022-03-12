
export type JokeFields = {
    joke: string
}

export type JokeRecord =
    JokeFields & { id: number }

export type JokesRepo = {
    random: () => JokeRecord
    add: (fields: JokeFields) => JokeRecord
}

const initialJoke: JokeRecord = {
    id: 1,
    joke: 'Only Chuck Norris shuts down websites without due process, not SOPA or PIPA.',
};

const create = (): JokesRepo => {
    const jokes: JokeRecord[] = [initialJoke];

    return {
        random: () => {
            const index = Math.floor(Math.random() * jokes.length);
            return jokes[index];
        },
        add: fields => {
            const lastJoke = jokes[jokes.length - 1];
            const newJoke = {...fields, id: lastJoke.id + 1};
            jokes.push(newJoke);
            return newJoke;
        },
    };
};

export const jokesRepo = {
    create,
};
