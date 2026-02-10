/**
 * Validate open-asset params
 * 验证 open-asset 参数，只允许打开 Cocos 内置的文件类型
 */
import { ValidationError } from '../error.js';
/**
 * Cocos Creator 支持的可打开的文件类型
 * 这些是可以在编辑器中打开的资源类型
 */
const VALID_OPENABLE_EXTENSIONS = new Set([
    // 场景和预制体
    '.scene',
    '.prefab',
    // 动画相关
    '.anim',
    '.animask',
    // 材质
    '.material',
    '.mtl',
    '.pmtl',
    // 图集
    '.pac',
    '.labelatlas',
    // // 脚本
    // '.ts',
    // '.js',
    // // 配置文件
    // '.json',
    // // 纹理 (可以在查看器中打开)
    // '.png',
    // '.jpg',
    // '.jpeg',
    // '.webp',
    // '.bmp',
    // // 音频 (可以在预览中播放)
    // '.mp3',
    // '.ogg',
    // '.wav',
    // '.m4a',
    // // 字体
    // '.ttf',
    // '.otf',
    // '.woff',
    // '.woff2',
    // 其他 Cocos 资源类型
    '.fire',
    '.asset',
    '.effect',
    '.mesh',
    '.spline',
    '.fnt',
    '.spriteframe',
    '.physics',
]);
/**
 * 获取文件扩展名
 */
function getFileExtension(path) {
    const lastDotIndex = path.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return '';
    }
    return path.substring(lastDotIndex).toLowerCase();
}
/**
 * 验证 open-asset 参数
 */
export function validateOpenAsset(params) {
    if (params.length < 1) {
        throw new ValidationError('asset-db', 'open-asset', 'params', '至少需要 1 个参数：path');
    }
    const [path] = params;
    if (typeof path !== 'string') {
        throw new ValidationError('asset-db', 'open-asset', 'path', '必须是字符串类型');
    }
    if (!path.startsWith('db://assets/')) {
        throw new ValidationError('asset-db', 'open-asset', 'path', '必须以 db://assets/ 开头');
    }
    const extension = getFileExtension(path);
    if (!extension) {
        throw new ValidationError('asset-db', 'open-asset', 'path', '必须包含文件扩展名。支持的文件类型: ' + Array.from(VALID_OPENABLE_EXTENSIONS).sort().join(', '));
    }
    if (!VALID_OPENABLE_EXTENSIONS.has(extension)) {
        throw new ValidationError('asset-db', 'open-asset', 'path', `不支持的文件类型: ${extension}。支持的文件类型: ` + Array.from(VALID_OPENABLE_EXTENSIONS).sort().join(', '));
    }
}
//# sourceMappingURL=open-asset.validator.js.map