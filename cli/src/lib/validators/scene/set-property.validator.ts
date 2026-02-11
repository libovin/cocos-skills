/**
 * Validate set-property params
 */

import { ValidationError } from '../error.js';

const USAGE = `用法: cocos-skills scene set-property '<JSON配置>'

示例（单属性）:
  cocos-skills scene set-property '{"uuid":"xxx","path":"position","dump":{"value":[0,0,0],"type":"Vec3"}}'

示例（批量设置）:
  cocos-skills scene set-property '{"uuid":"xxx","component":"cc.Sprite","properties":[{"name":"color","value":[255,0,0,255],"type":"Color"}]}'

字段说明:
  uuid       - 节点UUID（必填）
  path       - 属性路径（单属性模式）
  dump       - 属性值对象，包含 value 和 type（单属性模式）
  component  - 组件类型（批量模式）
  properties - 属性数组，每项包含 name、value、type（批量模式）`;

export function validateSetProperty(params: unknown[]): void {
  if (params.length !== 1) {
    throw new ValidationError('scene', 'set-property', 'usage', `需要提供一个 JSON 配置对象\n\n${USAGE}`);
  }

  const options = params[0];

  if (typeof options !== 'object' || options === null) {
    throw new ValidationError('scene', 'set-property', 'usage', `参数必须是 JSON 对象\n\n${USAGE}`);
  }

  const { uuid, path, dump, component, properties } = options as Record<string, unknown>;

  if (typeof uuid !== 'string' || uuid.trim() === '') {
    throw new ValidationError('scene', 'set-property', 'usage', `uuid 不能为空\n\n${USAGE}`);
  }

  const isBatch = component !== undefined || properties !== undefined;

  if (isBatch) {
    // 批量模式
    if (typeof component !== 'string' || component.trim() === '') {
      throw new ValidationError('scene', 'set-property', 'usage', `component 不能为空\n\n${USAGE}`);
    }

    if (!Array.isArray(properties) || properties.length === 0) {
      throw new ValidationError('scene', 'set-property', 'usage', `properties 必须是非空数组\n\n${USAGE}`);
    }

    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      if (typeof prop !== 'object' || prop === null) {
        throw new ValidationError('scene', 'set-property', 'usage', `properties[${i}] 必须是对象\n\n${USAGE}`);
      }
      const p = prop as Record<string, unknown>;
      if (typeof p.name !== 'string' || p.name.trim() === '') {
        throw new ValidationError('scene', 'set-property', 'usage', `properties[${i}].name 不能为空\n\n${USAGE}`);
      }
      if (!('value' in p)) {
        throw new ValidationError('scene', 'set-property', 'usage', `properties[${i}] 缺少 value\n\n${USAGE}`);
      }
      if (typeof p.type !== 'string' || p.type.trim() === '') {
        throw new ValidationError('scene', 'set-property', 'usage', `properties[${i}].type 不能为空\n\n${USAGE}`);
      }
    }
  } else {
    // 单属性模式
    if (typeof path !== 'string' || path.trim() === '') {
      throw new ValidationError('scene', 'set-property', 'usage', `path 不能为空\n\n${USAGE}`);
    }

    if (typeof dump !== 'object' || dump === null) {
      throw new ValidationError('scene', 'set-property', 'usage', `dump 必须是对象，包含 value 和 type\n\n${USAGE}`);
    }

    const d = dump as Record<string, unknown>;
    if (!('value' in d)) {
      throw new ValidationError('scene', 'set-property', 'usage', `dump 缺少 value 字段\n\n${USAGE}`);
    }
    if (!('type' in d) || typeof d.type !== 'string' || d.type.trim() === '') {
      throw new ValidationError('scene', 'set-property', 'usage', `dump.type 不能为空\n\n${USAGE}`);
    }
  }
}
