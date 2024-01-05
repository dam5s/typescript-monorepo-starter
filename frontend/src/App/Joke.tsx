import * as React from 'react';
import * as ReactRedux from 'react-redux';
import {appContext, AppState} from '../AppState';
import {jokesApi, jokeState} from '../Joke';
import {useAsyncResult} from '../Prelude';
import {remoteData} from '../Networking';

export const Joke = (): React.ReactElement => {
    const dispatch = ReactRedux.useDispatch();
    const env = appContext.get();

    useAsyncResult(() => {
        dispatch(jokeState.startLoading);

        return jokesApi
            .fetchRandom(env.baseApiUrl)
            .onComplete(result => dispatch(jokeState.finishedLoading(result)));
    });

    const jokeData = ReactRedux.useSelector((state: AppState) => state.joke.data);

    return remoteData.mapAll(jokeData, {
        whenNotLoaded: () => <article/>,
        whenLoading: () => <article>Loading...</article>,
        whenRefreshing: (joke) => <article>{joke.content}</article>,
        whenLoaded: (joke) => <article>{joke.content}</article>,
        whenFailed: () => <article>Error while loading</article>,
    });
};
