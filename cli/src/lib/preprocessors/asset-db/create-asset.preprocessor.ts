/**
 * Preprocessor for asset-db/create-asset
 * 自动生成默认资源数据
 */

import { generateDefaultAssetData } from '../../asset-templates.js';
import type { PreprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';

/**
 * 自动生成默认资源数据
 * 系统根据文件扩展名自动生成对应的默认 JSON 数据
 */
export const assetDbCreateAssetPreprocessor: PreprocessorFn = async (
  params: unknown[],
  _client: CocosClient
): Promise<unknown[]> => {
  const [path] = params;

  if (typeof path !== 'string') {
    return params;
  }

  // 自动生成默认数据
  const defaultData = generateDefaultAssetData(path);
  return [path, defaultData];
};
