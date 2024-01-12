import {Server} from '@hapi/hapi';
import {jokesApi, jokesRepo, JokesRepo} from '..';
import {appServer} from '../../App';
import {TestDatabase, testDatabase} from '../../TestSupport';

describe('JokesApi', () => {

    let db: TestDatabase.Gateway;
    let server: Server;
    let repo: JokesRepo;

    beforeAll(async () => {
        db = testDatabase.gateway();
        repo = jokesRepo.create(db);
        server = appServer.create({
            port: 0,
            routes: jokesApi.routes({jokes: repo}),
        });
    });

    afterAll(async () => {
        await db.close();
    });

    beforeEach(async () => {
        await db.clear();
        await db.execute("insert into jokes (id, content) values (1001, 'Joke #1')");
    });

    test('GET /api/jokes/random', async () => {
        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes/random',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            data: {
                id: '1001',
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
        await db.execute("insert into jokes (id, content) values (1002, 'Joke #2')");

        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            data: [
                {id: '1001', content: 'Joke #1'},
                {id: '1002', content: 'Joke #2'},
            ],
        });
    });

    test('GET /api/jokes?search={search}', async () => {
        await db.execute("insert into jokes (id, content) values (1002, 'Another Joke')");

        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes?search=nother',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            data: [
                {id: '1002', content: 'Another Joke'},
            ],
        });
    });

    test('GET /api/jokes/{id}', async () => {
        await db.execute("insert into jokes (id, content) values (1002, 'Joke #2')");

        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes/1002',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            data: {
                id: '1002',
                content: 'Joke #2',
            },
        });
    });
});
