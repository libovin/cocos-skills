/**
 * Builder module action details
 */

import type { ActionDetail, ModuleActionDetails } from './types.js';

export const builderDetails: ModuleActionDetails = {
  'open': {
    description: '打开构建面板',
    parameters: [],
    examples: ['cocos-skills builder open'],
    notes: '在编辑器中打开"项目构建"面板，用于配置和执行游戏构建',
  },
  'query-worker-ready': {
    description: '查询构建 worker 是否准备就绪',
    parameters: [],
    examples: ['cocos-skills builder query-worker-ready'],
    notes: '构建系统使用 worker 进行后台处理，此接口检查 worker 状态',
  },
};
