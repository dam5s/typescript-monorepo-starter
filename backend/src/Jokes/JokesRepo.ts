
export type Joke = {
    id: number
    joke: string
}

export type JokesRepo = {
    random: () => Joke
}

const initialJoke: Joke = {
    id: 1,
    joke: 'Only Chuck Norris shuts down websites without due process, not SOPA or PIPA.',
};

class InMemoryJokesRepo implements JokesRepo {
    private jokes: Joke[] = [initialJoke];

    random(): Joke {
        const index = Math.floor(Math.random() * this.jokes.length);
        return this.jokes[index];
    }
}

export const jokesRepo = {
    create: () => new InMemoryJokesRepo(),
};
