/**
 * Scene node utilities
 * 场景节点验证通用工具
 */
import { ValidationError } from '../validators/error.js';
/**
 * Query node and return simplified node data
 * Returns null if node not found or query failed
 */
export async function queryNode(client, nodeUuid) {
    try {
        const result = await client.execute('scene', 'query-node', [nodeUuid]);
        if (!result.success || !result.data) {
            return null;
        }
        return result.data;
    }
    catch {
        return null;
    }
}
/**
 * Verify node exists, throw ValidationError if not
 */
export async function verifyNodeExists(client, nodeUuid, context) {
    const node = await queryNode(client, nodeUuid);
    if (!node) {
        throw new ValidationError(context.module, context.action, context.field, `节点 "${nodeUuid}" 不存在或无法访问。使用 query-node-tree 获取可用节点`);
    }
    return node;
}
/**
 * Find component info by type from node data
 */
export function findComponentInfo(components, componentType) {
    if (!components || !Array.isArray(components)) {
        return undefined;
    }
    return components.find((comp) => comp.type === componentType);
}
/**
 * Check if component type already exists on node
 */
export function componentExists(components, componentType) {
    return findComponentInfo(components, componentType) !== undefined;
}
/**
 * Get all components that don't exist on node
 */
export function getMissingComponents(components, componentTypes) {
    if (!components || !Array.isArray(components)) {
        return [...componentTypes];
    }
    return componentTypes.filter((type) => !componentExists(components, type));
}
