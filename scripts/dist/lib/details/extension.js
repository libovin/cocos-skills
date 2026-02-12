/**
 * Extension module action details
 */
export const extensionDetails = {
    'create-extension-template': {
        description: '创建扩展模板',
        parameters: [
            { name: 'name', type: 'string', required: true, description: '扩展名称' },
            { name: 'type', type: 'string', required: false, description: '扩展类型（可选），默认为 hello-world' },
        ],
        examples: [
            'cocos-skills extension create-extension-template my-extension',
            'cocos-skills extension create-extension-template my-extension hello-world',
            'cocos-skills extension create-extension-template build-tools build-panel',
        ],
        notes: '在项目 extensions 目录下创建扩展模板。常用类型: hello-world、build-panel、custom-panel。参数按位置传递：第一个为扩展名称，第二个为扩展类型（可选）',
    },
};
