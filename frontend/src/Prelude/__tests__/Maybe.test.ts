import {maybe} from '..';

describe('Maybe', () => {

    const some = maybe.of(1);
    const none = maybe.of<number>(undefined);

    test('map', () => {
        const mappedSome = some.map(n => n + 1);

        expect(mappedSome.orNull()).toEqual(2);

        const mappedNone = none.map(n => n + 1);

        expect(mappedNone.isSome).toEqual(false);
    });

    test('orElse', () => {
        expect(some.orElse(2)).toEqual(some);
        expect(none.orElse(2)).toEqual(2);
    });

    test('orNull', () => {
        expect(some.orNull()).toEqual(1);
        expect(none.orNull()).toEqual(null);
    });
});
