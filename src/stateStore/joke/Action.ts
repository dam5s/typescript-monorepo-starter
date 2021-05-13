import * as Result from '../../prelude/Result';
import * as Http from '../../networking/Http';
import {JokeData} from './State';

export type Value =
    | { reducer: 'joke', type: 'start loading joke' }
    | { reducer: 'joke', type: 'finished loading joke', result: Result.Value<JokeData, Http.Failure> }

export const isJokeAction = (variable: unknown): variable is Value =>
    (variable as Value).reducer === 'joke';

export const startLoading: Value = {reducer: 'joke', type: 'start loading joke'};

export const finishedLoading = (result: Result.Value<JokeData, Http.Failure>): Value =>
    ({reducer: 'joke', type: 'finished loading joke', result});
