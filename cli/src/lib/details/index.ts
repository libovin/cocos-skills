/**
 * Action details - Aggregated from all modules
 */

import type { ActionDetail, ModuleActionDetails } from './types.js';

// Import all module details
import { assetDbDetails } from './asset-db.js';
import { sceneDetails } from './scene.js';
import { projectDetails } from './project.js';
import { builderDetails } from './builder.js';
import { engineDetails } from './engine.js';
import { informationDetails } from './information.js';
import { preferencesDetails } from './preferences.js';
import { programDetails } from './program.js';
import { programmingDetails } from './programming.js';
import { serverDetails } from './server.js';
import { deviceDetails } from './device.js';
import { extensionDetails } from './extension.js';

/**
 * Complete action details for all modules
 * Each action has: description, parameters (name, type, required, description), examples, notes
 */
export const ACTION_DETAILS: Record<string, ModuleActionDetails> = {
  'asset-db': assetDbDetails,
  'scene': sceneDetails,
  'project': projectDetails,
  'builder': builderDetails,
  'engine': engineDetails,
  'information': informationDetails,
  'preferences': preferencesDetails,
  'program': programDetails,
  'programming': programmingDetails,
  'server': serverDetails,
  'device': deviceDetails,
  'extension': extensionDetails,
};

// Re-export types
export type { ActionParam, ActionDetail, ModuleActionDetails } from './types.js';

/**
 * Get action details for a specific module and action
 */
export function getActionDetails(module: string, action: string): ActionDetail | null {
  const moduleActions = ACTION_DETAILS[module];
  if (!moduleActions) return null;
  return moduleActions[action] || null;
}

/**
 * Check if an action has detailed help
 */
export function hasActionDetails(module: string, action: string): boolean {
  return getActionDetails(module, action) !== null;
}
