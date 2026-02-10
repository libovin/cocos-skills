/**
 * Validate save-asset params
 * 验证 save-asset 参数，只允许保存 Cocos 支持的文件类型
 */

import { ValidationError } from '../error.js';

/**
 * Cocos Creator 支持的可保存的文件类型
 * 这些是可以通过 save-asset 命令保存的资源类型
 */
const VALID_SAVEABLE_EXTENSIONS = new Set([
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

  // // 配置文件
  // '.json',

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
function getFileExtension(path: string): string {
  const lastDotIndex = path.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return '';
  }
  return path.substring(lastDotIndex).toLowerCase();
}

/**
 * 验证 save-asset 参数
 */
export function validateSaveAsset(params: unknown[]): void {
  if (params.length < 1) {
    throw new ValidationError('asset-db', 'save-asset', 'params', '至少需要 1 个参数：path（content 参数可选，如未提供将自动生成默认值）');
  }

  const [path, content] = params;

  if (typeof path !== 'string') {
    throw new ValidationError('asset-db', 'save-asset', 'path', '必须是字符串类型');
  }

  if (!path.startsWith('db://assets/')) {
    throw new ValidationError('asset-db', 'save-asset', 'path', '必须以 db://assets/ 开头');
  }

  const extension = getFileExtension(path);

  if (!extension) {
    throw new ValidationError(
      'asset-db',
      'save-asset',
      'path',
      '必须包含文件扩展名。支持的文件类型: ' + Array.from(VALID_SAVEABLE_EXTENSIONS).sort().join(', ')
    );
  }

  if (!VALID_SAVEABLE_EXTENSIONS.has(extension)) {
    throw new ValidationError(
      'asset-db',
      'save-asset',
      'path',
      `不支持的文件类型: ${extension}。支持的文件类型: ` + Array.from(VALID_SAVEABLE_EXTENSIONS).sort().join(', ')
    );
  }

  // 如果提供了 content 参数，验证其类型
  if (content !== undefined) {
    if (typeof content !== 'string' && !Buffer.isBuffer(content)) {
      throw new ValidationError('asset-db', 'save-asset', 'content', '必须是字符串类型或 Buffer');
    }
  }
}
