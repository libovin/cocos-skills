/**
 * Project module action details
 */
export const projectDetails = {
    'open-settings': {
        description: '打开项目设置面板',
        parameters: [],
        examples: ['cocos-skills project open-settings'],
        notes: '在编辑器中打开"项目设置"窗口，包含引擎、功能裁剪、项目数据等配置',
    },
    'query-config': {
        description: '查询项目配置',
        parameters: [],
        examples: ['cocos-skills project query-config'],
        notes: '返回项目设置的所有配置项，包括引擎版本、设计分辨率、物理配置等',
    },
    'set-config': {
        description: '设置项目配置值',
        parameters: [
            { name: 'key', type: 'string', required: true, description: '配置键路径，如 preview-width' },
            { name: 'value', type: 'any', required: true, description: '配置值，支持字符串、数字、布尔值等' },
        ],
        examples: [
            'cocos-skills project set-config "preview-width" 1280',
            'cocos-skills project set-config "preview-height" 720',
            'cocos-skills project set-config "start-scene" "db://assets/Main.scene"',
        ],
        notes: '常用配置: preview-width/height(预览分辨率)、start-scene(启动场景)、engine(引擎版本)',
    },
};
//# sourceMappingURL=project.js.map