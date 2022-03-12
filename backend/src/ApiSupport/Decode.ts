import * as schema from 'schemawax';

const stringToInt: schema.Decoder<number> =
    schema.string.andThen(value => {
        const maybeInt = parseInt(value);

        if (isNaN(maybeInt)) {
            throw new Error('Failed to convert string to int');
        }

        return maybeInt;
    });

export const decode = {
    stringToInt,
};
