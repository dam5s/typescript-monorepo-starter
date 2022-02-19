import {AsyncResult} from 'prelude';
import {useEffect} from 'react';

export const useAsyncResult = <T, E>(f: () => AsyncResult<T, E>, dependencies: unknown[] = []): void => {
    useEffect(() => {
        const res = f();
        return res.cancel;
    }, dependencies);
};
