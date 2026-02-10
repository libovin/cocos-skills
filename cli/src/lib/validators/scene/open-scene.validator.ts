/**
 * Validate open-scene params
 * 验证 open-scene 参数
 */

import { ValidationError } from '../error.js';

/**
 * UUID 格式校验（Cocos Creator UUID 格式）
 * Cocos Creator UUID 格式: 8-4-4-4-12 的十六进制字符
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * 验证 open-scene 参数
 */
export function validateOpenScene(params: unknown[]): void {
  if (params.length < 1) {
    throw new ValidationError('scene', 'open-scene', 'params', '至少需要 1 个参数：uuid（节点 UUID）');
  }

  const [uuid] = params;

  if (typeof uuid !== 'string') {
    throw new ValidationError('scene', 'open-scene', 'uuid', '必须是字符串类型');
  }

  if (!isValidUUID(uuid)) {
    throw new ValidationError(
      'scene',
      'open-scene',
      'uuid',
      '必须是有效的 UUID 格式（8-4-4-4-12 的十六进制字符，如：a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6）。可以通过 query-node-tree 命令获取节点 UUID'
    );
  }
}
