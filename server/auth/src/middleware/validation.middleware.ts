import { Request, Response, NextFunction, RequestHandler } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

type ValidatedFields = 'body' | 'query' | 'params' | 'headers';

interface ValidationSchema {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  headers?: ZodSchema;
}

export function validateRequest(schemas: ValidationSchema): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationPromises: Promise<void>[] = [];

      // Validate each specified field
      (Object.entries(schemas) as [ValidatedFields, ZodSchema][]).forEach(([field, schema]) => {
        if (schema && req[field]) {
          validationPromises.push(
            schema.parseAsync(req[field]).then((result) => {
              // Replace the request field with the validated and potentially transformed data
              req[field] = result;
            })
          );
        }
      });

      // Wait for all validations to complete
      await Promise.all(validationPromises);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error, {
          prefix: 'Validation error',
          prefixSeparator: ': ',
          issueSeparator: '; ',
        });

        res.status(400).json({
          error: 'Validation failed',
          message: validationError.message,
          details: error.issues,
        });
      } else {
        next(error);
      }
    }
  };
}

// Helper functions for common validations
export const validationHelpers = {
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  uuid: z.string().uuid('Invalid UUID'),
  date: z.string().or(z.date()).transform((val) => new Date(val)),
  pagination: z.object({
    page: z.preprocess(Number, z.number().int().positive().default(1)),
    limit: z.preprocess(Number, z.number().int().min(1).max(100).default(10)),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('asc'),
  }),
};
