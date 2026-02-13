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
 * Property info with name and type
 */
export interface PropertyInfo {
  name: string;
  type: string;
}

/**
 * Unwrap a single value (handle { value: ... } structure)
 */
export function unwrapValue(item: unknown): unknown {
  if (item && typeof item === 'object' && 'value' in item) {
    return (item as Record<string, unknown>).value;
  }
  return item;
}

/**
 * Check if a field should be skipped
 */
export function shouldSkipField(key: string): boolean {
  return COMPONENT_SKIP_FIELDS.includes(key) || key.startsWith('_');
}

/**
 * Extract property info (name and type) from component value
 */
export function extractPropertyInfo(compValue: Record<string, unknown>): PropertyInfo[] {
  const props: PropertyInfo[] = [];

  for (const [key, fieldData] of Object.entries(compValue)) {
    if (shouldSkipField(key)) continue;

    if (fieldData && typeof fieldData === 'object') {
      const fieldObj = fieldData as Record<string, unknown>;
      const propType = fieldObj.type as string | undefined;

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
export function extractComponentProps(compValue: Record<string, unknown>): Record<string, unknown> {
  const props: Record<string, unknown> = {};

  for (const [key, fieldData] of Object.entries(compValue)) {
    if (shouldSkipField(key)) continue;

    if (fieldData && typeof fieldData === 'object' && 'value' in fieldData && !Array.isArray(fieldData)) {
      const value = (fieldData as Record<string, unknown>).value;
      if (Array.isArray(value)) {
        const arr: unknown[] = [];
        for (const item of value) {
          const unwrapped = unwrapValue(item);
          if (unwrapped !== null && unwrapped !== undefined) {
            arr.push(unwrapped);
          }
        }
        if (arr.length > 0) {
          props[key] = arr;
        }
      } else if (value !== null && value !== undefined) {
        props[key] = value;
      }
    } else if (Array.isArray(fieldData)) {
      const arr: unknown[] = [];
      for (const item of fieldData) {
        const unwrapped = unwrapValue(item);
        if (unwrapped !== null && unwrapped !== undefined) {
          arr.push(unwrapped);
        }
      }
      if (arr.length > 0) {
        props[key] = arr;
      }
    } else if (fieldData !== null && fieldData !== undefined) {
      props[key] = fieldData;
    }
  }

  return props;
}
