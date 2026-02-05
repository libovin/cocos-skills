/**
 * Validate remove-node params
 */

import { ValidationError } from '../error.js';

export function validateRemoveNode(params: unknown[]): void {
  if (params.length < 1) {
    throw new ValidationError('scene', 'remove-node', 'params', '至少需要 1 个参数：path');
  }

  const [path] = params;

  if (typeof path !== 'string') {
    throw new ValidationError('scene', 'remove-node', 'path', '必须是字符串类型');
  }

  if (!path.startsWith('/')) {
    throw new ValidationError('scene', 'remove-node', 'path', '必须是节点路径，以 / 开头（如 /Canvas/OldNode）');
  }

  if (path === '/') {
    throw new ValidationError('scene', 'remove-node', 'path', '不能删除根节点');
  }
}
