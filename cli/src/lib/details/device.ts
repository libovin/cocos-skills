/**
 * Device module action details
 */

import type { ActionDetail, ModuleActionDetails } from './types.js';

export const deviceDetails: ModuleActionDetails = {
  'query': {
    description: '查询连接的移动设备信息',
    parameters: [],
    examples: ['cocos-skills device query'],
    notes: '返回通过 USB 或网络连接的移动设备列表，用于真机预览和调试',
  },
};
