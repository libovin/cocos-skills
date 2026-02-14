/**
 * Postprocessor for scene/create-component
 * 处理数组格式的组件创建
 */
import { createComponentsForNode } from '../../utils/component-creation.js';
export const sceneCreateComponentPostprocessor = async (result, originalParams, client) => {
    const resultData = result.data;
    if (!resultData || !resultData.components || !Array.isArray(resultData.components)) {
        return result;
    }
    const { uuid, components, skipped } = resultData;
    if (skipped) {
        return result;
    }
    if (components.length === 0) {
        return {
            success: true,
            data: {
                uuid,
                components: [],
                message: 'No components to create',
            },
        };
    }
    const results = await createComponentsForNode(client, uuid, components);
    const successCount = results.filter((r) => r.success).length;
    return {
        success: successCount === components.length,
        data: {
            uuid,
            components,
            total: components.length,
            successCount,
            failedCount: components.length - successCount,
            results,
            message: successCount === components.length
                ? `All ${components.length} components created successfully`
                : `${successCount}/${components.length} components created`,
        },
    };
};
