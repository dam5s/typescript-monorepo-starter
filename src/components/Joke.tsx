import React, {ReactElement} from 'react';
import * as Interactions from '../stateStore/Interactions';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../stateStore';
import {match} from 'ts-pattern';

export const Joke = (): ReactElement => {
    useDispatch()(Interactions.fetchJoke);

    return <JokeContent/>;
};

const JokeContent = (): ReactElement => {
    const jokeRemoteData = useSelector((state: AppState) => state.joke.joke);

    const text = match(jokeRemoteData)
        .with({type: 'not loaded'}, () => '')
        .with({type: 'loading'}, () => 'Loading...')
        .with({type: 'refreshing'}, ({data}) => data.content)
        .with({type: 'loaded'}, ({data}) => data.content)
        .with({type: 'failure'}, () => 'Error while loading')
        .exhaustive();

    return <article>
        {text}
    </article>;
};
