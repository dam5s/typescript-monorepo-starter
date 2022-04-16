import {ValidationInput} from './ValidationInput';

export type ValidationError<Input extends ValidationInput> =
    { field?: keyof Input, message: string }

const field = <Input extends ValidationInput>(field: keyof Input, message: string): ValidationError<Input> =>
    ({field, message});

const global = <Input extends ValidationInput>(message: string): ValidationError<Input> =>
    ({message});

export const validationError = {
    field,
    global,
};
