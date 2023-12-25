export type Mapping<A, B> = (value: A) => B;

export type Consumer<A> = (value: A) => void;
