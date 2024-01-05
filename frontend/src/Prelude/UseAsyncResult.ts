import * as React from 'react';
import {AsyncResult} from './AsyncResult';

export const useAsyncResult = <T, E>(f: () => AsyncResult<T, E>, dependencies: readonly unknown[] = []): void => {
    React.useEffect(() => {
        const res = f();
        return res.cancel;
    }, dependencies);
};
