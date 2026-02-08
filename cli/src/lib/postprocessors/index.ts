/**
 * Postprocessors Registry
 * 后置处理器注册表
 *
 * 注册所有内置的后置处理器
 */

import { registerPostprocessor } from '../pipeline/postprocessor.js';
import { sceneCreateNodePostprocessor } from './scene/create-node.postprocessor.js';
import { sceneQueryNodeTreePostprocessor } from './scene/query-node-tree.postprocessor.js';

/**
 * Register all built-in postprocessors
 */
export function registerBuiltinPostprocessors(): void {
  // scene
  registerPostprocessor('scene', 'create-node', sceneCreateNodePostprocessor);
  registerPostprocessor('scene', 'query-node-tree', sceneQueryNodeTreePostprocessor);
}
