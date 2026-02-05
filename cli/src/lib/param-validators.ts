/**
 * Parameter validation for specific actions
 * Validates params before sending to Cocos Creator API
 */

import { VALID_MODULES } from '../types.js';

/**
 * Re-export ValidationError from validators module
 */
export { ValidationError } from './validators/error.js';

/**
 * Import all validators from sub-modules
 */
import * as validators from './validators/index.js';

/**
 * Action validators mapping
 * Maps module+action to validation function
 */
const ACTION_VALIDATORS: Record<string, Record<string, (params: unknown[]) => void>> = {
  'asset-db': {
    'create-asset': validators.validateCreateAsset,
    'import-asset': validators.validateImportAsset,
  },
  'scene': {
    'set-property': validators.validateSetProperty,
    'create-node': validators.validateCreateNode,
    'remove-node': validators.validateRemoveNode,
    'create-component': validators.validateCreateComponent,
  },
};

/**
 * Validate params for a specific action
 * @param module Module name
 * @param action Action name
 * @param params Parameters array
 * @throws ValidationError if validation fails
 */
export function validateActionParams(module: string, action: string, params: unknown[]): void {
  const moduleValidators = ACTION_VALIDATORS[module];
  if (!moduleValidators) return;

  const validator = moduleValidators[action];
  if (!validator) return;

  validator(params);
}

/**
 * Check if an action has param validation
 * @param module Module name
 * @param action Action name
 * @returns true if validation exists
 */
export function hasParamValidation(module: string, action: string): boolean {
  const moduleValidators = ACTION_VALIDATORS[module];
  if (!moduleValidators) return false;

  return action in moduleValidators;
}
