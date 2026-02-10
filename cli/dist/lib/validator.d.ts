/**
 * Module and action validation
 * Ported from scripts/client.py:237-305
 */
import { type ModuleName } from '../types.js';
/**
 * Validate module and action
 * @param module Module name
 * @param action Action name
 * @param fetchFromServer Whether to fetch from server if not found locally
 * @throws Error if module or action is invalid
 */
export declare function validateModuleAction(module: string, action: string, fetchFromServer?: boolean): void;
/**
 * Invalidate cached modules
 * Call this after server restart or module update
 */
export declare function invalidateCache(): void;
/**
 * Check if module is known (local check only)
 * @param module Module name
 * @returns True if module is known
 */
export declare function isModuleKnown(module: string): module is ModuleName;
/**
 * Check if action is known for a module (local check only)
 * @param module Module name
 * @param action Action name
 * @returns True if action is known
 */
export declare function isActionKnown(module: string, action: string): boolean;
/**
 * Get all known module names
 * @returns Array of module names
 */
export declare function listAllModules(): string[];
/**
 * Get all known actions for a module
 * @param module Module name
 * @returns Array of action names
 */
export declare function listModuleActions(module: string): string[];
//# sourceMappingURL=validator.d.ts.map