/**
 * Preprocessor for asset-db/open-asset
 * 支持 UUID 或路径两种参数格式，自动转换
 */
import { ValidationError } from '../../validators/error.js';
/**
 * 检查字符串是否为 UUID 格式
 * Cocos Creator 支持两种 UUID 格式：
 * 1. 标准 UUID: 8-4-4-4-12 的十六进制字符（如：9f9d4dcb-2795-4781-aaea-c3d31ce699a1）
 * 2. 短 ID: 约22个字符的 base64-like 格式（如：c0y6F5f+pAvI805TdmxIjx）
 */
function isUuidLike(input) {
    // 标准 UUID 格式: 8-4-4-4-12
    const standardUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (standardUuidRegex.test(input)) {
        return true;
    }
    // 短 ID 格式: 约20-22个字符，包含字母、数字、+、/
    const shortIdRegex = /^[A-Za-z0-9+/]{20,22}$/i;
    return shortIdRegex.test(input);
}
/**
 * 检查字符串是否为路径格式
 * 支持 db:// 路径或文件系统绝对路径
 */
function isPathLike(input) {
    // db:// 路径
    if (input.startsWith('db://')) {
        return true;
    }
    // 绝对路径: Windows (C:\...) 或 Unix (/home/...)
    if (/^[A-Za-z]:\\/.test(input) || input.startsWith('/')) {
        return true;
    }
    return false;
}
/**
 * 将 UUID 转换为路径
 * 自动支持 UUID 或路径两种参数格式
 * 打开资源前自动保存当前场景的未保存更改
 */
export const assetDbOpenAssetPreprocessor = async (params, client) => {
    // 0. 在打开资源前，检查并保存当前场景的未保存更改
    try {
        const dirtyResponse = await client._request('POST', '/api/scene/query-dirty', {
            params: [],
        });
        if (dirtyResponse.success && dirtyResponse.data?.result === true) {
            console.log('检测到当前场景有未保存的更改，正在自动保存...');
            const saveResponse = await client._request('POST', '/api/scene/save-scene', {
                params: [],
            });
            if (saveResponse.success) {
                console.log('当前场景已自动保存');
            }
            else {
                console.warn('自动保存当前场景失败，但将继续打开资源');
            }
        }
    }
    catch (error) {
        // 如果检查或保存失败，记录警告但继续打开资源
        console.warn('检查当前场景状态时出错，将继续打开资源:', error instanceof Error ? error.message : error);
    }
    if (params.length < 1) {
        return params;
    }
    const [input] = params;
    if (typeof input !== 'string') {
        return params;
    }
    // 如果输入已经是路径格式，直接返回
    if (isPathLike(input)) {
        return params;
    }
    // 如果输入是 UUID 格式，需要转换为路径
    if (isUuidLike(input)) {
        try {
            const response = await client._request('POST', '/api/asset-db/query-url', {
                params: [input],
            });
            if (response.success && response.data) {
                // 返回转换后的路径
                return [response.data];
            }
            else {
                throw new ValidationError('asset-db', 'open-asset', 'path', `无效的 UUID：${input}\n` +
                    `建议使用资源路径打开，如：db://assets/scenes/Main.scene`);
            }
        }
        catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            // 如果查询失败，跳过转换让原始 API 提供错误信息
        }
    }
    return params;
};
