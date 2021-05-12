import React from 'react';
import {Joke} from '../Joke';
import {render, screen} from '@testing-library/react';
import {mockWebServer, MockWebServer} from '../../networking/__tests__/MockWebServer';
import {stateStore} from '../../stateStore';
import {Provider} from 'react-redux';
import 'whatwg-fetch';
import ApiConfig from '../../ApiConfig';

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
        ApiConfig.baseUrl = () => server.url('');

        server.stub(200, {value: {joke: 'hello world'}});

        render(<Provider store={stateStore}><Joke/></Provider>);

        expect(screen.findByText('hello world')).toBeTruthy();
    });
});
