/**
 * Validation error class
 * Used by all validators
 */

/**
 * Validation error
 */
export class ValidationError extends Error {
  constructor(
    public module: string,
    public action: string,
    public field: string,
    message: string
  ) {
    super(`[${module}/${action}] ${field}: ${message}`);
    this.name = 'ValidationError';
  }
}
