import {match} from 'ts-pattern';

type Value<T> =
    | { type: 'some', value: T }
    | { type: 'none' }

type Mapping<A, B> = (a: A) => B

interface Chain<T> {
    map: <U>(mapping: Mapping<T, U>) => Chain<U>
    orElse: (other: () => T) => T
}

export const chain = <T>(value: Value<T>): Chain<T> => ({
    map: <U>(mapping: Mapping<T, U>): Chain<U> =>
        match(value)
            .with({type: 'some'}, ({value}) => chain<U>({type: 'some', value: mapping(value)}))
            .with({type: 'none'}, () => chain<U>({type: 'none'}))
            .exhaustive(),
    orElse: (other: () => T) =>
        match(value)
            .with({type: 'some'}, ({value}) => value)
            .with({type: 'none'}, () => other())
            .exhaustive()
});

export const ofNullable = <T>(nullable: T | null): Chain<T> =>
    nullable ? chain({type: 'some', value: nullable}) : chain({type: 'none'});
