import {Server} from '@hapi/hapi';
import {jokesApi, JokeRecord, jokesRepo, JokesRepo} from '..';
import {appServer} from '../../App';

describe('JokesApi', () => {

    let server: Server;
    let repo: JokesRepo;

    const initialJokes: JokeRecord[] = [
        {id: 1, joke: 'Joke #1'},
    ];

    beforeEach(() => {
        repo = jokesRepo.create(initialJokes);
        server = appServer.create({
            routes: jokesApi.routes({
                addJoke: repo.add,
                findAllJokes: repo.findAll,
                findJoke: repo.find,
                randomJoke: repo.random,
                searchJokes: repo.search,
            }),
        });
    });

    test('GET /api/jokes/random', async () => {
        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes/random',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            data: {
                id: 1,
                joke: 'Joke #1',
            },
        });
    });

    test('POST /api/jokes', async () => {
        const response = await server.inject({
            method: 'POST',
            url: 'http://localhost:3001/api/jokes',
            payload: {joke: 'Another Joke'},
        });

        expect(response.statusCode).toEqual(201);
        expect(JSON.parse(response.payload)).toEqual({
            data: {
                id: 2,
                joke: 'Another Joke',
            },
        });
    });

    test('GET /api/jokes', async () => {
        await repo.add({joke: 'Joke #2'});

        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            data: [
                {id: 1, joke: 'Joke #1'},
                {id: 2, joke: 'Joke #2'},
            ],
        });
    });

    test('GET /api/jokes?search={search}', async () => {
        await repo.add({joke: 'Another Joke'});

        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes?search=nother',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            data: [
                {id: 2, joke: 'Another Joke'},
            ],
        });
    });

    test('GET /api/jokes/{id}', async () => {
        await repo.add({joke: 'Joke #2'});

        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes/2',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            data: {
                id: 2,
                joke: 'Joke #2',
            },
        });
    });
});
