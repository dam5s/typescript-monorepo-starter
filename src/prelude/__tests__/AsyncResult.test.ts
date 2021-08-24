import {asyncResult as async, Rejection} from '../AsyncResult';
import {result} from '../Result';

describe('AsyncResult', () => {

    const ok = async.ofPromise(Promise.resolve(10));
    const rejected = async.ofPromise(Promise.reject('Denied.'));

    test('ok', async () => {
        const resolved = await async.ok(1).promise;
        expect(resolved.isOk).toEqual(true);
        expect(resolved.isOk && resolved.data).toEqual(1);
    });

    test('err', async () => {
        const resolved = await async.err('Oops').promise;
        expect(resolved.isOk).toEqual(false);
        expect(resolved.isOk || resolved.reason).toEqual('Oops');
    });

    test('mapOk', async () => {
        const mappedOk = await ok.mapOk(n => n + 2).promise;
        expect(mappedOk.isOk).toEqual(true);
        expect(mappedOk.isOk && mappedOk.data).toEqual(12);

        const mappedErr = await rejected.mapOk(n => n + 2).promise;
        expect(mappedErr.isOk).toEqual(false);
        expect(mappedErr.isOk || mappedErr.reason).toEqual({reason: 'Denied.'});
    });

    test('mapErr', async () => {
        const mappedOk = await ok.mapErr(r => `Reason: ${r.reason}`).promise;
        expect(mappedOk.isOk).toEqual(true);
        expect(mappedOk.isOk && mappedOk.data).toEqual(10);

        const mappedErr = await rejected.mapErr(r => `Reason: ${r.reason}`).promise;
        expect(mappedErr.isOk).toEqual(false);
        expect(mappedErr.isOk || mappedErr.reason).toEqual('Reason: Denied.');
    });

    test('onComplete', async () => {
        let res = result.err<number, Rejection>({reason: 'Nope'});

        const completed = await ok.onComplete(r => res = r).promise;

        expect(res.isOk).toEqual(true);
        expect(res.isOk && res.data).toEqual(10);

        expect(completed.isOk).toEqual(true);
        expect(completed.isOk && completed.data).toEqual(10);
    });

    test('flatMapOk', async () => {
        const flatMappedOk = await ok.flatMapOk(n => async.err({reason: `Failed to convert ${n}`})).promise;
        expect(flatMappedOk.isOk).toEqual(false);
        expect(flatMappedOk.isOk || flatMappedOk.reason).toEqual({reason: 'Failed to convert 10'});

        const flatMappedErr = await rejected.flatMapOk(() => async.ok(2)).promise;
        expect(flatMappedErr.isOk).toEqual(false);
        expect(flatMappedErr.isOk || flatMappedErr.reason).toEqual({reason: 'Denied.'});
    });
});
