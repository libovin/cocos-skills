/**
 * Postprocessor for scene/query-node
 * 简化 query-node 返回结果
 *
 * 原始结构：{ uuid: { value: "xxx" }, name: { value: "xxx" }, position: { x, y, z }, components: [{ type: "xxx" }] }
 * 简化后：  { uuid: "xxx", name: "xxx", position: { x, y, z }, components: ["xxx"] }
 */

import type { PostprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import type { ApiResponse } from '../../../types.js';

/**
 * 简化后的组件信息
 */
interface SimplifiedComponent {
  type: string;
  uuid?: string;
  enabled?: boolean;
  props?: Record<string, unknown>;
}

/**
 * 简化后的节点信息
 */
interface SimplifiedNode {
  uuid: string;
  name: string;
  active?: boolean;
  position?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  parent?: string;
  components?: SimplifiedComponent[];
}

/**
 * 提取包装值的字段（如 uuid.value, name.value）
 */
function getWrappedValue(field: unknown): string | undefined {
  if (typeof field === 'string') return field;
  if (field && typeof field === 'object' && 'value' in field) {
    const value = (field as Record<string, unknown>).value;
    if (typeof value === 'string') return value;
  }
  return undefined;
}

/**
 * 提取布尔值的字段
 */
function getBooleanValue(field: unknown): boolean | undefined {
  if (typeof field === 'boolean') return field;
  if (field && typeof field === 'object' && 'value' in field) {
    const value = (field as Record<string, unknown>).value;
    if (typeof value === 'boolean') return value;
  }
  return undefined;
}

/**
 * 提取向量值（position, scale, rotation）
 */
function getVectorValue(field: unknown): { x: number; y: number; z: number } | undefined {
  if (!field || typeof field !== 'object') return undefined;

  // 直接是 { x, y, z } 格式
  if ('x' in field && 'y' in field && 'z' in field) {
    const obj = field as Record<string, unknown>;
    if (typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number') {
      return { x: obj.x, y: obj.y, z: obj.z };
    }
  }

  // 包装在 value 中 { value: { x, y, z } }
  if ('value' in field) {
    const inner = (field as Record<string, unknown>).value;
    if (inner && typeof inner === 'object') {
      if ('x' in inner && 'y' in inner && 'z' in inner) {
        const obj = inner as Record<string, unknown>;
        if (typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number') {
          return { x: obj.x, y: obj.y, z: obj.z };
        }
      }
    }
  }

  return undefined;
}

/**
 * 提取父节点 UUID
 */
function getParentUuid(field: unknown): string | undefined {
  if (!field || typeof field !== 'object') return undefined;

  // { value: { uuid: "xxx" } }
  if ('value' in field) {
    const inner = (field as Record<string, unknown>).value;
    if (inner && typeof inner === 'object' && 'uuid' in inner) {
      const uuid = (inner as Record<string, unknown>).uuid;
      if (typeof uuid === 'string') return uuid;
    }
  }

  return undefined;
}

/**
 * 解包单个值（处理 { value: ... } 结构）
 */
function unwrapValue(item: unknown): unknown {
  if (item && typeof item === 'object' && 'value' in item) {
    return (item as Record<string, unknown>).value;
  }
  return item;
}

/**
 * 从组件 value 中提取所有属性
 * 自动解包 value 字段，跳过内部字段
 */
function extractComponentProps(compValue: Record<string, unknown>): Record<string, unknown> {
  const props: Record<string, unknown> = {};

  // 跳过的内部字段
  const skipFields = [
    'uuid', 'name', 'enabled', '_objFlags', '__scriptAsset', 'node', '_enabled', '_name',
  ];

  for (const [key, fieldData] of Object.entries(compValue)) {
    // 跳过内部字段和 _ 开头的字段
    if (skipFields.includes(key) || key.startsWith('_')) continue;

    // 如果是包装值 { value: ... }
    if (fieldData && typeof fieldData === 'object' && 'value' in fieldData && !Array.isArray(fieldData)) {
      const value = (fieldData as Record<string, unknown>).value;
      // 如果解包后的值是数组，需要继续处理数组元素
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
      // 处理数组：对每个元素进行解包
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

/**
 * 从 __comps__ 字段提取组件详细信息
 * __comps__ 结构：[{ value: {...}, type: "cc.UITransform" }, ...]
 */
function getComponentDetails(field: unknown): SimplifiedComponent[] | undefined {
  if (!Array.isArray(field)) return undefined;

  const components: SimplifiedComponent[] = [];
  for (const item of field) {
    if (!item || typeof item !== 'object') continue;

    const type = (item as Record<string, unknown>).type;
    const value = (item as Record<string, unknown>).value;

    if (typeof type !== 'string') continue;
    if (!value || typeof value !== 'object') continue;

    const comp: SimplifiedComponent = { type };

    // 提取 uuid
    const uuidField = (value as Record<string, unknown>).uuid;
    if (uuidField && typeof uuidField === 'object' && 'value' in uuidField) {
      const uuidVal = (uuidField as Record<string, unknown>).value;
      if (typeof uuidVal === 'string') comp.uuid = uuidVal;
    }

    // 提取 enabled
    const enabledField = (value as Record<string, unknown>).enabled;
    if (enabledField && typeof enabledField === 'object' && 'value' in enabledField) {
      const enabledVal = (enabledField as Record<string, unknown>).value;
      if (typeof enabledVal === 'boolean') comp.enabled = enabledVal;
    }

    // 提取其他属性
    const props = extractComponentProps(value as Record<string, unknown>);
    if (Object.keys(props).length > 0) {
      comp.props = props;
    }

    components.push(comp);
  }

  return components.length > 0 ? components : undefined;
}

/**
 * 简化 query-node 返回结果
 */
export const sceneQueryNodePostprocessor: PostprocessorFn = async (
  result: ApiResponse,
  _originalParams: unknown[],
  _client: CocosClient
): Promise<ApiResponse> => {
  if (!result.success || !result.data) {
    return result;
  }

  const data = result.data as Record<string, unknown>;

  // 提取并简化所有字段
  const simplified: Partial<SimplifiedNode> = {};

  // 必填字段
  const uuid = getWrappedValue(data.uuid);
  const name = getWrappedValue(data.name);
  if (!uuid || !name) {
    // 如果无法提取基本信息，返回原始结果
    return result;
  }
  simplified.uuid = uuid;
  simplified.name = name;

  // 可选字段
  const active = getBooleanValue(data.active);
  if (active !== undefined) simplified.active = active;

  const position = getVectorValue(data.position);
  if (position) simplified.position = position;

  const scale = getVectorValue(data.scale);
  if (scale) simplified.scale = scale;

  const rotation = getVectorValue(data.rotation);
  if (rotation) simplified.rotation = rotation;

  const parentUuid = getParentUuid(data.parent);
  if (parentUuid) simplified.parent = parentUuid;

  const components = getComponentDetails(data.__comps__);
  if (components) simplified.components = components;

  return {
    ...result,
    data: simplified,
  };
};
