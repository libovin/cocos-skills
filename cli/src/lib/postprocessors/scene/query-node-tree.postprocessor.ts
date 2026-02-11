/**
 * Postprocessor for scene/query-node-tree
 * 移除不必要的属性
 */

import type { PostprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import type { ApiResponse } from '../../../types.js';

/**
 * 原始节点结构
 */
interface RawSceneNode {
  name: string;
  uuid: string;
  active?: boolean;
  locked?: boolean;
  type?: string;
  path?: string;
  prefab?: Record<string, unknown>;
  parent?: string;
  isScene?: boolean;
  readonly?: boolean;
  children?: RawSceneNode[];
  components?: RawComponent[];
}

/**
 * 原始组件结构
 */
interface RawComponent {
  isCustom: boolean;
  type: string;
  value: string;
  extends?: string[];
}

/**
 * 递归清理节点，移除不必要的属性
 */
function cleanNode(node: RawSceneNode): RawSceneNode {
  const cleaned: RawSceneNode = {
    name: node.name,
    uuid: node.uuid,
  };

  // 保留可选字段
  if (node.active !== undefined) cleaned.active = node.active;
  if (node.locked !== undefined) cleaned.locked = node.locked;
  if (node.type !== undefined) cleaned.type = node.type;
  if (node.path !== undefined) cleaned.path = node.path;

  // 保留组件
  if (node.components && node.components.length > 0) {
    cleaned.components = node.components;
  }

  // 递归处理子节点
  if (node.children && node.children.length > 0) {
    cleaned.children = node.children.map(cleanNode);
  }

  return cleaned;
}

/**
 * 简化 query-node-tree 返回结果
 */
export const sceneQueryNodeTreePostprocessor: PostprocessorFn = async (
  result: ApiResponse,
  _originalParams: unknown[],
  _client: CocosClient
): Promise<ApiResponse> => {
  if (!result.success || !result.data) {
    return result;
  }

  // data 是根节点对象
  const rootNode = result.data as RawSceneNode;
  return {
    ...result,
    data: cleanNode(rootNode),
  };
};
