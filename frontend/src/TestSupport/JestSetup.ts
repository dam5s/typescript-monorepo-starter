import '../../public/env';
import 'whatwg-fetch';
import {RemoteData} from '../Prelude/RemoteData';

expect.extend({
    toBeNotLoaded: <T, E>(data: RemoteData<T, E>) => ({
        pass: data.type === 'not loaded',
        message: () => `Expected remote data to be "not loaded" got "${data.type}"`,
    }),
    toBeLoading: <T, E>(data: RemoteData<T, E>) => ({
        pass: data.type === 'loading',
        message: () => `Expected remote data to be "loading" got "${data.type}"`,
    }),
    toBeRefreshingWith: <T, E>(data: RemoteData<T, E>, value: T) => ({
        pass: data.type === 'refreshing' && data.data === value,
        message: () => {
            const expectedValue = JSON.stringify(value);
            const actualValue = JSON.stringify(data.orNull());
            return `Expected remote data to be ("refreshing", ${expectedValue}) got ("${data.type}", ${actualValue})`;
        },
    }),
    toBeLoadedWith: <T, E>(data: RemoteData<T, E>, value: T) => ({
        pass: data.type === 'loaded' && data.data === value,
        message: () => {
            const expectedValue = JSON.stringify(value);
            const actualValue = JSON.stringify(data.orNull());
            return `Expected remote data to be ("loaded", ${expectedValue}) got ("${data.type}", ${actualValue})`;
        },
    }),
    toBeFailedWith: <T, E>(data: RemoteData<T, E>, error: E) => ({
        pass: data.type === 'failure' && data.error === error,
        message: () => {
            const expectedError = JSON.stringify(error);
            const actualError = JSON.stringify(data.type === 'failure' && data.error || null);
            return `Expected remote data to be ("failure", ${expectedError}) got ("${data.type}", ${actualError})`;
        },
    }),
});

interface RemoteDataMatchers<R = unknown> {
    toBeNotLoaded(): R
    toBeLoading(): R
    toBeRefreshingWith<T>(value: T): R
    toBeLoadedWith<T>(value: T): R
    toBeFailedWith<E>(error: E): R
}

declare global {
    namespace jest {
        interface Expect extends RemoteDataMatchers {}
        interface Matchers<R> extends RemoteDataMatchers<R> {}
        interface InverseAsymmetricMatchers extends RemoteDataMatchers {}
    }
}
