import React from 'react';
import {Joke} from '../Joke';
import {render, screen} from '@testing-library/react';

describe('Joke component', () => {

    test('on render', () => {
        render(<Joke/>);

        expect(screen.getByText('hello')).toBeTruthy();
    });
});
