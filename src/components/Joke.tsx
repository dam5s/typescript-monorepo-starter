import React, {ReactElement} from 'react';
import * as Interactions from '../stateStore/interactions';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../stateStore';
import {render} from './RemoteDataRenderer';

export const Joke = (): ReactElement => {
    useDispatch()(Interactions.fetchJoke);

    return <JokeContent/>;
};

const JokeContent = (): ReactElement => {
    const jokeRemoteData = useSelector((state: AppState) => state.joke.data);

    return render(jokeRemoteData, {
        whenNotLoaded: () => <article/>,
        whenLoading: () => <article>Loading...</article>,
        whenRefreshing: (data) => <article>{data.content}</article>,
        whenLoaded: (data) => <article>{data.content}</article>,
        whenFailed: () => <article>Error while loading</article>
    });
};
