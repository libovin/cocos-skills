/**
 * Server module action details
 */

import type { ActionDetail, ModuleActionDetails } from './types.js';

export const serverDetails: ModuleActionDetails = {
  'query-ip-list': {
    description: '查询 HTTP 服务器可用的 IP 地址列表',
    parameters: [],
    examples: ['cocos-skills server query-ip-list'],
    notes: '返回本机所有可用的网络接口 IP 地址，用于选择服务器监听地址',
  },
  'query-port': {
    description: '查询 HTTP 服务器的端口号',
    parameters: [],
    examples: ['cocos-skills server query-port'],
    notes: '返回当前 HTTP 服务器监听的端口号（默认 5000 或 -1 表示自动分配）',
  },
};
