import {AppState, stateStore} from '../../App/StateStore';
import {http} from '../../Networking/Http';
import {result} from '../../Prelude/Result';
import {remoteData} from '../../Prelude/RemoteData';
import {jokeState} from '../JokeState';
import {Store} from 'redux';

describe('Joke State', () => {

    let store: Store<AppState>;

    beforeEach(() => {
        store = stateStore.create();
    });

    const getJokeState = () => store.getState().joke;

    test('start loading joke', () => {
        expect(getJokeState()).toEqual({data: remoteData.notLoaded()});

        store.dispatch(jokeState.startLoading);

        expect(getJokeState()).toEqual({data: remoteData.loading()});
    });

    describe('finished loading joke', () => {
        test('on success', () => {
            const joke = {content: 'This is the joke'};

            store.dispatch(
                jokeState.finishedLoading(result.ok(joke))
            );

            expect(getJokeState()).toEqual({data: remoteData.loaded(joke)});
        });

        test('on failure', () => {
            store.dispatch(
                jokeState.finishedLoading(result.err(http.connectionError))
            );

            expect(getJokeState()).toEqual({data: remoteData.failure(http.connectionError)});
        });
    });
});
