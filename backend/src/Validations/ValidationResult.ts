import {result, Result} from '../Prelude';
import {ValidationError} from './ValidationError';
import {ValidationInput} from './ValidationInput';

export type ValidationResult<Input extends ValidationInput, Output> =
    Result<Output, ValidationError<Input>[]>

const ok = <Input extends ValidationInput, Output>(value: Output): ValidationResult<Input, Output> =>
    result.ok(value);

const err = <Input extends ValidationInput, Output>(...errors: ValidationError<Input>[]): ValidationResult<Input, Output> =>
    result.err(errors);

export const validationResult = {
    ok,
    err,
};
