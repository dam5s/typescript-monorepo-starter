import {ReactElement, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../App/StateStore';
import {jokeState} from './JokeState';
import {jokeApi} from './JokeApi';
import {appContext} from '../App/AppContext';
import {AsyncResult} from '../Prelude/AsyncResult';

const useAsync = <T, E>(f: () => AsyncResult<T, E>, dependencies: unknown[] = []): void => {
    useEffect(() => {
        const res = f();
        return res.cancel;
    }, dependencies);
};

export const Joke = (): ReactElement => {
    const dispatch = useDispatch();
    const env = appContext.use();

    useAsync(() => {
        dispatch(jokeState.startLoading);

        return jokeApi
            .fetchRandom(env.baseApiUrl)
            .onComplete(result => dispatch(jokeState.finishedLoading(result)));
    });

    const jokeData = useSelector((state: AppState) => state.joke.data);

    return jokeData.mapAll({
        whenNotLoaded: () => <article/>,
        whenLoading: () => <article>Loading...</article>,
        whenRefreshing: (joke) => <article>{joke.content}</article>,
        whenLoaded: (joke) => <article>{joke.content}</article>,
        whenFailed: () => <article>Error while loading</article>
    });
};
