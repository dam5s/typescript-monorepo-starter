import {result} from '../Result';

describe('Result', () => {

    type Message = { message: string }
    const ok = result.ok<string, Message>('Very nice.');
    const err = result.err<string, Message>({message: 'Oops'});

    test('mapOk', () => {
        const mappedOk = ok.mapOk(m => `Ok! ${m}`);

        expect(mappedOk.isOk).toEqual(true);
        expect(mappedOk.isOk && mappedOk.data).toEqual('Ok! Very nice.');

        const mappedErr = err.mapOk(m => `Ok! ${m}`);

        expect(mappedErr.isOk).toEqual(false);
        expect(mappedErr.isOk || mappedErr.reason).toEqual({message: 'Oops'});
    });

    test('mapErr', () => {
        const mappedOk = ok.mapErr(r => ({message: `Ugh... ${r.message}`}));

        expect(mappedOk.isOk).toEqual(true);
        expect(mappedOk.isOk && mappedOk.data).toEqual('Very nice.');

        const mappedErr = err.mapErr(r => ({message: `Ugh... ${r.message}`}));

        expect(mappedErr.isOk).toEqual(false);
        expect(mappedErr.isOk || mappedErr.reason).toEqual({message: 'Ugh... Oops'});
    });

    test('onOk', () => {
        const okCallback = jest.fn();
        ok.onOk(okCallback);
        expect(okCallback).toHaveBeenCalledWith('Very nice.');

        const errCallback = jest.fn();
        err.onOk(errCallback);
        expect(errCallback).not.toHaveBeenCalled();
    });

    test('onErr', () => {
        const okCallback = jest.fn();
        ok.onErr(okCallback);
        expect(okCallback).not.toHaveBeenCalled();

        const errCallback = jest.fn();
        err.onErr(errCallback);
        expect(errCallback).toHaveBeenCalledWith({message: 'Oops'});
    });
});
