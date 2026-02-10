/**
 * Action details - Aggregated from all modules
 */
import type { ActionDetail, ModuleActionDetails } from './types.js';
/**
 * Complete action details for all modules
 * Each action has: description, parameters (name, type, required, description), examples, notes
 */
export declare const ACTION_DETAILS: Record<string, ModuleActionDetails>;
export type { ActionParam, ActionDetail, ModuleActionDetails } from './types.js';
/**
 * Get action details for a specific module and action
 */
export declare function getActionDetails(module: string, action: string): ActionDetail | null;
/**
 * Check if an action has detailed help
 */
export declare function hasActionDetails(module: string, action: string): boolean;
//# sourceMappingURL=index.d.ts.map