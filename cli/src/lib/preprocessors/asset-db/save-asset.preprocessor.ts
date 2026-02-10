/**
 * Preprocessor for asset-db/save-asset
 * 为 save-asset 生成默认资源数据或从场景节点树获取数据
 */

import { generateDefaultAssetData } from '../../asset-templates.js';
import type { PreprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';

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
 * 检查是否为场景或预制体文件
 */
function isSceneOrPrefabFile(path: string): boolean {
  const extension = getFileExtension(path);
  return extension === '.scene' || extension === '.prefab';
}

/**
 * Preprocessor for save-asset
 * - 对于 .scene 和 .prefab 文件：从 query-dirty 和 query-node-tree 获取数据
 * - 对于其他文件类型：使用默认模板生成数据
 */
export const assetDbSaveAssetPreprocessor: PreprocessorFn = async (
  params: unknown[],
  client: CocosClient
): Promise<unknown[]> => {
  // 如果已经提供了 content 参数，直接返回
  if (params.length >= 2) {
    return params;
  }

  if (params.length === 1 && typeof params[0] === 'string') {
    const path = params[0] as string;

    // 对于场景和预制体文件，从 query-dirty 和 query-node-tree 获取数据
    if (isSceneOrPrefabFile(path)) {
      try {
        // 1. 先调用 query-dirty 检查是否有未保存的修改
        const dirtyResult = await client.execute('scene', 'query-dirty', []);

        // 2. 调用 query-node-tree 获取节点树结构
        const treeResult = await client.execute('scene', 'query-node-tree', []);

        // 3. 将结果序列化为 JSON
        const content = JSON.stringify({
          dirty: dirtyResult.data,
          nodeTree: treeResult.data,
        });

        return [path, content];
      } catch (error) {
        // 如果获取场景数据失败（例如场景未打开），回退到使用默认模板
        const defaultData = generateDefaultAssetData(path);
        return [path, defaultData];
      }
    }

    // 对于其他文件类型，使用默认模板生成数据
    const defaultData = generateDefaultAssetData(path);
    return [path, defaultData];
  }

  return params;
};
