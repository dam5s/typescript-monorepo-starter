import {result} from 'prelude';
import {ValidationError} from './ValidationError';
import {ValidationResult} from './ValidationResult';
import {ValidationInput} from './ValidationInput';

export type Validator<Input extends ValidationInput, Output> =
    (value: Input) => ValidationResult<Input, Output>;

type ValidatorRecord<Input extends ValidationInput> =
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, Validator<Input, any>>

type ObjectType<Input extends ValidationInput, V extends ValidatorRecord<Input>> =
    V extends { [K in keyof infer U]: Validator<Input, (infer U)[K]> }
        ? U
        : never

const object = <Input extends ValidationInput, V extends ValidatorRecord<Input>>(struct: V): Validator<Input, ObjectType<Input, V>> =>
    (value: Input) => {
        const objectResult: Partial<ObjectType<Input, V>> = {};
        let errors: ValidationError<Input>[] = [];

        for (const key in struct) {
            const fieldValidator = struct[key];
            const fieldResult = fieldValidator(value);

            if (fieldResult.isOk) {
                objectResult[key] = fieldResult.data;
            } else {
                errors = errors.concat(fieldResult.reason);
            }
        }

        if (errors.length === 0) {
            return result.ok(objectResult as ObjectType<Input, V>);
        } else {
            return result.err(errors);
        }
    };

export const validators = {
    object,
};
