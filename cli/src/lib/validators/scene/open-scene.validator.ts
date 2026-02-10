/**
 * Validate open-scene params
 * 验证 open-scene 参数
 */

import { ValidationError } from '../error.js';

/**
 * UUID 格式校验（Cocos Creator UUID 格式）
 *
 * Cocos Creator 支持两种 UUID 格式：
 * 1. 标准 UUID: 8-4-4-4-12 的十六进制字符（如：9f9d4dcb-2795-4781-aaea-c3d31ce699a1）
 * 2. 短 ID: 约22个字符的 base64-like 格式（如：c0y6F5f+pAvI805TdmxIjx, b4VlKmH4JPNYzVWFImoiKq）
 */
function isValidUUID(uuid: string): boolean {
  // 标准 UUID 格式: 8-4-4-4-12
  const standardUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (standardUuidRegex.test(uuid)) {
    return true;
  }

  // 短 ID 格式: 约20-22个字符，包含字母、数字、+、/
  // 这是 Cocos Creator 内部使用的压缩 UUID 格式
  const shortIdRegex = /^[A-Za-z0-9+/]{20,22}$/i;
  return shortIdRegex.test(uuid);
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

  // if (!isValidUUID(uuid)) {
  //   throw new ValidationError(
  //     'scene',
  //     'open-scene',
  //     'uuid',
  //     '必须是有效的 UUID 格式。支持两种格式：\n' +
  //     '1. 标准 UUID: 8-4-4-4-12 格式（如：9f9d4dcb-2795-4781-aaea-c3d31ce699a1）\n' +
  //     '2. 短 ID: 约20-22个字符（如：c0y6F5f+pAvI805TdmxIjx）\n' +
  //     '可以通过 query-node-tree 命令获取节点 UUID'
  //   );
  // }
}
