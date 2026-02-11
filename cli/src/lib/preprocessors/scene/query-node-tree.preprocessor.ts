/**
 * Preprocessor for scene/query-node-tree
 *
 * Removes any parameters before sending to server
 * The Cocos Creator API doesn't support query parameters
 */
import type { PreprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';

export const sceneQueryNodeTreePreprocessor: PreprocessorFn = async (
  _params: unknown[],
  _client: CocosClient
): Promise<unknown[]> => {
  // Always return empty array - don't send any params to server
  return [];
};
