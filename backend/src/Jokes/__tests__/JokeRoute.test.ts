import {appServer} from '../../App/AppServer';

describe('JokeRoute', () => {

    test('GET /api/jokes/random', async () => {
        const server = appServer.create();
        const port = server.info.port;
        const serverUrl = `http://localhost:${port}`;

        const response = await server.inject({
            url: `${serverUrl}/api/jokes/random`,
            method: 'GET',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual({
            id: 584,
            joke: 'Only Chuck Norris shuts down websites without due process, not SOPA or PIPA.',
            categories: ['nerdy'],
        });
    });
});
