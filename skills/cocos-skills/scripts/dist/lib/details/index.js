/**
 * Action details - Aggregated from all modules
 */
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
export const ACTION_DETAILS = {
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
/**
 * Get action details for a specific module and action
 */
export function getActionDetails(module, action) {
    const moduleActions = ACTION_DETAILS[module];
    if (!moduleActions)
        return null;
    return moduleActions[action] || null;
}
/**
 * Check if an action has detailed help
 */
export function hasActionDetails(module, action) {
    return getActionDetails(module, action) !== null;
}
