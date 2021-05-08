export type RemoteData<Value, Error> =
    | { type: 'not loaded' }
    | { type: 'loading' }
    | { type: 'refreshing', data: Value }
    | { type: 'loaded', data: Value }
    | { type: 'failure', error: Error }
