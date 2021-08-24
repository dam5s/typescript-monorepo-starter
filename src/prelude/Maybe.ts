import {Mapping} from './FunctionTypes';

export type Some<T> = {
    isSome: true
    value: T
}

export type None = {
    isSome: false
}

export type Maybe<T> = (Some<T> | None) & {
    map: <NewT>(mapping: Mapping<T, NewT>) => Maybe<NewT>
    orElse: (other: T) => T
}

const some = <T>(value: T): Maybe<T> => ({
    isSome: true,
    value,
    map: <NewT>(mapping: Mapping<T, NewT>) => some(mapping(value)),
    orElse: () => value,
});

const none = <T>(): Maybe<T> => ({
    isSome: false,
    map: <NewT>() => none<NewT>(),
    orElse: (other: T) => other,
});

const of = <T>(value: T | undefined): Maybe<T> =>
    value === undefined ? none() : some(value);

export const maybe = {
    of,
    some,
    none
};
