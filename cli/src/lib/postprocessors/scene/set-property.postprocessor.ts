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
  // Check if there are prepared calls from preprocessor
  const resultData = result.data as Record<string, unknown> | undefined;
  const calls = resultData?.calls as SetPropertyCall[] | undefined;

  // If no prepared calls, return original result
  if (!calls || !Array.isArray(calls) || calls.length === 0) {
    return result;
  }

  // Execute all prepared set-property calls
  const results: Array<{ path: string; success: boolean; error?: string }> = [];

  for (const call of calls) {
    try {
      const setResult = await client.execute(
        'scene',
        'set-property',
        [call],
        false
      );
      results.push({
        path: call.path,
        success: setResult.data as boolean,
      });
    } catch (error) {
      results.push({
        path: call.path,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Calculate success count
  const successCount = results.filter((r) => r.success).length;

  // Return merged results
  return {
    success: successCount === calls.length,
    data: {
      totalProperties: calls.length,
      successCount,
      failedCount: calls.length - successCount,
      results,
      message: successCount === calls.length
        ? `All ${calls.length} properties set successfully`
        : `${successCount}/${calls.length} properties set successfully`,
    },
  };
};
