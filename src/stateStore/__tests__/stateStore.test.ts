import {stateStore} from '../index';
import {http} from '../../networking/Http';
import {result} from '../../prelude/Result';
import {remoteData} from '../../prelude/RemoteData';
import {jokeActions} from '../joke';

describe('State store', () => {

    const jokeState = () => stateStore.getState().joke;

    test('start loading joke', () => {
        expect(jokeState()).toEqual({data: remoteData.notLoaded()});

        stateStore.dispatch(jokeActions.startLoading);

        expect(jokeState()).toEqual({data: remoteData.loading()});
    });

    describe('finished loading joke', () => {
        test('on success', () => {
            const joke = {content: 'This is the joke'};

            stateStore.dispatch(
                jokeActions.finishedLoading(result.ok(joke))
            );

            expect(jokeState()).toEqual({data: remoteData.loaded(joke)});
        });

        test('on failure', () => {
            stateStore.dispatch(
                jokeActions.finishedLoading(result.err(http.connectionError))
            );

            expect(jokeState()).toEqual({data: remoteData.failure(http.connectionError)});
        });
    });
});
