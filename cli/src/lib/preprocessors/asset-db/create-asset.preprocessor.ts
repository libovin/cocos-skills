/**
 * Preprocessor for asset-db/create-asset
 * 为 create-asset 生成默认资源数据
 */

import { generateDefaultAssetData } from '../../asset-templates.js';
import type { PreprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';

/**
 * Generate default asset data if only path is provided
 * 如果只提供了路径，则生成默认资源数据
 */
export const assetDbCreateAssetPreprocessor: PreprocessorFn = async (
  params: unknown[],
  _client: CocosClient
): Promise<unknown[]> => {
  if (params.length === 1 && typeof params[0] === 'string') {
    const path = params[0] as string;
    const defaultData = generateDefaultAssetData(path);
    return [path, defaultData];
  }
  return params;
};
