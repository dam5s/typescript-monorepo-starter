import React, {ReactElement} from 'react';

interface Props {
    text: string
}

export const Joke = ({text}: Props): ReactElement =>
    <article>
        {text}
    </article>;
