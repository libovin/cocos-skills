/**
 * Preprocessor for scene/set-parent
 * 为 set-parent 检测循环引用
 */
import { ValidationError } from '../../validators/error.js';
/**
 * Build a UUID to node map for quick lookup
 */
function buildNodeMap(node, map = new Map()) {
    map.set(node.uuid, node);
    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            buildNodeMap(child, map);
        }
    }
    return map;
}
/**
 * Get all descendant UUIDs of a node (traverse down the tree)
 */
function getDescendantUuids(node, descendants = new Set()) {
    for (const child of node.children || []) {
        descendants.add(child.uuid);
        getDescendantUuids(child, descendants);
    }
    return descendants;
}
/**
 * Check if moving nodes to new parent would create a cycle
 */
function checkCycle(nodeMap, nodeUuids, parentUuid) {
    const parent = nodeMap.get(parentUuid);
    if (!parent) {
        // Parent not found in scene tree, might be a new node - can't check cycle
        return;
    }
    // Get all descendant UUIDs of the parent (potential ancestors)
    const descendantUuids = getDescendantUuids(parent);
    // Check if any node being moved is a descendant of the parent
    for (const uuid of nodeUuids) {
        if (descendantUuids.has(uuid)) {
            throw new ValidationError('scene', 'set-parent', 'params', `无法将节点 ${uuid} 移动到 ${parentUuid} 下：节点 ${uuid} 是节点 ${parentUuid} 的后代节点，这会形成循环引用`);
        }
    }
}
/**
 * Validate that moving nodes won't create a cycle in the node hierarchy
 * 验证移动节点不会在节点层级中形成循环
 */
export const sceneSetParentPreprocessor = async (params, client) => {
    if (params.length !== 1) {
        return params;
    }
    const args = params[0];
    const { uuids, parent } = args;
    // Validate params structure
    if (!Array.isArray(uuids) || typeof parent !== 'string') {
        return params;
    }
    if (uuids.length === 0) {
        return params;
    }
    // Skip validation if parent is one of the nodes being moved
    if (uuids.includes(parent)) {
        throw new ValidationError('scene', 'set-parent', 'parent', `父节点 UUID 不能与要移动的节点 UUID 相同`);
    }
    try {
        // Query the scene node tree to check for cycles
        // 使用 client.execute 获取简化后的结果
        const response = await client.execute('scene', 'query-node-tree', []);
        if (!response.success || !response.data) {
            // If we can't get the tree, skip validation (fail open)
            return params;
        }
        // 简化后的 data 是根节点对象
        const rootNode = response.data;
        // Build a map of UUID to node for quick lookup
        const nodeMap = buildNodeMap(rootNode);
        // Check for cycles
        checkCycle(nodeMap, uuids, parent);
    }
    catch (error) {
        // If validation fails for any reason, throw the error
        if (error instanceof ValidationError) {
            throw error;
        }
        // If query fails, skip validation (fail open)
    }
    return params;
};
