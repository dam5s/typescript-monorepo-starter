import {ReactElement} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../App/StateStore';
import {jokeState} from './JokeState';
import {jokesApi} from './JokesApi';
import {appContext} from '../App/AppContext';
import {useAsyncResult} from '../Prelude/UseAsyncResult';

export const Joke = (): ReactElement => {
    const dispatch = useDispatch();
    const env = appContext.get();

    useAsyncResult(() => {
        dispatch(jokeState.startLoading);

        return jokesApi
            .fetchRandom(env.baseApiUrl)
            .onComplete(result => dispatch(jokeState.finishedLoading(result)));
    });

    const jokeData = useSelector((state: AppState) => state.joke.data);

    return jokeData.mapAll({
        whenNotLoaded: () => <article/>,
        whenLoading: () => <article>Loading...</article>,
        whenRefreshing: (joke) => <article>{joke.content}</article>,
        whenLoaded: (joke) => <article>{joke.content}</article>,
        whenFailed: () => <article>Error while loading</article>,
    });
};
