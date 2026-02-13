/**
 * Validate set-property params
 * 只支持批量模式
 */

import { ValidationError } from '../error.js';
import { isValidProperty, getPropertiesForComponent, isBuiltinComponent } from './component-properties.js';

const USAGE = `用法: cocos-skills scene set-property '<JSON配置>'

示例（设置节点属性，component 可省略）:
  cocos-skills scene set-property '{"uuid":"xxx","properties":[{"name":"position","value":[0,0,0],"type":"Vec3"}]}'

示例（设置组件属性）:
  cocos-skills scene set-property '{"uuid":"xxx","component":"cc.Sprite","properties":[{"name":"color","value":[255,0,0,255],"type":"Color"}]}'

示例（设置自定义脚本属性）:
  cocos-skills scene set-property '{"uuid":"xxx","component":"MyScript","properties":[{"name":"speed","value":100,"type":"Number"}]}'

字段说明:
  uuid       - 节点UUID（必填）
  component  - 组件类型（可选，默认为 cc.Node）
  properties - 属性数组，每项包含 name、value、type

内置组件类型:
  cc.Node, cc.UITransform, cc.Sprite, cc.Label, cc.Button, cc.Widget,
  cc.Layout, cc.RichText, cc.EditBox, cc.Slider, cc.ProgressBar, cc.Toggle,
  cc.ToggleContainer, cc.ScrollView, cc.PageView, cc.Mask, cc.Camera,
  cc.Animation, cc.AudioSource, cc.RigidBody2D, cc.BoxCollider2D,
  cc.CircleCollider2D, cc.ParticleSystem2D

注意: 自定义脚本组件的属性名将动态查询验证`;

function buildPropertyHint(componentType: string): string {
  const props = getPropertiesForComponent(componentType);
  if (props.length === 0) {
    return '';
  }
  const propList = props.map((p) => `  ${p.name}: ${p.type}`).join('\n');
  return `\n\n${componentType} 支持的属性:\n${propList}`;
}

export function validateSetProperty(params: unknown[]): void {
  if (params.length !== 1) {
    throw new ValidationError('scene', 'set-property', 'usage', `需要提供一个 JSON 配置对象\n\n${USAGE}`);
  }

  const options = params[0];

  if (typeof options !== 'object' || options === null) {
    throw new ValidationError('scene', 'set-property', 'usage', `参数必须是 JSON 对象\n\n${USAGE}`);
  }

  const { uuid, component, properties } = options as Record<string, unknown>;

  if (typeof uuid !== 'string' || uuid.trim() === '') {
    throw new ValidationError('scene', 'set-property', 'usage', `uuid 不能为空\n\n${USAGE}`);
  }

  // component 是可选的，默认为 cc.Node
  const actualComponent = (component as string | undefined) ?? 'cc.Node';
  
  if (component !== undefined && typeof component !== 'string') {
    throw new ValidationError('scene', 'set-property', 'usage', `component 必须是字符串\n\n${USAGE}`);
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
    
    // 只对内置组件进行属性验证，自定义脚本组件跳过验证（由 preprocessor 动态查询）
    if (isBuiltinComponent(actualComponent) && !isValidProperty(actualComponent, p.name)) {
      const hint = buildPropertyHint(actualComponent);
      throw new ValidationError(
        'scene',
        'set-property',
        'usage',
        `属性名 "${p.name}" 无效${hint}`
      );
    }
  }
}
