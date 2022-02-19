import {AsyncResult, asyncResult, Rejection} from '../AsyncResult';
import {result} from '../Result';

describe('AsyncResult', () => {

    let ok: AsyncResult<number, Rejection>;
    let rejected: AsyncResult<string, Rejection>;

    beforeEach(() => {
        ok = asyncResult.ofPromise(Promise.resolve(10));
        rejected = asyncResult.ofPromise(Promise.reject('Denied.'));
    });

    test('ok', async () => {
        const resolved = await asyncResult.ok(1).promise;
        expect(resolved.isOk).toEqual(true);
        expect(resolved.isOk && resolved.data).toEqual(1);
    });

    test('err', async () => {
        const resolved = await asyncResult.err('Oops').promise;
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
        const flatMappedOk = await ok.flatMapOk(n => asyncResult.err({reason: `Failed to convert ${n}`})).promise;
        expect(flatMappedOk.isOk).toEqual(false);
        expect(flatMappedOk.isOk || flatMappedOk.reason).toEqual({reason: 'Failed to convert 10'});

        const flatMappedErr = await rejected.flatMapOk(() => asyncResult.ok(2)).promise;
        expect(flatMappedErr.isOk).toEqual(false);
        expect(flatMappedErr.isOk || flatMappedErr.reason).toEqual({reason: 'Denied.'});
    });

    test('flatMapErr', async () => {
        const flatMappedOk = await ok.flatMapErr(reason => asyncResult.err({reason: `Wrapped reason ${reason}`})).promise;
        expect(flatMappedOk.isOk).toEqual(true);
        expect(flatMappedOk.isOk && flatMappedOk.data).toEqual(10);

        const flatMappedErr = await rejected.flatMapErr(() => asyncResult.ok('Nice')).promise;
        expect(flatMappedErr.isOk).toEqual(true);
        expect(flatMappedErr.isOk && flatMappedErr.data).toEqual('Nice');
    });

    describe('cancellation', () => {

        test('with mapOk', async () => {
            let callbackHappened = false;
            const mapped = ok.mapOk(value => value + 1);

            await new Promise(process.nextTick);

            ok.cancel();

            mapped.mapOk(value => {
                callbackHappened = true;
                return value;
            });

            await new Promise(process.nextTick);
            const mappedValue = await mapped.promise;

            expect(mappedValue.isOk && mappedValue.data).toEqual(11);
            expect(callbackHappened).toEqual(false);
        });

        test('with mapErr', async () => {
            let callbackHappened = false;
            const mapped = rejected.mapErr(() => 'mapped rejection');

            await new Promise(process.nextTick);

            rejected.cancel();

            rejected.mapErr(() => {
                callbackHappened = true;
                return 'mapped rejection 2';
            });

            await new Promise(process.nextTick);
            const mappedRejected = await mapped.promise;

            expect(mappedRejected.isOk || mappedRejected.reason).toEqual('mapped rejection');
            expect(callbackHappened).toEqual(false);
        });
    });
});
