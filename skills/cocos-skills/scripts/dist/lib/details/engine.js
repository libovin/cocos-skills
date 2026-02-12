/**
 * Engine module action details
 */
export const engineDetails = {
    'query-info': {
        description: '查询引擎基本信息',
        parameters: [],
        examples: ['cocos-skills engine query-info'],
        notes: '返回 Cocos Creator 引擎版本号，如 "3.8.0"',
    },
    'query-engine-info': {
        description: '查询引擎详细信息和安装路径',
        parameters: [],
        examples: ['cocos-skills engine query-engine-info'],
        notes: '返回引擎版本、安装路径、原生引擎路径等完整信息',
    },
};
