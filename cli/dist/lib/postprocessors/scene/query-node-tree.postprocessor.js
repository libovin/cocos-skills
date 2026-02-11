/**
 * Postprocessor for scene/query-node-tree
 * 移除不必要的属性
 */
/**
 * 递归清理节点，移除不必要的属性
 */
function cleanNode(node) {
    const cleaned = {
        name: node.name,
        uuid: node.uuid,
    };
    // 保留可选字段
    if (node.active !== undefined)
        cleaned.active = node.active;
    if (node.locked !== undefined)
        cleaned.locked = node.locked;
    if (node.type !== undefined)
        cleaned.type = node.type;
    if (node.path !== undefined)
        cleaned.path = node.path;
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
export const sceneQueryNodeTreePostprocessor = async (result, _originalParams, _client) => {
    if (!result.success || !result.data) {
        return result;
    }
    // data 是根节点对象
    const rootNode = result.data;
    return {
        ...result,
        data: cleanNode(rootNode),
    };
};
//# sourceMappingURL=query-node-tree.postprocessor.js.map