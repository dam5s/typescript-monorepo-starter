import {asyncResult, AsyncResult, result} from '..';

describe('AsyncResult', () => {

    let ok: AsyncResult<number>;
    let rejected: AsyncResult<string>;

    beforeEach(() => {
        ok = asyncResult.ofPromise(Promise.resolve(10));
        // eslint-disable-next-line functional/no-promise-reject
        rejected = asyncResult.ofPromise(Promise.reject('Denied.'));
    });

    test('ok', async () => {
        const resolved = await asyncResult.ok(1).promise;
        expect(resolved).toEqual(result.ok(1));
    });

    test('err', async () => {
        const resolved = await asyncResult.err('Oops').promise;
        expect(resolved).toEqual(result.err('Oops'));
    });

    test('mapOk', async () => {
        const mappedOk = await ok.mapOk(n => n + 2).promise;
        expect(mappedOk).toEqual(result.ok(12));

        const mappedErr = await rejected.mapOk(n => n + 2).promise;
        expect(mappedErr).toEqual(result.err({reason: 'Denied.'}));
    });

    test('mapErr', async () => {
        const mappedOk = await ok.mapErr(r => `Reason: ${r.reason}`).promise;
        expect(mappedOk).toEqual(result.ok(10));

        const mappedErr = await rejected.mapErr(r => `Reason: ${r.reason}`).promise;
        expect(mappedErr).toEqual(result.err('Reason: Denied.'));
    });

    test('onComplete', async () => {
        let res = result.err<number, AsyncResult.Rejection>({reason: 'Nope'});

        const completed = await ok.onComplete(r => res = r).promise;

        expect(res).toEqual(result.ok(10));
        expect(completed).toEqual(result.ok(10));
    });

    test('flatMapOk', async () => {
        const flatMappedOk = await ok.flatMapOk(n => asyncResult.err({reason: `Failed to convert ${n}`})).promise;
        expect(flatMappedOk).toEqual(result.err({reason: 'Failed to convert 10'}));

        const flatMappedErr = await rejected.flatMapOk(() => asyncResult.ok(2)).promise;
        expect(flatMappedErr).toEqual(result.err({reason: 'Denied.'}));
    });

    test('flatMapErr', async () => {
        const flatMappedOk = await ok.flatMapErr(reason => asyncResult.err({reason: `Wrapped reason ${reason}`})).promise;
        expect(flatMappedOk).toEqual(result.ok(10));

        const flatMappedErr = await rejected.flatMapErr(() => asyncResult.ok('Nice')).promise;
        expect(flatMappedErr).toEqual(result.ok('Nice'));
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

            expect(mappedValue).toEqual(result.ok(11));
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

            expect(mappedRejected).toEqual(result.err('mapped rejection'));
            expect(callbackHappened).toEqual(false);
        });
    });
});
