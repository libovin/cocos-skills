/**
 * Validate import-asset params
 */
import { ValidationError } from '../error.js';
export function validateImportAsset(params) {
    if (params.length < 2) {
        throw new ValidationError('asset-db', 'import-asset', 'params', '至少需要 2 个参数：path 和 importPath');
    }
    const [path, importPath] = params;
    if (typeof path !== 'string') {
        throw new ValidationError('asset-db', 'import-asset', 'path', '必须是字符串类型');
    }
    if (!path.startsWith('db://assets/')) {
        throw new ValidationError('asset-db', 'import-asset', 'path', '必须以 db://assets/ 开头');
    }
    if (typeof importPath !== 'string') {
        throw new ValidationError('asset-db', 'import-asset', 'importPath', '必须是字符串类型');
    }
    if (importPath.includes('\\') || importPath.includes('/')) {
        if (!importPath.includes(':') && !importPath.startsWith('/') && !importPath.match(/^[A-Za-z]:\\/)) {
            throw new ValidationError('asset-db', 'import-asset', 'importPath', '必须是绝对路径或 URL');
        }
    }
}
//# sourceMappingURL=import-asset.validator.js.map