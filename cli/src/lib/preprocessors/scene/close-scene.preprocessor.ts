/**
 * Preprocessor for scene/close-scene
 * 在关闭场景前自动检查并保存未保存的更改
 */

import type { PreprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import type { ApiResponse } from '../../../types.js';

/**
 * Close scene preprocessor
 * 在关闭场景前：
 * 1. 调用 query-dirty 检查是否有未保存的更改
 * 2. 如果有更改，自动调用 save-scene 保存
 * 3. 然后继续执行 close-scene
 */
export const sceneCloseScenePreprocessor: PreprocessorFn = async (
  params: unknown[],
  client: CocosClient
): Promise<unknown[]> => {
  try {
    // 1. 检查场景是否有未保存的更改
    const dirtyResponse = await (client as any)._request('POST', '/api/scene/query-dirty', {
      params: [],
    }) as ApiResponse<{ result?: boolean }>;

    // 2. 如果有未保存的更改，自动保存
    if (dirtyResponse.success && dirtyResponse.data?.result === true) {
      console.log('检测到场景有未保存的更改，正在自动保存...');

      const saveResponse = await (client as any)._request('POST', '/api/scene/save-scene', {
        params: [],
      }) as ApiResponse;

      if (saveResponse.success) {
        console.log('场景已自动保存');
      } else {
        console.warn('自动保存场景失败，但将继续关闭场景');
      }
    }
  } catch (error) {
    // 如果检查或保存失败，记录警告但继续关闭场景
    console.warn('检查场景状态时出错，将继续关闭场景:', error instanceof Error ? error.message : error);
  }

  // 3. 返回原始参数，继续执行 close-scene
  return params;
};
