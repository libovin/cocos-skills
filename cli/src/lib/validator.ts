/**
 * Module and action validation
 * Ported from scripts/client.py:237-305
 */

import { VALID_MODULES, type ModuleName } from '../types.js';

/**
 * Cached available modules from server
 */
let cachedModules: Map<string, Set<string>> | null = null;

/**
 * Validate module and action
 * @param module Module name
 * @param action Action name
 * @param fetchFromServer Whether to fetch from server if not found locally
 * @throws Error if module or action is invalid
 */
export function validateModuleAction(
  module: string,
  action: string,
  fetchFromServer: boolean = true
): void {
  // First check local known list
  if (module in VALID_MODULES) {
    const actions = VALID_MODULES[module as ModuleName];
    if (actions.includes(action as never)) {
      return; // Valid
    }
    // Module known but action unknown - might be new, try server validation
  } else {
    // Module unknown - try server validation
  }

  if (!fetchFromServer) {
    throw new Error(`Invalid module or action: ${module} ${action}`);
  }

  // Try to validate from server
  const available = getAvailableModules();
  if (!(module in available)) {
    throw new Error(
      `Invalid module: '${module}'. Available modules: ${Array.from(available.keys()).sort().join(', ')}`
    );
  }

  const moduleActions = available.get(module);
  if (!moduleActions || !moduleActions.has(action)) {
    throw new Error(
      `Invalid action: '${action}' (module: '${module}'). Available actions: ${Array.from(moduleActions || []).sort().join(', ')}`
    );
  }
}

/**
 * Get available modules from server or use cached list
 * @returns Map of module names to action sets
 */
function getAvailableModules(): Map<string, Set<string>> {
  if (cachedModules !== null) {
    return cachedModules;
  }

  // Return local known list as fallback
  const result = new Map<string, Set<string>>();
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
export function invalidateCache(): void {
  cachedModules = null;
}

/**
 * Check if module is known (local check only)
 * @param module Module name
 * @returns True if module is known
 */
export function isModuleKnown(module: string): module is ModuleName {
  return module in VALID_MODULES;
}

/**
 * Check if action is known for a module (local check only)
 * @param module Module name
 * @param action Action name
 * @returns True if action is known
 */
export function isActionKnown(module: string, action: string): boolean {
  if (!isModuleKnown(module)) {
    return false;
  }
  return VALID_MODULES[module].includes(action as never);
}

/**
 * Get all known module names
 * @returns Array of module names
 */
export function listAllModules(): string[] {
  return Object.keys(VALID_MODULES);
}

/**
 * Get all known actions for a module
 * @param module Module name
 * @returns Array of action names
 */
export function listModuleActions(module: string): string[] {
  if (!isModuleKnown(module)) {
    return [];
  }
  return Array.from(VALID_MODULES[module]);
}
