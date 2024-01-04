import {AppState, stateStore} from '../../AppState';
import {http} from '../../Networking';
import {result} from '../../Prelude';
import {jokeState} from '../JokeState';
import {Store} from 'redux';

describe('Joke State', () => {

    let store: Store<AppState>;

    beforeEach(() => {
        store = stateStore.create();
    });

    const getJokeState = () => store.getState().joke;

    test('start loading joke', () => {
        expect(getJokeState().data).toEqual(expect.objectContaining({type: 'not loaded'}));

        store.dispatch(jokeState.startLoading);

        expect(getJokeState().data).toEqual(expect.objectContaining({type: 'loading'}));
    });

    describe('finished loading joke', () => {
        test('on success', () => {
            const joke = {content: 'This is the joke'};

            store.dispatch(
                jokeState.finishedLoading(result.ok(joke))
            );

            expect(getJokeState().data).toEqual(expect.objectContaining({type: 'loaded', data: joke}));
        });

        test('on failure', () => {
            store.dispatch(
                jokeState.finishedLoading(result.err(http.connectionError))
            );

            expect(getJokeState().data).toEqual(expect.objectContaining({type: 'failure', error: http.connectionError}));
        });
    });
});
