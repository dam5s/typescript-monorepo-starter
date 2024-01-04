import {remoteData as r} from '..';
import '../../TestSupport';

describe('RemoteData', () => {

    describe('startLoading', () => {
        test('without data available', () => {
            expect(r.startLoading(r.notLoaded()))
                .toEqual(expect.objectContaining({type: 'loading'}));

            expect(r.startLoading(r.loading()))
                .toEqual(expect.objectContaining({type: 'loading'}));

            expect(r.startLoading(r.failure('Oops')))
                .toEqual(expect.objectContaining({type: 'loading'}));
        });

        test('with data available', () => {
            expect(r.startLoading(r.loaded('Hello')))
                .toEqual(expect.objectContaining({type: 'refreshing', data: 'Hello'}));

            expect(r.startLoading(r.refreshing('Hello')))
                .toEqual(expect.objectContaining({type: 'refreshing', data: 'Hello'}));
        });
    });
});
