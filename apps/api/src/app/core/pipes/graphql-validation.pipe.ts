import { ValidationPipe, ValidationError } from '@nestjs/common';
import { ValidationErrorException } from '../exceptions/validation-error.exception';

export class GraphQLValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new ValidationErrorException(errors);
      },
    });
  }
}
