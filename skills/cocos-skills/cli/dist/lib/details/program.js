/**
 * Program module action details
 */
export const programDetails = {
    'query-program-info': {
        description: '查询可用的外部程序列表',
        parameters: [],
        examples: ['cocos-skills program query-program-info'],
        notes: '返回配置的外部程序路径，如代码编辑器、图像处理工具等',
    },
    'open-program': {
        description: '打开配置的外部程序',
        parameters: [
            { name: 'name', type: 'string', required: true, description: '程序名称或别名' },
        ],
        examples: [
            'cocos-skills program open-program "code"',
            'cocos-skills program open-program "vscode"',
            'cocos-skills program open-program "photoshop"',
        ],
        notes: '打开在偏好设置中配置的外部程序。常用: code(VS Code)、vscode、sublime、atom 等',
    },
    'open-url': {
        description: '在默认浏览器中打开 URL',
        parameters: [
            { name: 'url', type: 'string', required: true, description: '要打开的 URL 地址' },
        ],
        examples: [
            'cocos-skills program open-url "https://www.cocos.com"',
            'cocos-skills program open-url "https://docs.cocos.com/creator/manual/zh/"',
        ],
        notes: '使用系统默认浏览器打开指定的 URL',
    },
};
//# sourceMappingURL=program.js.map