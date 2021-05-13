import {AnyAction, Dispatch, MiddlewareAPI} from 'redux';
import * as JokeAction from './joke/Action';
import * as JokeApi from '../networking/JokeApi';
import {AppState} from './index';
import {match} from 'ts-pattern';

type Interaction =
    | { interaction: true, type: 'fetch joke' }

const isInteraction = (variable: unknown): variable is Interaction =>
    (variable as Interaction).interaction;

export const middleware = ({dispatch}: MiddlewareAPI<Dispatch, AppState>) => (next: Dispatch) => (action: AnyAction): void => {
    if (isInteraction(action)) {
        match(action)
            .with({type: 'fetch joke'}, () => {
                dispatch(JokeAction.startLoading);
                JokeApi
                    .fetchRandom()
                    .onComplete(result => dispatch(JokeAction.finishedLoading(result)));
            })
            .exhaustive();
    }
    next(action);
};

export const fetchJoke = {interaction: true, type: 'fetch joke'};
