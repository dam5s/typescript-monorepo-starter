import {maybe} from '../Maybe';

describe('Maybe', () => {

    const some = maybe.of(1);
    const none = maybe.of<number>(undefined);

    test('of', () => {
        expect(some.isSome).toEqual(true);
        expect(some.isSome && some.value).toEqual(1);

        expect(none.isSome).toEqual(false);
    });

    test('map', () => {
        const mappedSome = some.map(n => n + 1);

        expect(mappedSome.isSome).toEqual(true);
        expect(mappedSome.isSome && mappedSome.value).toEqual(2);

        const mappedNone = none.map(n => n + 1);

        expect(mappedNone.isSome).toEqual(false);
    });

    test('orElse', () => {
        expect(some.orElse(2)).toEqual(1);
        expect(none.orElse(2)).toEqual(2);
    });
});
