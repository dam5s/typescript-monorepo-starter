import {Server} from '@hapi/hapi';
import {jokesApi, jokesRepo, JokesRepo} from '..';
import {appServer} from '../../App';
import {TestDatabase, testDatabase} from '../../TestSupport';

describe('JokesApi', () => {

    let db: TestDatabase.Gateway;
    let server: Server;
    let repo: JokesRepo;

    beforeEach(async () => {
        db = testDatabase.gateway();
        repo = jokesRepo.create(db);
        server = appServer.create({
            port: 0,
            routes: jokesApi.routes({jokes: repo}),
        });

        await db.clear();
        await db.execute("insert into jokes (id, content) values (1, 'Joke #1')");
    });

    afterEach(async () => {
        await db.close();
    });

    test('GET /api/jokes/random', async () => {
        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes/random',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            data: {
                id: '1',
                content: 'Joke #1',
            },
        });
    });

    test('POST /api/jokes', async () => {
        const createResponse = await server.inject({
            method: 'POST',
            url: 'http://localhost:3001/api/jokes',
            payload: {content: 'Another Joke'},
        });

        expect(createResponse.statusCode).toEqual(201);

        const data = JSON.parse(createResponse.payload).data;
        expect(data.content).toEqual('Another Joke');

        const getResponse = await server.inject({
            method: 'GET',
            url: `http://localhost:3001/api/jokes/${data.id}`,
        });

        expect(getResponse.statusCode).toEqual(200);
        expect(JSON.parse(getResponse.payload).data.content).toEqual('Another Joke');
    });

    test('GET /api/jokes', async () => {
        await db.execute("insert into jokes (id, content) values (2, 'Joke #2')");

        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            data: [
                {id: '1', content: 'Joke #1'},
                {id: '2', content: 'Joke #2'},
            ],
        });
    });

    test('GET /api/jokes?search={search}', async () => {
        await db.execute("insert into jokes (id, content) values (2, 'Another Joke')");

        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes?search=nother',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            data: [
                {id: '2', content: 'Another Joke'},
            ],
        });
    });

    test('GET /api/jokes/{id}', async () => {
        await db.execute("insert into jokes (id, content) values (2, 'Joke #2')");

        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes/2',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            data: {
                id: '2',
                content: 'Joke #2',
            },
        });
    });
});
