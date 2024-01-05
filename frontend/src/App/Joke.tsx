import * as React from 'react';
import {appContext, stateStore} from '../AppState';
import {jokesApi, jokeState} from '../Joke';
import {useAsyncResult} from '../Prelude';
import {remoteData} from '../Networking';

export const Joke = (): React.ReactElement => {
    const dispatch = stateStore.useDispatch();
    const env = appContext.get();

    useAsyncResult(() => {
        dispatch(jokeState.actions.startLoading());

        return jokesApi
            .fetchRandom(env.baseApiUrl)
            .onComplete(result => dispatch(jokeState.actions.finishLoading(result)));
    });

    const jokeData = stateStore.useSelector(state => state.joke.data);

    return remoteData.mapAll(jokeData, {
        whenNotLoaded: () => <article/>,
        whenLoading: () => <article>Loading...</article>,
        whenRefreshing: (joke) => <article>{joke.content}</article>,
        whenLoaded: (joke) => <article>{joke.content}</article>,
        whenFailed: () => <article>Error while loading</article>,
    });
};
