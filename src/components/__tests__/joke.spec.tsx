import React from 'react';
import {Joke} from '../joke';
import {render, screen} from '@testing-library/react';


describe('Joke component', () => {

    test('on render', () => {
        render(<Joke text="hello"/>);

        expect(screen.getByText('hello')).toBeTruthy();
    });
});
