export type Mapping<A, B> = (a: A) => B
export type Consumer<A> = Mapping<A, void>
