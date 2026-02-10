/**
 * Validate create-asset params
 * 只支持 asset-templates.ts 中定义的资源类型
 */
import { ValidationError } from '../error.js';
import { isSupportedExtension, SUPPORTED_ASSET_EXTENSIONS } from '../../asset-templates.js';
export function validateCreateAsset(params) {
    if (params.length < 1) {
        throw new ValidationError('asset-db', 'create-asset', 'params', '至少需要 1 个参数：path');
    }
    if (params.length > 1) {
        throw new ValidationError('asset-db', 'create-asset', 'params', '只支持 1 个参数：path（data 参数已移除，系统会自动生成默认数据）');
    }
    const [path] = params;
    if (typeof path !== 'string') {
        throw new ValidationError('asset-db', 'create-asset', 'path', '必须是字符串类型');
    }
    if (!path.startsWith('db://assets/')) {
        throw new ValidationError('asset-db', 'create-asset', 'path', '必须以 db://assets/ 开头');
    }
    const extension = getFileExtension(path);
    if (!extension) {
        throw new ValidationError('asset-db', 'create-asset', 'path', '必须包含文件扩展名（如 .prefab、.scene、.material）');
    }
    // 检查文件扩展名是否在支持的类型列表中
    if (!isSupportedExtension(extension)) {
        throw new ValidationError('asset-db', 'create-asset', 'path', `不支持的资源类型：${extension}\n\n支持的类型：${SUPPORTED_ASSET_EXTENSIONS.join(', ')}\n\n其他资源类型请直接在编辑器中创建`);
    }
}
function getFileExtension(path) {
    const lastDotIndex = path.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return '';
    }
    return path.substring(lastDotIndex).toLowerCase();
}
//# sourceMappingURL=create-asset.validator.js.map