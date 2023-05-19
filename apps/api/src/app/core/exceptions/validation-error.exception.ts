import { UserInputError } from '@nestjs/apollo';
import { ValidationError } from 'class-validator';

export class ValidationErrorException extends UserInputError {
  constructor(validationError: ValidationError | ValidationError[]) {
    const validationErrors =
      validationError instanceof ValidationError
        ? [
            validationError,
          ]
        : validationError;
    super('VALIDATION_ERROR', {
      extensions: { invalidArgs: validationErrors },
    });
  }
}
