/**
 * Information module action details
 */
export const informationDetails = {
    'query-information': {
        description: '查询当前显示的信息对话框内容',
        parameters: [],
        examples: ['cocos-skills information query-information'],
        notes: '返回信息对话框的类型、消息内容等信息',
    },
    'open-information-dialog': {
        description: '打开信息对话框',
        parameters: [
            { name: 'type', type: 'string', required: true, description: '对话框类型：info、warning、error、none' },
            { name: 'message', type: 'string', required: true, description: '消息内容' },
        ],
        examples: [
            'cocos-skills information open-information-dialog info "操作成功完成"',
            'cocos-skills information open-information-dialog warning "请注意检查配置"',
            'cocos-skills information open-information-dialog error "操作失败"',
        ],
        notes: '在编辑器中显示信息提示框，type 支持: info、warning、error、none',
    },
    'has-dialog': {
        description: '检查是否存在信息对话框',
        parameters: [],
        examples: ['cocos-skills information has-dialog'],
        notes: '返回布尔值，表示当前是否有信息对话框正在显示',
    },
    'close-dialog': {
        description: '关闭当前的信息对话框',
        parameters: [],
        examples: ['cocos-skills information close-dialog'],
        notes: '关闭当前正在显示的信息对话框',
    },
};
