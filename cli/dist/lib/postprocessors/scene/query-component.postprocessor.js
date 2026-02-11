/**
 * Postprocessor for scene/query-component
 * 简化 query-component 返回结果
 *
 * 原始结构：{ value: { uuid: { value: "xxx" }, name: { value: "xxx" }, ... }, type: "cc.Label" }
 * 简化后：  { uuid: "xxx", name: "xxx", type: "cc.Label", props: { ... } }
 */
/**
 * 解包单个值（处理 { value: ... } 结构）
 */
function unwrapValue(item) {
    if (item && typeof item === 'object' && 'value' in item) {
        return item.value;
    }
    return item;
}
/**
 * 从组件 value 中提取所有属性
 * 自动解包 value 字段，跳过内部字段
 */
function extractComponentProps(compValue) {
    const props = {};
    // 跳过的内部字段
    const skipFields = [
        'uuid', 'name', 'enabled', '_objFlags', '__scriptAsset', 'node', '_enabled', '_name',
    ];
    for (const [key, fieldData] of Object.entries(compValue)) {
        // 跳过内部字段和 _ 开头的字段
        if (skipFields.includes(key) || key.startsWith('_'))
            continue;
        // 如果是包装值 { value: ... }
        if (fieldData && typeof fieldData === 'object' && 'value' in fieldData && !Array.isArray(fieldData)) {
            const value = fieldData.value;
            // 如果解包后的值是数组，需要继续处理数组元素
            if (Array.isArray(value)) {
                const arr = [];
                for (const item of value) {
                    const unwrapped = unwrapValue(item);
                    if (unwrapped !== null && unwrapped !== undefined) {
                        arr.push(unwrapped);
                    }
                }
                if (arr.length > 0) {
                    props[key] = arr;
                }
            }
            else if (value !== null && value !== undefined) {
                props[key] = value;
            }
        }
        else if (Array.isArray(fieldData)) {
            // 处理数组：对每个元素进行解包
            const arr = [];
            for (const item of fieldData) {
                const unwrapped = unwrapValue(item);
                if (unwrapped !== null && unwrapped !== undefined) {
                    arr.push(unwrapped);
                }
            }
            if (arr.length > 0) {
                props[key] = arr;
            }
        }
        else if (fieldData !== null && fieldData !== undefined) {
            props[key] = fieldData;
        }
    }
    return props;
}
/**
 * 简化 query-component 返回结果
 */
export const sceneQueryComponentPostprocessor = async (result, _originalParams, _client) => {
    if (!result.success || !result.data) {
        return result;
    }
    const data = result.data;
    const compValue = data.value;
    if (!compValue) {
        return result;
    }
    // 提取基本字段
    const uuidField = compValue.uuid;
    const nameField = compValue.name;
    const enabledField = compValue.enabled;
    const typeField = data.type;
    if (!uuidField || !nameField || !typeField) {
        return result;
    }
    const simplified = {
        uuid: uuidField.value,
        name: nameField.value,
        type: typeField,
        enabled: enabledField.value,
        props: extractComponentProps(compValue),
    };
    return {
        ...result,
        data: simplified,
    };
};
//# sourceMappingURL=query-component.postprocessor.js.map