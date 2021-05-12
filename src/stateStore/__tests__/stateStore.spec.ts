import {stateStore} from '../index';
import * as RemoteData from '../../prelude/RemoteData';
import * as Result from '../../prelude/Result';
import {connectionError} from '../../networking/Http';

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
            const result = Result.ok(joke);
            stateStore.dispatch({reducer: 'joke', type: 'finished loading joke', result});

            expect(jokeState()).toEqual({joke: RemoteData.loaded(joke)});
        });

        test('on failure', () => {
            const result = Result.failure(connectionError);
            stateStore.dispatch({reducer: 'joke', type: 'finished loading joke', result});

            expect(jokeState()).toEqual({joke: RemoteData.failure(connectionError)});
        });
    });
});
