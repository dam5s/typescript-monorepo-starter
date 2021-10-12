import React from 'react';
import {Joke} from '../Joke';
import {render, screen} from '@testing-library/react';
import {mockWebServer, MockWebServer} from '../../../testSupport/MockWebServer';
import {stateStore} from '../../../stateStore';
import {Provider} from 'react-redux';
import 'whatwg-fetch';
import {env} from '../../../Env';

describe('Joke component', () => {

    let server: MockWebServer;

    beforeEach(() => {
        server = mockWebServer();
        server.start();
    });

    afterEach(() => {
        server.stop();
    });

    test('on render', async () => {
        env.baseUrl = () => server.url('');

        server.stub(200, {value: {joke: 'hello world'}});

        render(<Provider store={stateStore.create()}><Joke/></Provider>);

        expect(screen.findByText('hello world')).toBeTruthy();
    });
});
