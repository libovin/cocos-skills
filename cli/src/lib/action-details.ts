/**
 * Action details - Re-exports from details/ directory
 *
 * This file provides backward compatibility by re-exporting from the modular structure.
 * All action details are now organized in the details/ directory by module.
 */

export {
  ACTION_DETAILS,
  getActionDetails,
  hasActionDetails,
  type ActionParam,
  type ActionDetail,
  type ModuleActionDetails,
} from './details/index.js';
