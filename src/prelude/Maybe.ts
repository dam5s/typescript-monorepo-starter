import {match} from 'ts-pattern';
import {Mapping} from './FunctionTypes';

type Value<T> =
    | { type: 'some', value: T }
    | { type: 'none' }

interface MaybePipeline<T> {
    map: <U>(mapping: Mapping<T, U>) => MaybePipeline<U>
    orElse: (other: () => T) => T
}

export const pipeline = <T>(value: Value<T>): MaybePipeline<T> => ({
    map: <U>(mapping: Mapping<T, U>): MaybePipeline<U> =>
        match(value)
            .with({type: 'some'}, ({value}) => pipeline<U>({type: 'some', value: mapping(value)}))
            .with({type: 'none'}, () => pipeline<U>({type: 'none'}))
            .exhaustive(),
    orElse: (other: () => T) =>
        match(value)
            .with({type: 'some'}, ({value}) => value)
            .with({type: 'none'}, () => other())
            .exhaustive()
});

export const ofNullable = <T>(nullable: T | null): MaybePipeline<T> =>
    nullable ? pipeline({type: 'some', value: nullable}) : pipeline({type: 'none'});
