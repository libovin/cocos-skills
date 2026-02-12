/**
 * Postprocessor for scene/set-property
 * 执行前置处理器准备好的批量 set-property 调用
 */

import type { PostprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import type { ApiResponse } from '../../../types.js';

/**
 * Prepared set-property call structure
 */
interface SetPropertyCall {
  uuid: string;
  path: string;
  dump: {
    value: unknown;
    type: string;
  };
}

/**
 * Postprocessor that executes prepared set-property calls from preprocessor
 */
export const sceneSetPropertyPostprocessor: PostprocessorFn = async (
  result: ApiResponse,
  originalParams: unknown[],
  client: CocosClient
): Promise<ApiResponse> => {
  const resultData = result.data as Record<string, unknown> | undefined;
  const calls = resultData?.calls as SetPropertyCall[] | undefined;

  if (!calls || !Array.isArray(calls) || calls.length === 0) {
    return result;
  }

  const results: Array<{ call: SetPropertyCall; result: unknown }> = [];
  let successCount = 0;

  for (const call of calls) {
    try {
      const setResult = await client.executeRaw(
        'scene',
        'set-property',
        [call]
      );
      results.push({ call, result: setResult });
      if (setResult.success) successCount++;
    } catch (error) {
      results.push({
        call,
        result: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  const failedCount = calls.length - successCount;

  return {
    success: failedCount === 0,
    data: {
      success: successCount,
      failed: failedCount,
      results,
    },
  };
};
