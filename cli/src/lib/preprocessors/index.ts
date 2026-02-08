/**
 * Preprocessors Registry
 * 前置处理器注册表
 *
 * 注册所有内置的前置处理器
 */

import { registerPreprocessor } from '../pipeline/preprocessor.js';
import { assetDbCreateAssetPreprocessor } from './asset-db/create-asset.preprocessor.js';
import { sceneSetParentPreprocessor } from './scene/set-parent.preprocessor.js';
import { sceneCreateNodePreprocessor } from './scene/create-node.preprocessor.js';

/**
 * Register all built-in preprocessors
 */
export function registerBuiltinPreprocessors(): void {
  // asset-db
  registerPreprocessor('asset-db', 'create-asset', assetDbCreateAssetPreprocessor);

  // scene
  registerPreprocessor('scene', 'set-parent', sceneSetParentPreprocessor);
  registerPreprocessor('scene', 'create-node', sceneCreateNodePreprocessor);
}
