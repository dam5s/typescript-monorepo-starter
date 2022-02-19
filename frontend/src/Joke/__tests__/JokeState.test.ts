import {AppState, stateStore} from '../../App/StateStore';
import {http} from '../../Networking/Http';
import {result} from '../../Prelude/Result';
import {jokeState} from '../JokeState';
import {Store} from 'redux';

describe('Joke State', () => {

    let store: Store<AppState>;

    beforeEach(() => {
        store = stateStore.create();
    });

    const getJokeState = () => store.getState().joke;

    test('start loading joke', () => {
        expect(getJokeState().data).toBeNotLoaded();

        store.dispatch(jokeState.startLoading);

        expect(getJokeState().data).toBeLoading();
    });

    describe('finished loading joke', () => {
        test('on success', () => {
            const joke = {content: 'This is the joke'};

            store.dispatch(
                jokeState.finishedLoading(result.ok(joke))
            );

            expect(getJokeState().data).toBeLoadedWith(joke);
        });

        test('on failure', () => {
            store.dispatch(
                jokeState.finishedLoading(result.err(http.connectionError))
            );

            expect(getJokeState().data).toBeFailedWith(http.connectionError);
        });
    });
});
