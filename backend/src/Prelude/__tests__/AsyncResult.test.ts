import {asyncResult, AsyncResult, Rejection, result} from '..';

describe('AsyncResult', () => {

    let ok: AsyncResult<number, Rejection>;
    let rejected: AsyncResult<string, Rejection>;

    beforeEach(() => {
        ok = asyncResult.ofPromise(Promise.resolve(10));
        // eslint-disable-next-line functional/no-promise-reject
        rejected = asyncResult.ofPromise(Promise.reject('Denied.'));
    });

    test('ok', async () => {
        const resolved = await asyncResult.ok(1).promise;
        expect(result.unpack(resolved)).toEqual(1);
    });

    test('err', async () => {
        const resolved = await asyncResult.err('Oops').promise;
        expect(result.unpack(resolved)).toEqual('Oops');
    });

    test('mapOk', async () => {
        const mappedOk = await ok.mapOk(n => n + 2).promise;
        expect(result.unpack(mappedOk)).toEqual(12);

        const mappedErr = await rejected.mapOk(n => n + 2).promise;
        expect(result.unpack(mappedErr)).toEqual({reason: 'Denied.'});
    });

    test('mapErr', async () => {
        const mappedOk = await ok.mapErr(r => `Reason: ${r.reason}`).promise;
        expect(result.unpack(mappedOk)).toEqual(10);

        const mappedErr = await rejected.mapErr(r => `Reason: ${r.reason}`).promise;
        expect(result.unpack(mappedErr)).toEqual('Reason: Denied.');
    });

    test('onComplete', async () => {
        let res = result.err<number, Rejection>({reason: 'Nope'});

        const completed = await ok.onComplete(r => res = r).promise;

        expect(result.unpack(res)).toEqual(10);

        expect(result.unpack(completed)).toEqual(10);
    });

    test('flatMapOk', async () => {
        const flatMappedOk = await ok.flatMapOk(n => asyncResult.err({reason: `Failed to convert ${n}`})).promise;
        expect(result.unpack(flatMappedOk)).toEqual({reason: 'Failed to convert 10'});

        const flatMappedErr = await rejected.flatMapOk(() => asyncResult.ok(2)).promise;
        expect(result.unpack(flatMappedErr)).toEqual({reason: 'Denied.'});
    });

    test('flatMapErr', async () => {
        const flatMappedOk = await ok.flatMapErr(reason => asyncResult.err({reason: `Wrapped reason ${reason}`})).promise;
        expect(result.unpack(flatMappedOk)).toEqual(10);

        const flatMappedErr = await rejected.flatMapErr(() => asyncResult.ok('Nice')).promise;
        expect(result.unpack(flatMappedErr)).toEqual('Nice');
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

            expect(result.unpack(mappedValue)).toEqual(11);
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

            expect(result.unpack(mappedRejected)).toEqual('mapped rejection');
            expect(callbackHappened).toEqual(false);
        });
    });
});
