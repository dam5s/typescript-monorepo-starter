import {result} from '..';

describe('Result', () => {

    type Message = { message: string }
    const ok = result.ok<string, Message>('Very nice.');
    const err = result.err<string, Message>({message: 'Oops'});

    test('mapOk', () => {
        const mappedOk = result.mapOk(m => `Ok! ${m}`, ok);

        expect(result.unpack(mappedOk)).toEqual('Ok! Very nice.');

        const mappedErr = result.mapOk(m => `Ok! ${m}`, err);

        expect(result.unpack(mappedErr)).toEqual({message: 'Oops'});
    });

    test('mapErr', () => {
        const mappedOk = result.mapErr(r => ({message: `Ugh... ${r.message}`}), ok);

        expect(result.unpack(mappedOk)).toEqual('Very nice.');

        const mappedErr = result.mapErr(r => ({message: `Ugh... ${r.message}`}), err);

        expect(result.unpack(mappedErr)).toEqual({message: 'Ugh... Oops'});
    });
});
