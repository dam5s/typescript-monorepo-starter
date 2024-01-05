import {Validator, validators} from '../Validators';
import {validationError} from '../ValidationError';
import {validationResult} from '../ValidationResult';
import {result} from '../../Prelude';

describe('Validators', () => {

    describe('object', () => {
        type UserForm = {
            readonly username: string
            readonly password: string
            readonly passwordConfirmation: string
        }

        type UserFields = {
            readonly username: string
            readonly passwordHash: string
        }

        const validateUsername: Validator<UserForm, string> = (form) =>
            form.username == 'invalid'
                ? validationResult.err(validationError.field('username', 'is invalid'))
                : validationResult.ok(form.username);

        const validatePassword: Validator<UserForm, string> = (form) =>
            form.passwordConfirmation == 'invalid'
                ? validationResult.err(
                    validationError.field('password', 'is too short'),
                    validationError.field('passwordConfirmation', 'does not match'),
                )
                : validationResult.ok(form.password + '-hashed');

        const userValidator: Validator<UserForm, UserFields> = validators.object({
            username: validateUsername,
            passwordHash: validatePassword,
        });

        test('when valid', () => {
            const validUser = {
                username: 'john',
                password: 'secret',
                passwordConfirmation: 'secret',
            };

            const userResult = userValidator(validUser);

            expect(userResult).toEqual(validationResult.ok({
                username: 'john',
                passwordHash: 'secret-hashed',
            }));
        });

        test('when invalid', () => {
            const invalidUser = {
                username: 'invalid',
                password: 'secret',
                passwordConfirmation: 'invalid',
            };

            const userResult = userValidator(invalidUser);

            expect(userResult).toEqual(result.err([
                validationError.field('username', 'is invalid'),
                validationError.field('password', 'is too short'),
                validationError.field('passwordConfirmation', 'does not match'),
            ]));
        });
    });
});
