import {remoteData as r} from '../RemoteData';

describe('RemoteData', () => {

    describe('startLoading', () => {
        test('without data available', () => {
            expect(r.startLoading(r.notLoaded())).toEqual(r.loading());
            expect(r.startLoading(r.loading())).toEqual(r.loading());
            expect(r.startLoading(r.failure('Oops'))).toEqual(r.loading());
        });

        test('with data available', () => {
            expect(r.startLoading(r.loaded('Hello'))).toEqual(r.refreshing('Hello'));
            expect(r.startLoading(r.refreshing('Hello'))).toEqual(r.refreshing('Hello'));
        });
    });
});
