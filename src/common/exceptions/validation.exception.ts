import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export const validationExceptionFactory = (errors: ValidationError[]) => {
  const errorMessage = {};
  errors.forEach((error: ValidationError) => {
    errorMessage[error.property] = [...Object.values(error.constraints)];
  });
  return new ValidationException(errorMessage);
};

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: Record<string, unknown>) {
    super({
      statusCode: 400,
      message: 'Bad Request',
      errors: validationErrors,
    });
  }
}
