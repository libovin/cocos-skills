/**
 * Validate create-asset params
 */

import { ValidationError } from '../error.js';

export function validateCreateAsset(params: unknown[]): void {
  if (params.length < 2) {
    throw new ValidationError('asset-db', 'create-asset', 'params', '至少需要 2 个参数：path 和 data');
  }

  const [path, data] = params;

  if (typeof path !== 'string') {
    throw new ValidationError('asset-db', 'create-asset', 'path', '必须是字符串类型');
  }

  if (!path.startsWith('db://assets/')) {
    throw new ValidationError('asset-db', 'create-asset', 'path', '必须以 db://assets/ 开头');
  }

  if (!path.includes('.')) {
    throw new ValidationError('asset-db', 'create-asset', 'path', '必须包含文件扩展名（如 .prefab、.scene、.png）');
  }

  if (typeof data !== 'string') {
    throw new ValidationError('asset-db', 'create-asset', 'data', '必须是 JSON 字符串类型');
  }

  try {
    const parsed = JSON.parse(data);
    const extension = getFileExtension(path);

    if (Array.isArray(parsed)) {
      if (extension === '.prefab') {
        validatePrefabFormat(parsed);
      } else if (extension === '.scene') {
        validateSceneFormat(parsed);
      } else {
        validateGenericArrayFormat(parsed);
      }
    }
    else if (typeof parsed === 'object' && parsed !== null) {
      if (!('__type__' in parsed)) {
        throw new ValidationError('asset-db', 'create-asset', 'data', 'JSON 对象必须包含 __type__ 字段（如 cc.Prefab、cc.SceneAsset）');
      }
      if (extension === '.material' || extension === '.mtl') {
        validateMaterialFormat(parsed);
      } else if (extension === '.pmtl') {
        validatePhysicsMaterialFormat(parsed);
      } else if (extension === '.anim') {
        validateAnimationClipFormat(parsed);
      } else if (extension === '.animask') {
        validateAnimationMaskFormat(parsed);
      } else if (extension === '.pac') {
        validateSpriteAtlasFormat(parsed);
      } else if (extension === '.labelatlas') {
        validateLabelAtlasFormat(parsed);
      } else {
        validateGenericObjectFormat(parsed, extension);
      }
    } else {
      throw new ValidationError('asset-db', 'create-asset', 'data', 'JSON 必须是数组或对象类型');
    }
  } catch (e) {
    if (e instanceof ValidationError) {
      throw e;
    }
    throw new ValidationError('asset-db', 'create-asset', 'data', '必须是有效的 JSON 字符串');
  }
}

function getFileExtension(path: string): string {
  const lastDotIndex = path.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return '';
  }
  return path.substring(lastDotIndex).toLowerCase();
}

function validatePrefabFormat(items: unknown[]): void {
  if (items.length === 0) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Prefab JSON 数组不能为空');
  }

  if (typeof items[0] !== 'object' || items[0] === null) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Prefab JSON 数组第一个元素必须是对象');
  }

  const firstItem = items[0] as Record<string, unknown>;

  if (!('__type__' in firstItem)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Prefab JSON 数组第一个元素必须包含 __type__ 字段（如 cc.Prefab）');
  }

  if (firstItem.__type__ !== 'cc.Prefab') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Prefab 文件的第一个元素 __type__ 必须是 cc.Prefab');
  }

  validatePrefabStructure(items);
}

function validateSceneFormat(items: unknown[]): void {
  if (items.length === 0) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Scene JSON 数组不能为空');
  }

  if (typeof items[0] !== 'object' || items[0] === null) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Scene JSON 数组第一个元素必须是对象');
  }

  const firstItem = items[0] as Record<string, unknown>;

  if (!('__type__' in firstItem)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Scene JSON 数组第一个元素必须包含 __type__ 字段（如 cc.SceneAsset）');
  }

  if (firstItem.__type__ !== 'cc.SceneAsset') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Scene 文件的第一个元素 __type__ 必须是 cc.SceneAsset');
  }

  validateSceneStructure(items);
}

function validateSceneStructure(items: unknown[]): void {
  if (items.length < 2) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Scene 数组至少需要 2 个元素：cc.SceneAsset、cc.Scene');
  }

  const sceneAsset = items[0] as Record<string, unknown>;
  const scene = items[1] as Record<string, unknown>;

  validateSceneAssetItem(sceneAsset);
  validateSceneItem(scene);

  const data = sceneAsset.data as Record<string, unknown>;
  if (typeof data !== 'object' || data === null || !('__id__' in data)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.SceneAsset.data 必须是包含 __id__ 的对象');
  }

  if ((data.__id__ as number) !== 1) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.SceneAsset.data.__id__ 必须指向 cc.Scene（索引 1）');
  }
}

