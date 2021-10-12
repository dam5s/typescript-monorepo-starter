import React, {ReactElement, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../../stateStore';
import {render} from '../RemoteDataRenderer';
import {effects} from '../../stateStore/effects';

export const Joke = (): ReactElement => {
    const dispatch = useDispatch();
    useEffect(() => { dispatch(effects.fetchJoke); }, []);

    const jokeData = useSelector((state: AppState) => state.joke.data);

    return render(jokeData, {
        whenNotLoaded: () => <article/>,
        whenLoading: () => <article>Loading...</article>,
        whenRefreshing: (data) => <article>{data.content}</article>,
        whenLoaded: (data) => <article>{data.content}</article>,
        whenFailed: () => <article>Error while loading</article>
    });
};
