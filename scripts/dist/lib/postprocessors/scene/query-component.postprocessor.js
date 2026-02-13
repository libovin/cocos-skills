/**
 * Postprocessor for scene/query-component
 * 简化 query-component 返回结果
 *
 * 原始结构：{ value: { uuid: { value: "xxx" }, name: { value: "xxx" }, ... }, type: "cc.Label" }
 * 简化后：  { uuid: "xxx", name: "xxx", type: "cc.Label", props: { ... } }
 */
import { extractComponentProps } from '../../utils/component-props.js';
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
