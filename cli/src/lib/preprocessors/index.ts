/**
 * Preprocessors Registry
 * 前置处理器注册表
 *
 * 注册所有内置的前置处理器
 */

import { registerPreprocessor } from '../pipeline/preprocessor.js';
import { assetDbCreateAssetPreprocessor } from './asset-db/create-asset.preprocessor.js';
import { assetDbSaveAssetPreprocessor } from './asset-db/save-asset.preprocessor.js';
import { assetDbOpenAssetPreprocessor } from './asset-db/open-asset.preprocessor.js';
import { sceneSetParentPreprocessor } from './scene/set-parent.preprocessor.js';
import { sceneQueryNodeTreePreprocessor } from './scene/query-node-tree.preprocessor.js';
import { sceneOpenScenePreprocessor } from './scene/open-scene.preprocessor.js';
import { sceneCloseScenePreprocessor } from './scene/close-scene.preprocessor.js';
import { sceneCreateComponentPreprocessor } from './scene/create-component.preprocessor.js';
import { sceneSetPropertyPreprocessor } from './scene/set-property.preprocessor.js';

/**
 * Register all built-in preprocessors
 */
export function registerBuiltinPreprocessors(): void {
  // asset-db
  registerPreprocessor('asset-db', 'create-asset', assetDbCreateAssetPreprocessor);
  registerPreprocessor('asset-db', 'save-asset', assetDbSaveAssetPreprocessor);
  registerPreprocessor('asset-db', 'open-asset', assetDbOpenAssetPreprocessor);

  // scene
  registerPreprocessor('scene', 'set-parent', sceneSetParentPreprocessor);
  registerPreprocessor('scene', 'query-node-tree', sceneQueryNodeTreePreprocessor);
  registerPreprocessor('scene', 'open-scene', sceneOpenScenePreprocessor);
  registerPreprocessor('scene', 'close-scene', sceneCloseScenePreprocessor);
  registerPreprocessor('scene', 'create-component', sceneCreateComponentPreprocessor);
  registerPreprocessor('scene', 'set-property', sceneSetPropertyPreprocessor);
}