function validateSceneAssetItem(item: Record<string, unknown>): void {
  const requiredFields = ['__type__', '_name', '_objFlags', '_native', 'data', 'asyncLoadAssets'];
  for (const field of requiredFields) {
    if (!(field in item)) {
      throw new ValidationError('asset-db', 'create-asset', 'data', `cc.SceneAsset 缺少必需字段: ${field}`);
    }
  }

  if (item.__type__ !== 'cc.SceneAsset') {
    throw new ValidationError('asset-db', 'create-asset', 'data', '第一个元素的 __type__ 必须是 cc.SceneAsset');
  }

  if (typeof item.data !== 'object' || item.data === null) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.SceneAsset.data 必须是对象');
  }
}

function validateSceneItem(item: Record<string, unknown>): void {
  const requiredFields = ['__type__', '_name', '_objFlags', '_parent', '_children', '_active', '_components', '_lpos', '_lrot', '_lscale', '_euler', '_id'];
  for (const field of requiredFields) {
    if (!(field in item)) {
      throw new ValidationError('asset-db', 'create-asset', 'data', `cc.Scene 缺少必需字段: ${field}`);
    }
  }

  if (item.__type__ !== 'cc.Scene') {
    throw new ValidationError('asset-db', 'create-asset', 'data', '第二个元素的 __type__ 必须是 cc.Scene');
  }

  if (!Array.isArray(item._children)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Scene._children 必须是数组');
  }

  if (!Array.isArray(item._components)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Scene._components 必须是数组');
  }

  validateVec3(item._lpos, '_lpos');
  validateQuat(item._lrot, '_lrot');
  validateVec3(item._lscale, '_lscale');
  validateVec3(item._euler, '_euler');
}

function validateGenericArrayFormat(items: unknown[]): void {
  if (items.length === 0) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'JSON 数组不能为空');
  }

  if (typeof items[0] !== 'object' || items[0] === null) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'JSON 数组第一个元素必须是对象');
  }

  const firstItem = items[0] as Record<string, unknown>;

  if (!('__type__' in firstItem)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'JSON 数组第一个元素必须包含 __type__ 字段');
  }
}

function validateAnimationMaskFormat(item: Record<string, unknown>): void {
  const requiredFields = ['__type__', '_name', '_objFlags', '_native', '_jointMasks'];
  for (const field of requiredFields) {
    if (!(field in item)) {
      throw new ValidationError('asset-db', 'create-asset', 'data', `cc.animation.AnimationMask 缺少必需字段: ${field}`);
    }
  }

  if (item.__type__ !== 'cc.animation.AnimationMask') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Animation Mask 文件的 __type__ 必须是 cc.animation.AnimationMask');
  }

  if (!Array.isArray(item._jointMasks)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.animation.AnimationMask._jointMasks 必须是数组');
  }
}

function validateSpriteAtlasFormat(item: Record<string, unknown>): void {
  if (item.__type__ !== 'cc.SpriteAtlas') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Sprite Atlas 文件的 __type__ 必须是 cc.SpriteAtlas');
  }
}

function validateLabelAtlasFormat(item: Record<string, unknown>): void {
  if (item.__type__ !== 'cc.LabelAtlas') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Label Atlas 文件的 __type__ 必须是 cc.LabelAtlas');
  }
}

function validateMaterialFormat(item: Record<string, unknown>): void {
  const requiredFields = ['__type__', '_name', '_objFlags', '_native', '_effectAsset', '_techIdx', '_defines', '_props'];
  for (const field of requiredFields) {
    if (!(field in item)) {
      throw new ValidationError('asset-db', 'create-asset', 'data', `cc.Material 缺少必需字段: ${field}`);
    }
  }

  if (item.__type__ !== 'cc.Material') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Material 文件的 __type__ 必须是 cc.Material');
  }

  const effectAsset = item._effectAsset as Record<string, unknown>;
  if (typeof effectAsset !== 'object' || effectAsset === null) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Material._effectAsset 必须是对象');
  }

  if (!('__uuid__' in effectAsset)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Material._effectAsset 必须包含 __uuid__ 字段');
  }

  if (typeof effectAsset.__uuid__ !== 'string') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Material._effectAsset.__uuid__ 必须是字符串');
  }

  if (!Array.isArray(item._defines)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Material._defines 必须是数组');
  }

  if (!Array.isArray(item._props)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Material._props 必须是数组');
  }
}

