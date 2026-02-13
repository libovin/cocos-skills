/**
 * Preprocessor for scene/create-node
 * 验证 parent 节点是否存在
 */

import { ValidationError } from '../../validators/error.js';
import type { PreprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import { queryNode } from '../../utils/scene-node.js';

/**
 * Preprocessor that validates parent node exists before creating a new node
 * 在创建节点前验证父节点是否存在
 */
export const sceneCreateNodePreprocessor: PreprocessorFn = async (
  params: unknown[],
  client: CocosClient
): Promise<unknown[]> => {
  const options = params[0] as Record<string, unknown> | undefined;
  if (!options) {
    return params;
  }

  const { parent } = options;

  if (typeof parent !== 'string') {
    throw new ValidationError(
      'scene',
      'create-node',
      'parent',
      'parent 参数必须是字符串类型的节点 UUID'
    );
  }

  const node = await queryNode(client, parent);

  if (!node) {
    throw new ValidationError(
      'scene',
      'create-node',
      'parent',
      `父节点 "${parent}" 不存在或无法访问。正确用法: scene create-node '{"parent": "父节点UUID"}' 或使用 query-node-tree 获取可用节点`
    );
  }

  return params;
};
