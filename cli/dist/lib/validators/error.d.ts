/**
 * Validation error class
 * Used by all validators
 */
/**
 * Validation error
 */
export declare class ValidationError extends Error {
    module: string;
    action: string;
    field: string;
    constructor(module: string, action: string, field: string, message: string);
}
//# sourceMappingURL=error.d.ts.map