function validatePhysicsMaterialFormat(item: Record<string, unknown>): void {
  const requiredFields = ['__type__', '_name', '_objFlags', '_native', 'friction', 'restitution', 'rollingFriction', 'staticFriction'];
  for (const field of requiredFields) {
    if (!(field in item)) {
      throw new ValidationError('asset-db', 'create-asset', 'data', `cc.PhysicsMaterial 缺少必需字段: ${field}`);
    }
  }

  if (item.__type__ !== 'cc.PhysicsMaterial') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Physics Material 文件的 __type__ 必须是 cc.PhysicsMaterial');
  }

  if (typeof item.friction !== 'number') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.PhysicsMaterial.friction 必须是数字');
  }

  if (typeof item.restitution !== 'number') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.PhysicsMaterial.restitution 必须是数字');
  }

  if (typeof item.rollingFriction !== 'number') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.PhysicsMaterial.rollingFriction 必须是数字');
  }

  if (typeof item.staticFriction !== 'number') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.PhysicsMaterial.staticFriction 必须是数字');
  }
}

function validateAnimationClipFormat(item: Record<string, unknown>): void {
  const requiredFields = ['__type__', '_name', '_objFlags', '_native', '_duration', '_hash', '_tracks', '_events', '_exoticAnimation'];
  for (const field of requiredFields) {
    if (!(field in item)) {
      throw new ValidationError('asset-db', 'create-asset', 'data', `cc.AnimationClip 缺少必需字段: ${field}`);
    }
  }

  if (item.__type__ !== 'cc.AnimationClip') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Animation Clip 文件的 __type__ 必须是 cc.AnimationClip');
  }

  if (typeof item._duration !== 'number') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.AnimationClip._duration 必须是数字');
  }

  if (typeof item._hash !== 'number') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.AnimationClip._hash 必须是数字');
  }

  if (!Array.isArray(item._tracks)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.AnimationClip._tracks 必须是数组');
  }

  if (!Array.isArray(item._events)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.AnimationClip._events 必须是数组');
  }
}

function validateGenericObjectFormat(item: Record<string, unknown>, extension: string): void {
  if (!('__type__' in item)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', `JSON 对象必须包含 __type__ 字段`);
  }

  const validTypes = getValidTypesForExtension(extension);
  if (validTypes.length > 0 && !validTypes.includes(item.__type__ as string)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', `文件扩展名 ${extension} 不匹配的 __type__: ${item.__type__}。期望类型: ${validTypes.join(', ')}`);
  }
}

function getValidTypesForExtension(extension: string): string[] {
  const typeMap: Record<string, string[]> = {
    '.prefab': ['cc.Prefab'],
    '.scene': ['cc.SceneAsset'],
    '.png': ['cc.Texture2D', 'cc.SpriteFrame'],
    '.jpg': ['cc.Texture2D', 'cc.SpriteFrame'],
    '.jpeg': ['cc.Texture2D', 'cc.SpriteFrame'],
    '.webp': ['cc.Texture2D', 'cc.SpriteFrame'],
    '.bmp': ['cc.Texture2D', 'cc.SpriteFrame'],
    '.mp3': ['cc.AudioClip'],
    '.ogg': ['cc.AudioClip'],
    '.wav': ['cc.AudioClip'],
    '.m4a': ['cc.AudioClip'],
    '.ttf': ['cc.Font'],
    '.otf': ['cc.Font'],
    '.json': ['cc.JsonAsset', 'cc.Prefab', 'cc.SceneAsset'],
    '.txt': ['cc.TextAsset'],
    '.md': ['cc.TextAsset'],
    '.material': ['cc.Material'],
    '.mtl': ['cc.Material'],
    '.pmtl': ['cc.PhysicsMaterial'],
    '.anim': ['cc.AnimationClip'],
    '.animask': ['cc.animation.AnimationMask'],
    '.pac': ['cc.SpriteAtlas'],
    '.labelatlas': ['cc.LabelAtlas'],
    '.fire': ['cc.Prefab'],
  };

  return typeMap[extension] || [];
}

function validatePrefabStructure(items: unknown[]): void {
  if (items.length < 3) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'Prefab 数组至少需要 3 个元素：cc.Prefab、cc.Node、cc.PrefabInfo');
  }

  const prefab = items[0] as Record<string, unknown>;
  const node = items[1] as Record<string, unknown>;
  const prefabInfo = items[2] as Record<string, unknown>;

  validatePrefabItem(prefab);
  validateNodeItem(node);
  validatePrefabInfoItem(prefabInfo);

  const data = prefab.data as Record<string, unknown>;
  if (typeof data !== 'object' || data === null || !('__id__' in data)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Prefab.data 必须是包含 __id__ 的对象');
  }

  if ((data.__id__ as number) !== 1) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Prefab.data.__id__ 必须指向 cc.Node（索引 1）');
  }

  const prefabRef = node._prefab as Record<string, unknown>;
  if (typeof prefabRef !== 'object' || prefabRef === null || !('__id__' in prefabRef)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Node._prefab 必须是包含 __id__ 的对象');
  }

  if ((prefabRef.__id__ as number) !== 2) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Node._prefab.__id__ 必须指向 cc.PrefabInfo（索引 2）');
  }

  const root = prefabInfo.root as Record<string, unknown>;
  if (typeof root !== 'object' || root === null || !('__id__' in root)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.PrefabInfo.root 必须是包含 __id__ 的对象');
  }

  if ((root.__id__ as number) !== 1) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.PrefabInfo.root.__id__ 必须指向 cc.Node（索引 1）');
  }

  const asset = prefabInfo.asset as Record<string, unknown>;
  if (typeof asset !== 'object' || asset === null || !('__id__' in asset)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.PrefabInfo.asset 必须是包含 __id__ 的对象');
  }

  if ((asset.__id__ as number) !== 0) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.PrefabInfo.asset.__id__ 必须指向 cc.Prefab（索引 0）');
  }
}

