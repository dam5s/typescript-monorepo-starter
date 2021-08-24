import {AnyAction, Dispatch, MiddlewareAPI} from 'redux';
import {AppState} from './index';
import {match} from 'ts-pattern';
import {jokeActions} from './joke';
import {jokeApi} from '../networking/JokeApi';

type Effect =
    | { type: 'effect/fetch joke' }

const isEffect = (variable: unknown): variable is Effect =>
    (variable as Effect).type.startsWith('effect/');

const middleware = ({dispatch}: MiddlewareAPI<Dispatch, AppState>) => (next: Dispatch) => (action: AnyAction): void => {
    if (isEffect(action)) {
        match(action)
            .with({type: 'effect/fetch joke'}, () => {
                dispatch(jokeActions.startLoading);
                jokeApi
                    .fetchRandom()
                    .onComplete(result => dispatch(jokeActions.finishedLoading(result)));
            })
            .exhaustive();
    }
    next(action);
};

const fetchJoke: Effect = {type: 'effect/fetch joke'};

export const effects = {
    middleware,
    fetchJoke
};
