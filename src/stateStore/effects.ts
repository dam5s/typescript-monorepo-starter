import {AnyAction, Dispatch, MiddlewareAPI} from 'redux';
import {AppState} from './index';
import {match} from 'ts-pattern';
import {jokeApi} from '../components/joke/JokeApi';
import {jokeState} from '../components/joke/JokeState';

type Effect =
    | { type: 'effect/fetch joke' }

const isEffect = (variable: unknown): variable is Effect =>
    (variable as Effect).type.startsWith('effect/');

const doFetchJoke = (dispatch: Dispatch) => {
    dispatch(jokeState.startLoading);
    jokeApi
        .fetchRandom()
        .onComplete(result => dispatch(jokeState.finishedLoading(result)));
};

const middleware = ({dispatch}: MiddlewareAPI<Dispatch, AppState>) => (next: Dispatch) => (action: AnyAction): void => {
    if (isEffect(action)) {
        match(action)
            .with({type: 'effect/fetch joke'}, () => doFetchJoke(dispatch))
            .exhaustive();
    }
    next(action);
};

const fetchJoke: Effect = {type: 'effect/fetch joke'};

export const effects = {
    middleware,
    fetchJoke
};
