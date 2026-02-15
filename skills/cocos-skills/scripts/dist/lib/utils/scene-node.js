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
/**
 * Build node to component UUID mapping from query-node-tree result
 * Returns a map: componentType -> nodeUuid -> componentUuid
 */
export function buildNodeToComponentMap(rootNode) {
    const map = new Map();
    function processNode(node) {
        if (node.components) {
            for (const comp of node.components) {
                if (!map.has(comp.type)) {
                    map.set(comp.type, new Map());
                }
                map.get(comp.type).set(node.uuid, comp.uuid);
            }
        }
        if (node.children) {
            for (const child of node.children) {
                processNode(child);
            }
        }
    }
    processNode(rootNode);
    return map;
}
/**
 * Query node tree and build component mapping
 */
export async function queryNodeToComponentMap(client) {
    try {
        const result = await client.execute('scene', 'query-node-tree', []);
        if (!result.success || !result.data) {
            return new Map();
        }
        return buildNodeToComponentMap(result.data);
    }
    catch {
        return new Map();
    }
}
/**
 * Component reference types that need node uuid to component uuid conversion
 * cc.Node uses node uuid directly, no conversion needed
 */
export const COMPONENT_UUID_TYPES = [
    'cc.Label',
    'cc.Sprite',
    'cc.Button',
    'cc.Widget',
    'cc.Layout',
    'cc.Mask',
    'cc.UITransform',
    'cc.Camera',
    'cc.Canvas',
    'cc.AudioSource',
    'cc.Animation',
    'cc.ParticleSystem',
    'cc.RigidBody2D',
    'cc.BoxCollider2D',
    'cc.CircleCollider2D',
    'cc.PolygonCollider2D',
    'cc.ScrollView',
    'cc.EditBox',
    'cc.ProgressBar',
    'cc.Slider',
    'cc.Toggle',
    'cc.ToggleContainer',
    'cc.PageView',
    'cc.RichText',
    'cc.Graphics',
    'cc.BlockInputEvents',
];
/**
 * Check if a type needs node uuid to component uuid conversion
 * Returns true for component types like cc.Label, cc.Sprite, etc.
 * Returns false for cc.Node (uses node uuid directly) and other types
 */
export function needsComponentUuidConversion(type) {
    if (COMPONENT_UUID_TYPES.includes(type)) {
        return true;
    }
    if (type.startsWith('cc.') && type !== 'cc.Node' && type !== 'cc.Prefab' && type !== 'cc.SpriteFrame' && type !== 'cc.Asset') {
        return true;
    }
    return false;
}
