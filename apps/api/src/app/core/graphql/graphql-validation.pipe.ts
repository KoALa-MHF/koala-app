import { ValidationPipe, ValidationError } from '@nestjs/common';
import { UserInputError } from "apollo-server-errors";

export class GraphQLValidationPipe extends ValidationPipe {
  constructor() {
    super({
        transform: true,
        exceptionFactory: (errors: ValidationError[]) => {
          return new UserInputError('VALIDATION_ERROR', {
            invalidArgs: errors,
          });
        },
      })
  }
}
