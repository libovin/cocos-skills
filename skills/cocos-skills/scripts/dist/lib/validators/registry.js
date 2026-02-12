/**
 * Validators Registry
 * 参数校验器注册表
 *
 * 注册所有内置的参数校验器
 */
import { registerValidator } from '../pipeline/validator.js';
// Import all validators
import { validateSetProperty } from './scene/set-property.validator.js';
import { validateCreateNode } from './scene/create-node.validator.js';
import { validateRemoveNode } from './scene/remove-node.validator.js';
import { validateCreateComponent } from './scene/create-component.validator.js';
import { validateOpenScene } from './scene/open-scene.validator.js';
import { validateCreateAsset } from './asset-db/create-asset.validator.js';
import { validateImportAsset } from './asset-db/import-asset.validator.js';
import { validateOpenAsset } from './asset-db/open-asset.validator.js';
/**
 * Register all built-in validators
 */
export function registerBuiltinValidators() {
    // scene
    registerValidator('scene', 'set-property', validateSetProperty);
    registerValidator('scene', 'create-node', validateCreateNode);
    registerValidator('scene', 'remove-node', validateRemoveNode);
    registerValidator('scene', 'create-component', validateCreateComponent);
    registerValidator('scene', 'open-scene', validateOpenScene);
    // asset-db
    registerValidator('asset-db', 'create-asset', validateCreateAsset);
    registerValidator('asset-db', 'import-asset', validateImportAsset);
    registerValidator('asset-db', 'open-asset', validateOpenAsset);
}
