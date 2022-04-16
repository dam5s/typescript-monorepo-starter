import {result} from '../Result';

describe('Result', () => {

    type Message = { message: string }
    const ok = result.ok<string, Message>('Very nice.');
    const err = result.err<string, Message>({message: 'Oops'});

    test('mapOk', () => {
        const mappedOk = result.mapOk(m => `Ok! ${m}`, ok);

        expect(mappedOk.isOk).toEqual(true);
        expect(mappedOk.isOk && mappedOk.data).toEqual('Ok! Very nice.');

        const mappedErr = result.mapOk(m => `Ok! ${m}`, err);

        expect(mappedErr.isOk).toEqual(false);
        expect(mappedErr.isOk || mappedErr.reason).toEqual({message: 'Oops'});
    });

    test('mapErr', () => {
        const mappedOk = result.mapErr(r => ({message: `Ugh... ${r.message}`}), ok);

        expect(mappedOk.isOk).toEqual(true);
        expect(mappedOk.isOk && mappedOk.data).toEqual('Very nice.');

        const mappedErr = result.mapErr(r => ({message: `Ugh... ${r.message}`}), err);

        expect(mappedErr.isOk).toEqual(false);
        expect(mappedErr.isOk || mappedErr.reason).toEqual({message: 'Ugh... Oops'});
    });
});
