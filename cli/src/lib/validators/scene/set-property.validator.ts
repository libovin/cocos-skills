/**
 * Validate set-property params
 */

import { ValidationError } from '../error.js';

export function validateSetProperty(params: unknown[]): void {
  if (params.length !== 1) {
    throw new ValidationError('scene', 'set-property', 'params', '必须提供 1 个参数（SetPropertyOptions 对象）');
  }

  const options = params[0];

  if (typeof options !== 'object' || options === null) {
    throw new ValidationError('scene', 'set-property', 'params', '参数必须是对象类型');
  }

  const { uuid, path, dump, component, properties } = options as Record<string, unknown>;

  // Validate uuid (required for both formats)
  if (typeof uuid !== 'string') {
    throw new ValidationError('scene', 'set-property', 'uuid', '必须是字符串类型');
  }

  if (uuid.trim() === '') {
    throw new ValidationError('scene', 'set-property', 'uuid', '不能为空');
  }

  // Check if using batch format (component + properties)
  const isBatchFormat = component !== undefined || properties !== undefined;

  if (isBatchFormat) {
    // Validate batch format
    if (typeof component !== 'string') {
      throw new ValidationError('scene', 'set-property', 'component', '必须是字符串类型');
    }

    if (component.trim() === '') {
      throw new ValidationError('scene', 'set-property', 'component', '不能为空');
    }

    if (!Array.isArray(properties)) {
      throw new ValidationError('scene', 'set-property', 'properties', '必须是数组类型');
    }

    if (properties.length === 0) {
      throw new ValidationError('scene', 'set-property', 'properties', '不能为空数组');
    }

    // Validate each property
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      if (typeof prop !== 'object' || prop === null) {
        throw new ValidationError('scene', 'set-property', `properties[${i}]`, '必须是对象类型');
      }

      const propObj = prop as Record<string, unknown>;

      if (typeof propObj.name !== 'string') {
        throw new ValidationError('scene', 'set-property', `properties[${i}].name`, '必须是字符串类型');
      }

      if (propObj.name.trim() === '') {
        throw new ValidationError('scene', 'set-property', `properties[${i}].name`, '不能为空');
      }

      if (!('value' in propObj)) {
        throw new ValidationError('scene', 'set-property', `properties[${i}].value`, '必须包含 value 字段');
      }

      if (typeof propObj.type !== 'string') {
        throw new ValidationError('scene', 'set-property', `properties[${i}].type`, '必须是字符串类型');
      }

      if (propObj.type.trim() === '') {
        throw new ValidationError('scene', 'set-property', `properties[${i}].type`, '不能为空');
      }
    }
  } else {
    // Validate traditional format (path + dump)
    if (typeof path !== 'string') {
      throw new ValidationError('scene', 'set-property', 'path', '必须是字符串类型');
    }

    if (path.trim() === '') {
      throw new ValidationError('scene', 'set-property', 'path', '不能为空');
    }

    if (dump === undefined) {
      throw new ValidationError('scene', 'set-property', 'dump', '必须提供属性值');
    }

    if (typeof dump !== 'object' || dump === null) {
      throw new ValidationError('scene', 'set-property', 'dump', '必须是对象类型，包含 value 和 type 字段');
    }

    const dumpObj = dump as Record<string, unknown>;

    if (!('value' in dumpObj)) {
      throw new ValidationError('scene', 'set-property', 'dump.value', '必须包含 value 字段');
    }

    if (!('type' in dumpObj)) {
      throw new ValidationError('scene', 'set-property', 'dump.type', '必须包含 type 字段');
    }

    if (typeof dumpObj.type !== 'string') {
      throw new ValidationError('scene', 'set-property', 'dump.type', 'type 必须是字符串类型');
    }

    if (dumpObj.type.trim() === '') {
      throw new ValidationError('scene', 'set-property', 'dump.type', 'type 不能为空');
    }
  }
}
