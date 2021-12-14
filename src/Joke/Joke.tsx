import {ReactElement, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../App/StateStore';
import {jokeState} from './JokeState';
import {jokeApi} from './JokeApi';
import {appContext} from '../App/AppContext';

export const Joke = (): ReactElement => {
    const dispatch = useDispatch();
    const env = appContext.use();

    useEffect(() => {
        dispatch(jokeState.startLoading);
        jokeApi
            .fetchRandom(env.baseApiUrl)
            .onComplete(result => dispatch(jokeState.finishedLoading(result)));
    }, []);

    const jokeData = useSelector((state: AppState) => state.joke.data);

    return jokeData.mapAll({
        whenNotLoaded: () => <article/>,
        whenLoading: () => <article>Loading...</article>,
        whenRefreshing: (joke) => <article>{joke.content}</article>,
        whenLoaded: (joke) => <article>{joke.content}</article>,
        whenFailed: () => <article>Error while loading</article>
    });
};
