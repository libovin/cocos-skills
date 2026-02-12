/**
 * Validate open-asset params
 */
import { ValidationError } from '../error.js';
const VALID_EXTENSIONS = new Set([
    '.scene', '.prefab', '.anim', '.animask',
    '.material', '.mtl', '.pmtl',
    '.pac', '.labelatlas',
    '.fire', '.asset', '.effect', '.mesh', '.spline', '.fnt', '.spriteframe', '.physics',
]);
const USAGE = `用法: cocos-skills asset-db open-asset <资源路径>

示例:
  cocos-skills asset-db open-asset db://assets/scenes/Main.scene
  cocos-skills asset-db open-asset db://assets/prefabs/Player.prefab

支持的类型: ${Array.from(VALID_EXTENSIONS).sort().join(', ')}`;
function getFileExtension(path) {
    const idx = path.lastIndexOf('.');
    return idx === -1 ? '' : path.substring(idx).toLowerCase();
}
export function validateOpenAsset(params) {
    if (params.length < 1) {
        throw new ValidationError('asset-db', 'open-asset', 'usage', `缺少资源路径\n\n${USAGE}`);
    }
    const [path] = params;
    if (typeof path !== 'string') {
        throw new ValidationError('asset-db', 'open-asset', 'usage', `资源路径必须是字符串\n\n${USAGE}`);
    }
    if (!path.startsWith('db://assets/')) {
        throw new ValidationError('asset-db', 'open-asset', 'usage', `资源路径必须以 db://assets/ 开头\n\n${USAGE}`);
    }
    const ext = getFileExtension(path);
    if (!ext) {
        throw new ValidationError('asset-db', 'open-asset', 'usage', `资源路径需要包含扩展名\n\n${USAGE}`);
    }
    if (!VALID_EXTENSIONS.has(ext)) {
        throw new ValidationError('asset-db', 'open-asset', 'usage', `不支持的文件类型: ${ext}\n\n${USAGE}`);
    }
}
