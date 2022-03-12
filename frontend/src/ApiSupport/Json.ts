import * as schema from 'schemawax';

const dataDecoder = <T>(decoder: schema.Decoder<T>): schema.Decoder<T> =>
    schema
        .object({
            required: {data: decoder},
        })
        .andThen(it => it.data);

export const json = {
    dataDecoder,
};
