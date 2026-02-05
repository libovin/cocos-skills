/**
 * Preferences module action details
 */

import type { ActionDetail, ModuleActionDetails } from './types.js';

export const preferencesDetails: ModuleActionDetails = {
  'open-settings': {
    description: '打开偏好设置面板',
    parameters: [],
    examples: ['cocos-skills preferences open-settings'],
    notes: '在编辑器中打开"偏好设置"窗口，包含编辑器外观、快捷键、界面等配置',
  },
  'query-config': {
    description: '查询偏好设置配置',
    parameters: [],
    examples: ['cocos-skills preferences query-config'],
    notes: '返回编辑器的所有偏好设置，如语言、主题、字体大小等',
  },
  'set-config': {
    description: '设置偏好配置值',
    parameters: [
      { name: 'key', type: 'string', required: true, description: '配置键路径' },
      { name: 'value', type: 'any', required: true, description: '配置值' },
    ],
    examples: [
      'cocos-skills preferences set-config "editor.language" "zh-CN"',
      'cocos-skills preferences set-config "editor.theme" "dark"',
      'cocos-skills preferences set-config "editor.fontSize" 14',
    ],
    notes: '常用配置: editor.language(语言)、editor.theme(主题)、editor.fontSize(字体大小)',
  },
};
