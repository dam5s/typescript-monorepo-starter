import * as schema from 'schemawax';
import {DecoderError} from 'schemawax';

const stringToInt: schema.Decoder<number> =
    schema.string.andThen(value => {
        const maybeInt = parseInt(value);

        if (isNaN(maybeInt)) {
            // eslint-disable-next-line functional/no-throw-statements
            throw new DecoderError('Failed to convert string to int');
        }

        return maybeInt;
    });

export const decoders = {
    stringToInt,
};
