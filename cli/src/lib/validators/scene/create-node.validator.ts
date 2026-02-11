/**
 * Validate create-node params
 */

import { ValidationError } from '../error.js';

const USAGE = `用法: cocos-skills scene create-node '<JSON配置>'

示例:
  cocos-skills scene create-node '{"parent":"<父节点UUID>","name":"Player"}'
  cocos-skills scene create-node '{"parent":"<父节点UUID>","name":"Enemy","components":["cc.Sprite"]}'

字段说明:
  parent     - 父节点UUID（必填）
  name       - 节点名称（可选）
  type       - 节点类型（可选）
  components - 组件列表（可选）`;

export function validateCreateNode(params: unknown[]): void {
  if (params.length !== 1) {
    throw new ValidationError('scene', 'create-node', 'usage', `需要提供一个 JSON 配置对象\n\n${USAGE}`);
  }

  const options = params[0];

  if (typeof options !== 'object' || options === null) {
    throw new ValidationError('scene', 'create-node', 'usage', `参数必须是 JSON 对象\n\n${USAGE}`);
  }

  const { parent, name, type, components } = options as Record<string, unknown>;

  if (typeof parent !== 'string' || parent.trim() === '') {
    throw new ValidationError('scene', 'create-node', 'usage', `parent 不能为空\n\n${USAGE}`);
  }

  if (name !== undefined && typeof name !== 'string') {
    throw new ValidationError('scene', 'create-node', 'usage', `name 必须是字符串\n\n${USAGE}`);
  }

  if (type !== undefined && typeof type !== 'string') {
    throw new ValidationError('scene', 'create-node', 'usage', `type 必须是字符串\n\n${USAGE}`);
  }

  if (components !== undefined) {
    if (!Array.isArray(components)) {
      throw new ValidationError('scene', 'create-node', 'usage', `components 必须是数组\n\n${USAGE}`);
    }
    for (const comp of components) {
      if (typeof comp !== 'string') {
        throw new ValidationError('scene', 'create-node', 'usage', `components 数组元素必须是字符串\n\n${USAGE}`);
      }
    }
  }
}
