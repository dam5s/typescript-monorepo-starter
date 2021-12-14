import {ReactElement, useEffect} from 'react';
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
        whenRefreshing: (joke) => <article>{joke.content}</article>,
        whenLoaded: (joke) => <article>{joke.content}</article>,
        whenFailed: () => <article>Error while loading</article>
    });
};
