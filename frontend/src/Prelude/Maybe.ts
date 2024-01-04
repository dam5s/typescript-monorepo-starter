import {Mapping} from './FunctionTypes';

export declare namespace Maybe {

    type Some<T> = {
        isSome: true
        value: T
    }

    type None = {
        isSome: false
    }
}

export type Maybe<T> = (Maybe.Some<T> | Maybe.None) & {
    map: <NewT>(mapping: Mapping<T, NewT>) => Maybe<NewT>
    orElse: (other: T) => T
    orNull: () => T | null
}

const some = <T>(value: T): Maybe<T> => ({
    isSome: true,
    value,
    map: <NewT>(mapping: Mapping<T, NewT>) => some(mapping(value)),
    orElse: () => value,
    orNull: () => value,
});

const none = <T>(): Maybe<T> => ({
    isSome: false,
    map: <NewT>() => none<NewT>(),
    orElse: (other: T) => other,
    orNull: () => null,
});

const of = <T>(value: T | undefined): Maybe<T> =>
    value === undefined ? none<T>() : some<T>(value);

export const maybe = {
    of,
    some,
    none,
};
