import {Consumer, Result} from '@ryandur/sand';

interface ExpectAsync<S, E> {
    toSucceed: (done: () => void, expectations: Consumer<S>) => void
    toFail: (done: () => void, expectations: Consumer<E>) => void
}

export const expectAsync = <S, E>(result: Result.Async.Pipeline<S, E>): ExpectAsync<S, E> => ({
    toSucceed: (done: () => void, expectations?: Consumer<S>): void => {
        result
            .onSuccess(value => expectations?.(value))
            .onFailure(() => fail('Expected success but got a failure'))
            .onComplete(() => done());
    },
    toFail: (done: () => void, expectations?: Consumer<E>): void => {
        result
            .onSuccess(() => fail('Expected failure but got success'))
            .onFailure(error => expectations?.(error))
            .onComplete(() => done());
    }
});
