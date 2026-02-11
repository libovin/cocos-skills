/**
 * Preprocessor for scene/set-property
 * 支持通过组件类型批量设置属性
 * 将 { uuid, component, properties } 格式转换为多个 set-property 调用
 */
/**
 * Find component index by type from node data
 */
function findComponentIndex(components, componentType) {
    if (!components || !Array.isArray(components)) {
        return -1;
    }
    return components.findIndex((comp) => comp.type === componentType);
}
/**
 * Preprocessor that supports batch property setting by component type
 * Converts { uuid, component, properties } format to standard set-property calls
 */
export const sceneSetPropertyPreprocessor = async (params, client) => {
    const options = params[0];
    if (!options) {
        return params;
    }
    // Check if using new format (component + properties)
    const { uuid: nodeUuid, component: componentType, properties } = options;
    // If not using new format, return original params
    if (typeof nodeUuid !== 'string' || typeof componentType !== 'string' || !properties) {
        return params;
    }
    if (!Array.isArray(properties)) {
        return params;
    }
    try {
        // Query node to get component index
        // 使用简化后的 query-node 返回结果（通过 postprocessor 处理）
        const result = await client.execute('scene', 'query-node', [nodeUuid]
        // 不再需要 skipPostprocessor，直接使用简化后的结果
        );
        if (!result.success || !result.data) {
            return params;
        }
        // Determine if this is a node property (cc.Node) or component property
        const isNodeProperty = componentType === 'cc.Node';
        let pathPrefix;
        if (isNodeProperty) {
            // Node properties don't have __comps__ prefix
            pathPrefix = '';
        }
        else {
            // Component properties need __comps__.index prefix
            const nodeData = result.data;
            const components = nodeData.components;
            // Find component index
            const componentIndex = findComponentIndex(components, componentType);
            if (componentIndex === -1) {
                // Component not found, return original params (will fail in API call)
                return params;
            }
            // Build property path prefix
            pathPrefix = `__comps__.${componentIndex}.`;
        }
        // Convert properties array to final set-property call structure
        const setPropertyCalls = [];
        for (const prop of properties) {
            if (typeof prop === 'object' && prop !== null) {
                const propObj = prop;
                if (typeof propObj.name === 'string' && 'value' in propObj && typeof propObj.type === 'string') {
                    // Build full path: if pathPrefix is empty, use name directly
                    const path = pathPrefix ? `${pathPrefix}${propObj.name}` : propObj.name;
                    setPropertyCalls.push({
                        uuid: nodeUuid,
                        path,
                        dump: {
                            value: propObj.value,
                            type: propObj.type,
                        },
                    });
                }
            }
        }
        if (setPropertyCalls.length === 0) {
            return params;
        }
        // Batch mode: skip original API call and pass prepared calls to postprocessor
        const skipResult = {
            params,
            skipApiCall: true,
            skipPostProcessor: false,
            skipResponse: {
                success: true,
                data: {
                    calls: setPropertyCalls,
                    message: `Prepared ${setPropertyCalls.length} set-property calls`,
                },
            },
        };
        return skipResult;
    }
    catch {
        // If query fails, return original params
        return params;
    }
};
//# sourceMappingURL=set-property.preprocessor.js.map