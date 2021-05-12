import React, {ReactElement} from 'react';
import * as JokeAction from '../stateStore/joke/Action';
import * as Http from '../networking/Http';
import * as Result from '../prelude/Result';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../stateStore';
import {Dispatch} from 'redux';
import {match} from 'ts-pattern';
import {object, string} from 'decoders';
import {JokeData} from '../stateStore/joke/State';

const fetchJoke = (dispatch: Dispatch<JokeAction.Value>, baseUrl = 'https://api.icndb.com') => {
    dispatch(JokeAction.startLoading);

    const decoder = object({
        value: object({joke: string})
    });
    type JokeJson = { value: { joke: string } }

    Http.sendRequestForJson({method: 'GET', url: `${baseUrl}/jokes/random`}, decoder)
        .then((result: Result.Value<JokeJson, Http.HttpError>) => {
            const loadedResult = Result
                .chain(result)
                .map((json): JokeData => ({content: json.value.joke}))
                .value();

            dispatch(JokeAction.finishedLoading(loadedResult));
        });
};

export const Joke = (): ReactElement => {
    fetchJoke(useDispatch());

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
