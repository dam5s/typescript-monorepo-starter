import {Joke} from '../Joke';
import {render, screen} from '@testing-library/react';
import {mockWebServer, MockWebServer} from '../../TestSupport/MockWebServer';
import {TestAppContext} from '../../TestSupport/TestAppContext';

describe('Joke component', () => {

    let server: MockWebServer;

    beforeEach(() => {
        server = mockWebServer.create();
        server.start();
    });

    afterEach(() => {
        server.stop();
    });

    test('on render', async () => {
        server.stub(200, {value: {joke: 'hello world'}});

        render(<TestAppContext server={server}><Joke/></TestAppContext>);

        expect(screen.findByText('hello world')).toBeTruthy();
    });
});
