/**
 * Validate import-asset params
 */
import { ValidationError } from '../error.js';
const USAGE = `用法: cocos-skills asset-db import-asset <目标路径> <源文件路径>

示例:
  cocos-skills asset-db import-asset db://assets/textures/player.png C:/images/player.png
  cocos-skills asset-db import-asset db://assets/audio/bgm.mp3 /home/user/music/bgm.mp3`;
export function validateImportAsset(params) {
    if (params.length < 2) {
        throw new ValidationError('asset-db', 'import-asset', 'usage', `缺少参数，需要目标路径和源文件路径\n\n${USAGE}`);
    }
    const [path, importPath] = params;
    if (typeof path !== 'string') {
        throw new ValidationError('asset-db', 'import-asset', 'usage', `目标路径必须是字符串\n\n${USAGE}`);
    }
    if (!path.startsWith('db://assets/')) {
        throw new ValidationError('asset-db', 'import-asset', 'usage', `目标路径必须以 db://assets/ 开头\n\n${USAGE}`);
    }
    if (typeof importPath !== 'string') {
        throw new ValidationError('asset-db', 'import-asset', 'usage', `源文件路径必须是字符串\n\n${USAGE}`);
    }
    // 检查是否为绝对路径或 URL
    if (importPath.includes('\\') || importPath.includes('/')) {
        if (!importPath.includes(':') && !importPath.startsWith('/') && !importPath.match(/^[A-Za-z]:\\/)) {
            throw new ValidationError('asset-db', 'import-asset', 'usage', `源文件路径必须是绝对路径或 URL\n\n${USAGE}`);
        }
    }
}
//# sourceMappingURL=import-asset.validator.js.map