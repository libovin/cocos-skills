/**
 * Validation error class
 * Used by all validators
 */
/**
 * Validation error
 */
export class ValidationError extends Error {
    module;
    action;
    field;
    constructor(module, action, field, message) {
        super(`[${module}/${action}] ${field}: ${message}`);
        this.module = module;
        this.action = action;
        this.field = field;
        this.name = 'ValidationError';
    }
}
