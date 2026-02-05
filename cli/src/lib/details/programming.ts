/**
 * Programming module action details
 */

import type { ActionDetail, ModuleActionDetails } from './types.js';

export const programmingDetails: ModuleActionDetails = {
  'query-shared-settings': {
    description: '查询共享的编程设置',
    parameters: [],
    examples: ['cocos-skills programming query-shared-settings'],
    notes: '返回编程相关的共享设置，如代码风格、脚本编译选项等',
  },
  'query-sorted-plugins': {
    description: '查询排序后的插件列表',
    parameters: [],
    examples: ['cocos-skills programming query-sorted-plugins'],
    notes: '返回项目中所有插件的排序列表，包括内置插件和自定义插件',
  },
};
