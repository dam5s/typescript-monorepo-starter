import {failure, loaded, loading, notLoaded, refreshing, startLoading} from '../RemoteData';

describe('RemoteData', () => {

    describe('startLoading', () => {
        test('without data available', () => {
            expect(startLoading(notLoaded())).toEqual(loading());
            expect(startLoading(loading())).toEqual(loading());
            expect(startLoading(failure('Oops'))).toEqual(loading());
        });

        test('with data available', () => {
            expect(startLoading(loaded('Hello'))).toEqual(refreshing('Hello'));
            expect(startLoading(refreshing('Hello'))).toEqual(refreshing('Hello'));
        });
    });
});