function validatePrefabItem(item: Record<string, unknown>): void {
  const requiredFields = ['__type__', '_name', '_objFlags', '_native', 'data', 'optimizationPolicy', 'asyncLoadAssets', 'persistent'];
  for (const field of requiredFields) {
    if (!(field in item)) {
      throw new ValidationError('asset-db', 'create-asset', 'data', `cc.Prefab 缺少必需字段: ${field}`);
    }
  }

  if (item.__type__ !== 'cc.Prefab') {
    throw new ValidationError('asset-db', 'create-asset', 'data', '第一个元素的 __type__ 必须是 cc.Prefab');
  }

  if (typeof item.data !== 'object' || item.data === null) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Prefab.data 必须是对象');
  }
}

function validateNodeItem(item: Record<string, unknown>): void {
  const requiredFields = ['__type__', '_name', '_objFlags', '_parent', '_children', '_active', '_components', '_prefab', '_lpos', '_lrot', '_lscale', '_layer', '_euler', '_id'];
  for (const field of requiredFields) {
    if (!(field in item)) {
      throw new ValidationError('asset-db', 'create-asset', 'data', `cc.Node 缺少必需字段: ${field}`);
    }
  }

  if (item.__type__ !== 'cc.Node') {
    throw new ValidationError('asset-db', 'create-asset', 'data', '第二个元素的 __type__ 必须是 cc.Node');
  }

  if (!Array.isArray(item._children)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Node._children 必须是数组');
  }

  if (!Array.isArray(item._components)) {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Node._components 必须是数组');
  }

  validateVec3(item._lpos, '_lpos');
  validateQuat(item._lrot, '_lrot');
  validateVec3(item._lscale, '_lscale');
  validateVec3(item._euler, '_euler');

  if (typeof item._layer !== 'number') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.Node._layer 必须是数字');
  }
}

function validatePrefabInfoItem(item: Record<string, unknown>): void {
  const requiredFields = ['__type__', 'root', 'asset', 'fileId'];
  for (const field of requiredFields) {
    if (!(field in item)) {
      throw new ValidationError('asset-db', 'create-asset', 'data', `cc.PrefabInfo 缺少必需字段: ${field}`);
    }
  }

  if (item.__type__ !== 'cc.PrefabInfo') {
    throw new ValidationError('asset-db', 'create-asset', 'data', '第三个元素的 __type__ 必须是 cc.PrefabInfo');
  }

  if (typeof item.fileId !== 'string') {
    throw new ValidationError('asset-db', 'create-asset', 'data', 'cc.PrefabInfo.fileId 必须是字符串');
  }
}

function validateVec3(value: unknown, fieldName: string): void {
  if (typeof value !== 'object' || value === null) {
    throw new ValidationError('asset-db', 'create-asset', 'data', `${fieldName} 必须是对象`);
  }

  const vec3 = value as Record<string, unknown>;
  if (vec3.__type__ !== 'cc.Vec3') {
    throw new ValidationError('asset-db', 'create-asset', 'data', `${fieldName}.__type__ 必须是 cc.Vec3`);
  }

  if (typeof vec3.x !== 'number' || typeof vec3.y !== 'number' || typeof vec3.z !== 'number') {
    throw new ValidationError('asset-db', 'create-asset', 'data', `${fieldName} 必须包含 x、y、z 数字字段`);
  }
}

function validateQuat(value: unknown, fieldName: string): void {
  if (typeof value !== 'object' || value === null) {
    throw new ValidationError('asset-db', 'create-asset', 'data', `${fieldName} 必须是对象`);
  }

  const quat = value as Record<string, unknown>;
  if (quat.__type__ !== 'cc.Quat') {
    throw new ValidationError('asset-db', 'create-asset', 'data', `${fieldName}.__type__ 必须是 cc.Quat`);
  }

  if (typeof quat.x !== 'number' || typeof quat.y !== 'number' || typeof quat.z !== 'number' || typeof quat.w !== 'number') {
    throw new ValidationError('asset-db', 'create-asset', 'data', `${fieldName} 必须包含 x、y、z、w 数字字段`);
  }
}
