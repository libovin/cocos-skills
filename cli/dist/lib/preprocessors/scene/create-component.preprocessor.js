/**
 * Preprocessor for scene/create-component
 * 检查节点是否已存在指定组件，如果存在则跳过 API 调用
 * 支持 component 为字符串或数组（批量添加）
 */
/**
 * Check if component type already exists on node
 */
function componentExists(components, componentType) {
    if (!components || !Array.isArray(components)) {
        return false;
    }
    return components.some((comp) => comp.type === componentType);
}
/**
 * Get all components that don't exist on node
 */
function getMissingComponents(components, componentTypes) {
    if (!components || !Array.isArray(components)) {
        return [...componentTypes];
    }
    return componentTypes.filter((type) => !componentExists(components, type));
}
/**
 * Preprocessor that checks if component already exists on node
 * If component exists, skips the API call and returns success
 * Supports component as string or array for batch adding
 */
export const sceneCreateComponentPreprocessor = async (params, client) => {
    const options = params[0];
    if (!options) {
        return params;
    }
    const { uuid: nodeUuid, component: componentParam } = options;
    if (typeof nodeUuid !== 'string') {
        return params;
    }
    // Handle component as string or array
    let componentTypes;
    let isArray = false;
    if (typeof componentParam === 'string') {
        componentTypes = [componentParam];
    }
    else if (Array.isArray(componentParam)) {
        componentTypes = componentParam.filter((item) => typeof item === 'string');
        isArray = true;
        if (componentTypes.length === 0) {
            return params;
        }
    }
    else {
        return params;
    }
    try {
        // Query node to check if components already exist
        // 使用简化后的 query-node 返回结果（通过 postprocessor 处理）
        const result = await client.execute('scene', 'query-node', [nodeUuid]
        // 不再需要 skipPostprocessor，直接使用简化后的结果
        );
        if (!result.success || !result.data) {
            return params;
        }
        // 从简化后的 node 数据中提取 components
        const nodeData = result.data;
        const components = nodeData.components;
        if (!components || !Array.isArray(components)) {
            return params;
        }
        // Find missing components
        const missingComponents = getMissingComponents(components, componentTypes);
        // If all components already exist, skip API call
        if (missingComponents.length === 0) {
            const existingTypes = componentTypes.join(', ');
            const skipResult = {
                params,
                skipApiCall: true,
                skipResponse: {
                    success: true,
                    data: {
                        uuid: nodeUuid,
                        components: componentTypes,
                        skipped: true,
                        message: isArray
                            ? `All components [${existingTypes}] already exist on node`
                            : `Component ${existingTypes} already exists on node`,
                    },
                },
            };
            return skipResult;
        }
        // For array format, pass to postprocessor for handling
        if (isArray) {
            const skipResult = {
                params,
                skipApiCall: true,
                skipResponse: {
                    success: true,
                    data: {
                        uuid: nodeUuid,
                        components: missingComponents,
                        skipped: false,
                        message: `Preparing to create ${missingComponents.length} components`,
                    },
                },
            };
            return skipResult;
        }
    }
    catch {
        // If query fails, proceed with normal API call
        return params;
    }
    return params;
};
//# sourceMappingURL=create-component.preprocessor.js.map