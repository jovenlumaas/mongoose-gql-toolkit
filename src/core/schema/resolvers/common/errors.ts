import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';

export function buildErrorMessage(validationResult: any) {
  const errorMessages = [];
  for (const error in validationResult.errors) {
    if (Object.prototype.hasOwnProperty.call(validationResult.errors, error)) {
      errorMessages.push(validationResult.errors[error].message);
    }
  }

  return errorMessages.reduce((acc, cur) => `${acc ? `${acc};` : ''}${cur}`, '');
}

export function testValidationError(err: any) {
  if (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      throw new GraphQLError(buildErrorMessage(err));
    } else {
      throw new GraphQLError(err.message);
    }
  }
}
