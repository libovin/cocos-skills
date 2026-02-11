/**
 * Validate create-asset params
 * 只支持 asset-templates.ts 中定义的资源类型
 */

import { ValidationError } from '../error.js';
import { isSupportedExtension, SUPPORTED_ASSET_EXTENSIONS } from '../../asset-templates.js';

const USAGE = `用法: cocos-skills asset-db create-asset <资源路径>

示例:
  cocos-skills asset-db create-asset db://assets/scenes/Main.scene
  cocos-skills asset-db create-asset db://assets/prefabs/Player.prefab
  cocos-skills asset-db create-asset db://assets/materials/Gold.material`;

export function validateCreateAsset(params: unknown[]): void {
  // 检查参数数量
  if (params.length < 1) {
    throw new ValidationError('asset-db', 'create-asset', 'usage', `缺少资源路径\n\n${USAGE}`);
  }

  if (params.length > 1) {
    throw new ValidationError('asset-db', 'create-asset', 'usage', `只需提供一个资源路径\n\n${USAGE}`);
  }

  const [path] = params;

  // 检查类型
  if (typeof path !== 'string') {
    throw new ValidationError('asset-db', 'create-asset', 'usage', `资源路径必须是字符串\n\n${USAGE}`);
  }

  // 检查路径格式
  if (!path.startsWith('db://assets/')) {
    throw new ValidationError('asset-db', 'create-asset', 'usage', `资源路径必须以 db://assets/ 开头\n\n${USAGE}`);
  }

  // 检查扩展名
  const extension = getFileExtension(path);
  if (!extension) {
    throw new ValidationError('asset-db', 'create-asset', 'usage', `资源路径需要包含扩展名（如 .prefab、.scene）\n\n${USAGE}`);
  }

  // 检查是否为支持的类型
  if (!isSupportedExtension(extension)) {
    throw new ValidationError(
      'asset-db',
      'create-asset',
      'usage',
      `不支持的资源类型: ${extension}

支持的类型: ${SUPPORTED_ASSET_EXTENSIONS.join(', ')}
其他类型请在编辑器中手动创建`
    );
  }
}

function getFileExtension(path: string): string {
  const lastDotIndex = path.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return '';
  }
  return path.substring(lastDotIndex).toLowerCase();
}
