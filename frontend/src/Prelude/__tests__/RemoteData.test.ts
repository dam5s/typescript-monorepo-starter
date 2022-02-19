import {remoteData as r} from '../RemoteData';

describe('RemoteData', () => {

    describe('startLoading', () => {
        test('without data available', () => {
            expect(r.startLoading(r.notLoaded())).toBeLoading();
            expect(r.startLoading(r.loading())).toBeLoading();
            expect(r.startLoading(r.failure('Oops'))).toBeLoading();
        });

        test('with data available', () => {
            expect(r.startLoading(r.loaded('Hello'))).toBeRefreshingWith('Hello');
            expect(r.startLoading(r.refreshing('Hello'))).toBeRefreshingWith('Hello');
        });
    });
});
