/**
 * Validate remove-node params
 */

import { ValidationError } from '../error.js';

const USAGE = `用法: cocos-skills scene remove-node '<JSON配置>'

示例:
  cocos-skills scene remove-node '{"uuid":"<节点UUID>"}'
  cocos-skills scene remove-node '{"uuid":["<节点UUID1>","<节点UUID2>"]}'

字段说明:
  uuid - 节点UUID（必填，支持单个字符串或数组）`;

export function validateRemoveNode(params: unknown[]): void {
  if (params.length !== 1) {
    throw new ValidationError('scene', 'remove-node', 'usage', `需要提供一个 JSON 配置对象\n\n${USAGE}`);
  }

  const options = params[0];

  if (typeof options !== 'object' || options === null) {
    throw new ValidationError('scene', 'remove-node', 'usage', `参数必须是 JSON 对象\n\n${USAGE}`);
  }

  const { uuid } = options as Record<string, unknown>;

  // uuid 可以是字符串或字符串数组
  if (typeof uuid !== 'string' && !Array.isArray(uuid)) {
    throw new ValidationError('scene', 'remove-node', 'usage', `uuid 必须是字符串或数组\n\n${USAGE}`);
  }

  if (Array.isArray(uuid) && uuid.length === 0) {
    throw new ValidationError('scene', 'remove-node', 'usage', `uuid 数组不能为空\n\n${USAGE}`);
  }
}
