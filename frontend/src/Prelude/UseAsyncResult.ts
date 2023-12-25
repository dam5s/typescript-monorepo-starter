import {useEffect} from 'react';
import {AsyncResult} from './AsyncResult';

export const useAsyncResult = <T, E>(f: () => AsyncResult<T, E>, dependencies: unknown[] = []): void => {
    useEffect(() => {
        const res = f();
        return res.cancel;
    }, dependencies);
};
