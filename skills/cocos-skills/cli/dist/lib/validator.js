/**
 * Module and action validation
 * Ported from scripts/client.py:237-305
 */
import { VALID_MODULES } from '../types.js';
/**
 * Cached available modules from server
 */
let cachedModules = null;
/**
 * Validate module and action
 * @param module Module name
 * @param action Action name
 * @param fetchFromServer Whether to fetch from server if not found locally
 * @throws Error if module or action is invalid
 */
export function validateModuleAction(module, action, fetchFromServer = true) {
    // First check local known list
    if (module in VALID_MODULES) {
        const actions = VALID_MODULES[module];
        if (actions.includes(action)) {
            return; // Valid
        }
        // Module known but action unknown - might be new, try server validation
    }
    else {
        // Module unknown - try server validation
    }
    if (!fetchFromServer) {
        throw new Error(`Invalid module or action: ${module} ${action}`);
    }
    // Try to validate from server
    const available = getAvailableModules();
    if (!(module in available)) {
        throw new Error(`Invalid module: '${module}'. Available modules: ${Array.from(available.keys()).sort().join(', ')}`);
    }
    const moduleActions = available.get(module);
    if (!moduleActions || !moduleActions.has(action)) {
        throw new Error(`Invalid action: '${action}' (module: '${module}'). Available actions: ${Array.from(moduleActions || []).sort().join(', ')}`);
    }
}
/**
 * Get available modules from server or use cached list
 * @returns Map of module names to action sets
 */
function getAvailableModules() {
    if (cachedModules !== null) {
        return cachedModules;
    }
    // Return local known list as fallback
    const result = new Map();
    for (const [moduleName, actions] of Object.entries(VALID_MODULES)) {
        result.set(moduleName, new Set(actions));
    }
    cachedModules = result;
    return result;
}
/**
 * Invalidate cached modules
 * Call this after server restart or module update
 */
export function invalidateCache() {
    cachedModules = null;
}
/**
 * Check if module is known (local check only)
 * @param module Module name
 * @returns True if module is known
 */
export function isModuleKnown(module) {
    return module in VALID_MODULES;
}
/**
 * Check if action is known for a module (local check only)
 * @param module Module name
 * @param action Action name
 * @returns True if action is known
 */
export function isActionKnown(module, action) {
    if (!isModuleKnown(module)) {
        return false;
    }
    return VALID_MODULES[module].includes(action);
}
/**
 * Get all known module names
 * @returns Array of module names
 */
export function listAllModules() {
    return Object.keys(VALID_MODULES);
}
/**
 * Get all known actions for a module
 * @param module Module name
 * @returns Array of action names
 */
export function listModuleActions(module) {
    if (!isModuleKnown(module)) {
        return [];
    }
    return Array.from(VALID_MODULES[module]);
}
//# sourceMappingURL=validator.js.map