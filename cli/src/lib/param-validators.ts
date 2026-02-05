/**
 * Parameter validation for specific actions
 * Validates params before sending to Cocos Creator API
 */

import { VALID_MODULES } from '../types.js';

/**
 * Validation error
 */
export class ValidationError extends Error {
  constructor(
    public module: string,
    public action: string,
    public field: string,
    message: string
  ) {
    super(`[${module}/${action}] ${field}: ${message}`);
    this.name = 'ValidationError';
  }
}

/**
 * Validate create-asset params
 */
function validateCreateAsset(params: unknown[]): void {
  if (params.length < 2) {
    throw new ValidationError('asset-db', 'create-asset', 'params', '至少需要 2 个参数：path 和 data');
  }

  const [path, data] = params;

  // Validate path
  if (typeof path !== 'string') {
    throw new ValidationError('asset-db', 'create-asset', 'path', '必须是字符串类型');
  }

  if (!path.startsWith('db://assets/')) {
    throw new ValidationError('asset-db', 'create-asset', 'path', '必须以 db://assets/ 开头');
  }

  if (!path.includes('.')) {
    throw new ValidationError('asset-db', 'create-asset', 'path', '必须包含文件扩展名（如 .prefab、.scene、.png）');
  }

  // Validate data
  if (typeof data !== 'object' || data === null) {
    throw new ValidationError('asset-db', 'create-asset', 'data', '必须是对象类型');
  }

  if (!('__type__' in data)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', '必须包含 __type__ 字段（如 cc.Prefab、cc.SceneAsset）');
  }

  const validTypes = [
    'cc.Prefab', 'cc.SceneAsset', 'cc.Asset',
    'cc.SpriteFrame', 'cc.Texture2D', 'cc.AudioClip',
    'cc.AnimationClip', 'cc.Font', 'cc.Material',
  ];

  if (typeof data.__type__ !== 'string' || !data.__type__.startsWith('cc.')) {
    throw new ValidationError('asset-db', 'create-asset', 'data.__type__', `必须是有效的 Cocos Creator 类型（如 ${validTypes.slice(0, 3).join(', ')} 等）`);
  }
}

/**
 * Validate import-asset params
 */
function validateImportAsset(params: unknown[]): void {
  if (params.length < 2) {
    throw new ValidationError('asset-db', 'import-asset', 'params', '至少需要 2 个参数：path 和 importPath');
  }

  const [path, importPath] = params;

  // Validate path
  if (typeof path !== 'string') {
    throw new ValidationError('asset-db', 'import-asset', 'path', '必须是字符串类型');
  }

  if (!path.startsWith('db://assets/')) {
    throw new ValidationError('asset-db', 'import-asset', 'path', '必须以 db://assets/ 开头');
  }

  // Validate importPath
  if (typeof importPath !== 'string') {
    throw new ValidationError('asset-db', 'import-asset', 'importPath', '必须是字符串类型');
  }

  // importPath should be an absolute path or URL
  if (importPath.includes('\\') || importPath.includes('/')) {
    // Looks like a file path - check if it's absolute
    if (!importPath.includes(':') && !importPath.startsWith('/') && !importPath.match(/^[A-Za-z]:\\/)) {
      throw new ValidationError('asset-db', 'import-asset', 'importPath', '必须是绝对路径或 URL');
    }
  }
}

/**
 * Validate set-property params
 */
function validateSetProperty(params: unknown[]): void {
  if (params.length < 3) {
    throw new ValidationError('scene', 'set-property', 'params', '至少需要 3 个参数：path、property、value');
  }

  const [path, component, property, value] = params;

  // Validate path
  if (typeof path !== 'string') {
    throw new ValidationError('scene', 'set-property', 'path', '必须是字符串类型');
  }

  if (!path.startsWith('/')) {
    throw new ValidationError('scene', 'set-property', 'path', '必须是节点路径，以 / 开头（如 /Canvas/Sprite）');
  }

  // Validate property
  if (typeof property !== 'string') {
    throw new ValidationError('scene', 'set-property', 'property', '必须是字符串类型');
  }

  if (!property.includes('.')) {
    // Single property name - validate common ones
    const commonProps = ['active', 'name', 'tag', 'group', 'layer'];
    if (!commonProps.includes(property)) {
      throw new ValidationError('scene', 'set-property', 'property', `无效的属性名。常用属性: ${commonProps.join(', ')}，或使用嵌套路径（如 position.x）`);
    }
  }
}

/**
 * Validate create-node params
 */
function validateCreateNode(params: unknown[]): void {
  if (params.length < 1) {
    throw new ValidationError('scene', 'create-node', 'params', '至少需要 1 个参数：parentPath');
  }

  const [parentPath, name, componentType] = params;

  // Validate parentPath
  if (typeof parentPath !== 'string') {
    throw new ValidationError('scene', 'create-node', 'parentPath', '必须是字符串类型');
  }

  if (!parentPath.startsWith('/')) {
    throw new ValidationError('scene', 'create-node', 'parentPath', '必须是节点路径，以 / 开头（如 /Canvas）');
  }

  // Validate name if provided
  if (name !== undefined && typeof name !== 'string') {
    throw new ValidationError('scene', 'create-node', 'name', '必须是字符串类型');
  }

  // Validate componentType if provided
  if (componentType !== undefined && componentType !== null && typeof componentType !== 'string') {
    throw new ValidationError('scene', 'create-node', 'componentType', '必须是字符串类型');
  }

  if (componentType && !componentType.startsWith('cc.')) {
    throw new ValidationError('scene', 'create-node', 'componentType', '必须是有效的组件类型，以 cc. 开头（如 cc.Sprite、cc.Label）');
  }
}

/**
 * Validate remove-node params
 */
function validateRemoveNode(params: unknown[]): void {
  if (params.length < 1) {
    throw new ValidationError('scene', 'remove-node', 'params', '至少需要 1 个参数：path');
  }

  const [path] = params;

  if (typeof path !== 'string') {
    throw new ValidationError('scene', 'remove-node', 'path', '必须是字符串类型');
  }

  if (!path.startsWith('/')) {
    throw new ValidationError('scene', 'remove-node', 'path', '必须是节点路径，以 / 开头（如 /Canvas/OldNode）');
  }

  // Warn about root node
  if (path === '/') {
    throw new ValidationError('scene', 'remove-node', 'path', '不能删除根节点');
  }
}

/**
 * Action validators mapping
 * Maps module+action to validation function
 */
const ACTION_VALIDATORS: Record<string, Record<string, (params: unknown[]) => void>> = {
  'asset-db': {
    'create-asset': validateCreateAsset,
    'import-asset': validateImportAsset,
  },
  'scene': {
    'set-property': validateSetProperty,
    'create-node': validateCreateNode,
    'remove-node': validateRemoveNode,
  },
};

/**
 * Validate params for a specific action
 * @param module Module name
 * @param action Action name
 * @param params Parameters array
 * @throws ValidationError if validation fails
 */
export function validateActionParams(module: string, action: string, params: unknown[]): void {
  const moduleValidators = ACTION_VALIDATORS[module];
  if (!moduleValidators) return;

  const validator = moduleValidators[action];
  if (!validator) return;

  validator(params);
}

/**
 * Check if an action has param validation
 * @param module Module name
 * @param action Action name
 * @returns true if validation exists
 */
export function hasParamValidation(module: string, action: string): boolean {
  const moduleValidators = ACTION_VALIDATORS[module];
  if (!moduleValidators) return false;

  return action in moduleValidators;
}
