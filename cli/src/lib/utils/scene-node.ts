/**
 * Scene node utilities
 * 场景节点验证通用工具
 */

import type { CocosClient } from '../client.js';
import { ValidationError } from '../validators/error.js';

/**
 * Component info from simplified query-node response
 */
export interface ComponentInfo {
  type: string;
  uuid: string;
  enabled?: boolean;
  props?: Record<string, unknown>;
}

/**
 * Simplified node response from query-node postprocessor
 */
export interface SimplifiedNode {
  uuid: string;
  name: string;
  active?: boolean;
  position?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  parent?: string;
  components?: ComponentInfo[];
}

/**
 * Query node and return simplified node data
 * Returns null if node not found or query failed
 */
export async function queryNode(
  client: CocosClient,
  nodeUuid: string
): Promise<SimplifiedNode | null> {
  try {
    const result = await client.execute('scene', 'query-node', [nodeUuid]);

    if (!result.success || !result.data) {
      return null;
    }

    return result.data as SimplifiedNode;
  } catch {
    return null;
  }
}

/**
 * Verify node exists, throw ValidationError if not
 */
export async function verifyNodeExists(
  client: CocosClient,
  nodeUuid: string,
  context: { module: string; action: string; field: string }
): Promise<SimplifiedNode> {
  const node = await queryNode(client, nodeUuid);

  if (!node) {
    throw new ValidationError(
      context.module,
      context.action,
      context.field,
      `节点 "${nodeUuid}" 不存在或无法访问。使用 query-node-tree 获取可用节点`
    );
  }

  return node;
}

/**
 * Find component info by type from node data
 */
export function findComponentInfo(
  components: ComponentInfo[] | undefined,
  componentType: string
): ComponentInfo | undefined {
  if (!components || !Array.isArray(components)) {
    return undefined;
  }
  return components.find((comp) => comp.type === componentType);
}

/**
 * Check if component type already exists on node
 */
export function componentExists(
  components: ComponentInfo[] | undefined,
  componentType: string
): boolean {
  return findComponentInfo(components, componentType) !== undefined;
}

/**
 * Get all components that don't exist on node
 */
export function getMissingComponents(
  components: ComponentInfo[] | undefined,
  componentTypes: string[]
): string[] {
  if (!components || !Array.isArray(components)) {
    return [...componentTypes];
  }
  return componentTypes.filter((type) => !componentExists(components, type));
}
