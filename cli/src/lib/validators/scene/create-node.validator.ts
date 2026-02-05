/**
 * Validate create-node params
 */

import { ValidationError } from '../error.js';

export function validateCreateNode(params: unknown[]): void {
  if (params.length !== 1) {
    throw new ValidationError('scene', 'create-node', 'params', '必须提供 1 个参数（JSON 对象）');
  }

  const options = params[0];

  if (typeof options !== 'object' || options === null) {
    throw new ValidationError('scene', 'create-node', 'params', '参数必须是对象类型');
  }

  const { parent, name, type, position } = options as Record<string, unknown>;

  if (parent !== undefined && typeof parent !== 'string') {
    throw new ValidationError('scene', 'create-node', 'parent', '必须是字符串类型');
  }

  if (name !== undefined && typeof name !== 'string') {
    throw new ValidationError('scene', 'create-node', 'name', '必须是字符串类型');
  }

  if (type !== undefined && typeof type !== 'string') {
    throw new ValidationError('scene', 'create-node', 'type', '必须是字符串类型');
  }

  if (type && !type.startsWith('cc.')) {
    throw new ValidationError('scene', 'create-node', 'type', '必须是有效的组件类型，以 cc. 开头（如 cc.Sprite、cc.Label）');
  }

  if (position !== undefined) {
    if (typeof position !== 'object' || position === null) {
      throw new ValidationError('scene', 'create-node', 'position', '必须是对象类型');
    }
    const pos = position as Record<string, unknown>;
    if (typeof pos.x !== 'number' || typeof pos.y !== 'number' || typeof pos.z !== 'number') {
      throw new ValidationError('scene', 'create-node', 'position', '必须包含 x, y, z 数字字段');
    }
  }
}
