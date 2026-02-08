/**
 * Preprocessor for scene/create-node
 * 处理 create-node 的 type 参数，并准备组件/子节点创建
 */

import { preprocessCreateNode } from '../../node-preprocessor.js';
import type { PreprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';

/**
 * Handle type parameter for create-node
 * Returns the node creation params and stores component/child info for postprocessing
 */
export const sceneCreateNodePreprocessor: PreprocessorFn = async (
  params: unknown[],
  _client: CocosClient
): Promise<unknown[]> => {
  const { nodeParams, componentsToAdd, children } = preprocessCreateNode(params);

  // Store metadata for postprocessor
  const result = [nodeParams];

  // Attach metadata to the array for postprocessor to use
  (result as any).__componentsToAdd = componentsToAdd;
  (result as any).__childrenToCreate = children;

  return result;
};
