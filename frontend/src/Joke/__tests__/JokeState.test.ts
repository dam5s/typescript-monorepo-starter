import {AppStateStore, stateStore} from '../../AppState';
import {http, remoteData} from '../../Networking';
import {result} from '../../Prelude';
import {jokeState} from '../JokeState';

describe('Joke State', () => {

    let store: AppStateStore;

    beforeEach(() => {
        store = stateStore.create();
    });

    const getJokeState = () => store.getState().joke;

    test('start loading joke', () => {
        expect(getJokeState().data).toEqual(remoteData.notLoaded());

        store.dispatch(jokeState.actions.startLoading());

        expect(getJokeState().data).toEqual(remoteData.loading());
    });

    describe('finished loading joke', () => {
        test('on success', () => {
            const joke = {content: 'This is the joke'};

            store.dispatch(
                jokeState.actions.finishLoading(result.ok(joke))
            );

            expect(getJokeState().data).toEqual(remoteData.loaded(joke));
        });

        test('on failure', () => {
            store.dispatch(
                jokeState.actions.finishLoading(result.err(http.connectionError))
            );

            expect(getJokeState().data).toEqual(remoteData.failure(http.connectionError));
        });
    });
});
