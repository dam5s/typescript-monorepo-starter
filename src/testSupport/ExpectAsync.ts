import * as AsyncResult from '../prelude/AsyncResult';
import {Consumer} from '../prelude/FunctionTypes';

interface ExpectAsync<S, E> {
    toSucceed: (done: () => void, expectations: Consumer<S>) => void
    toFail: (done: () => void, expectations: Consumer<E>) => void
}

export const expectAsync = <S, E>(result: AsyncResult.Pipeline<S, E>): ExpectAsync<S, E> => ({
    toSucceed: (done: () => void, expectations?: Consumer<S>): void => {
        result
            .onSuccess(value => expectations?.(value))
            .onError(() => fail('Expected success but got a failure'))
            .onComplete(() => done());
    },
    toFail: (done: () => void, expectations?: Consumer<E>): void => {
        result
            .onSuccess(() => fail('Expected failure but got success'))
            .onError(error => expectations?.(error))
            .onComplete(() => done());
    }
});
