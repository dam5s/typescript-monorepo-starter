import {AnyAction, Dispatch, MiddlewareAPI} from 'redux';
import * as JokeApi from '../networking/JokeApi';
import {AppState} from './index';
import {match} from 'ts-pattern';
import {finishedLoadingJokeAction, startLoadingJokeAction} from './joke';

type Interaction =
    | { interaction: true, type: 'fetch joke' }

const isInteraction = (variable: unknown): variable is Interaction =>
    (variable as Interaction).interaction;

export const middleware = ({dispatch}: MiddlewareAPI<Dispatch, AppState>) => (next: Dispatch) => (action: AnyAction): void => {
    if (isInteraction(action)) {
        match(action)
            .with({type: 'fetch joke'}, () => {
                dispatch(startLoadingJokeAction);
                JokeApi
                    .fetchRandom()
                    .onComplete(result => dispatch(finishedLoadingJokeAction(result)));
            })
            .exhaustive();
    }
    next(action);
};

export const fetchJoke = {interaction: true, type: 'fetch joke'};
