/**
 * Component property utilities
 * 组件属性处理通用工具
 */
/**
 * Internal fields to skip when extracting component properties
 */
export const COMPONENT_SKIP_FIELDS = [
    'uuid',
    'name',
    '_objFlags',
    '__scriptAsset',
    'node',
    '_name',
];
/**
 * Unwrap a single value (handle { value: ... } structure)
 */
export function unwrapValue(item) {
    if (item && typeof item === 'object' && 'value' in item) {
        return item.value;
    }
    return item;
}
/**
 * Check if a field should be skipped
 */
export function shouldSkipField(key) {
    return COMPONENT_SKIP_FIELDS.includes(key) || key.startsWith('_');
}
/**
 * Extract property info (name and type) from component value
 */
export function extractPropertyInfo(compValue) {
    const props = [];
    for (const [key, fieldData] of Object.entries(compValue)) {
        if (shouldSkipField(key))
            continue;
        if (fieldData && typeof fieldData === 'object') {
            const fieldObj = fieldData;
            const propType = fieldObj.type;
            if (propType) {
                props.push({ name: key, type: propType });
            }
        }
    }
    return props;
}
/**
 * Extract component props with unwrapped values
 */
export function extractComponentProps(compValue) {
    const props = {};
    for (const [key, fieldData] of Object.entries(compValue)) {
        if (shouldSkipField(key))
            continue;
        if (fieldData && typeof fieldData === 'object' && 'value' in fieldData && !Array.isArray(fieldData)) {
            const value = fieldData.value;
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
