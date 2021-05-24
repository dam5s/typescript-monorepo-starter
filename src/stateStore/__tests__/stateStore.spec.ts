import {stateStore} from '../index';
import * as RemoteData from '../../prelude/RemoteData';
import {connectionError} from '../../networking/Http';
import {result} from '@ryandur/sand';

describe('State store', () => {

    const jokeState = () => stateStore.getState().joke;

    test('start loading joke', () => {
        expect(jokeState()).toEqual({joke: RemoteData.notLoaded()});

        stateStore.dispatch({reducer: 'joke', type: 'start loading joke'});

        expect(jokeState()).toEqual({joke: RemoteData.loading()});
    });

    describe('finished loading joke', () => {
        test('on success', () => {
            const joke = {content: 'This is the joke'};

            stateStore.dispatch({
                reducer: 'joke',
                type: 'finished loading joke',
                result: result.okValue(joke)
            });

            expect(jokeState()).toEqual({joke: RemoteData.loaded(joke)});
        });

        test('on failure', () => {
            stateStore.dispatch({
                reducer: 'joke',
                type: 'finished loading joke',
                result: result.errValue(connectionError)
            });

            expect(jokeState()).toEqual({joke: RemoteData.failure(connectionError)});
        });
    });
});
