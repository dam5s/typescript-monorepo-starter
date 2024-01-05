import {result} from '..';

describe('Result', () => {

    type Message = { message: string }
    const ok = result.ok<string, Message>('Very nice.');
    const err = result.err<string, Message>({message: 'Oops'});

    test('mapOk', () => {
        const mappedOk = result.mapOk(m => `Ok! ${m}`, ok);

        expect(mappedOk).toEqual(result.ok('Ok! Very nice.'));

        const mappedErr = result.mapOk(m => `Ok! ${m}`, err);

        expect(mappedErr).toEqual(result.err({message: 'Oops'}));
    });

    test('mapErr', () => {
        const mappedOk = result.mapErr(r => ({message: `Ugh... ${r.message}`}), ok);

        expect(mappedOk).toEqual(result.ok('Very nice.'));

        const mappedErr = result.mapErr(r => ({message: `Ugh... ${r.message}`}), err);

        expect(mappedErr).toEqual(result.err({message: 'Ugh... Oops'}));
    });
});
