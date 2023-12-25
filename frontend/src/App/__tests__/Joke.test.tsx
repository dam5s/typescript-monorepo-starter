import {Joke} from '../Joke';
import {render, screen} from '@testing-library/react';
import {mockWebServer, MockWebServer, TestAppContext} from '../../TestSupport';

describe('Joke component', () => {

    let server: MockWebServer;

    beforeEach(() => {
        server = mockWebServer.create();
    });

    afterEach(async () => {
        await server.stop();
    });

    test('on render', async () => {
        server.stub(200, {data: {joke: 'hello world'}});

        render(<TestAppContext server={server}><Joke/></TestAppContext>);

        await screen.findByText('hello world');
    });
});
