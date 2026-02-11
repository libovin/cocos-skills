/**
 * Postprocessor for scene/create-component
 * 处理数组格式的组件创建
 */

import type { PostprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import type { ApiResponse } from '../../../types.js';

interface CreateComponentData {
  uuid: string;
  components: string[];
  skipped: boolean;
  message?: string;
}

export const sceneCreateComponentPostprocessor: PostprocessorFn = async (
  result: ApiResponse,
  originalParams: unknown[],
  client: CocosClient
): Promise<ApiResponse> => {
  const resultData = result.data as CreateComponentData | undefined;

  if (!resultData || !resultData.components || !Array.isArray(resultData.components)) {
    return result;
  }

  const { uuid, components, skipped } = resultData;

  if (skipped) {
    return result;
  }

  if (components.length === 0) {
    return {
      success: true,
      data: {
        uuid,
        components: [],
        message: 'No components to create',
      },
    };
  }

  const results: Array<{ component: string; success: boolean; error?: string }> = [];

  for (const componentType of components) {
    try {
      const createResult = await client.execute(
        'scene',
        'create-component',
        [{
          uuid,
          component: componentType,
        }],
        false
      );

      results.push({
        component: componentType,
        success: createResult.success,
      });
    } catch (error) {
      results.push({
        component: componentType,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const successCount = results.filter((r) => r.success).length;

  return {
    success: successCount === components.length,
    data: {
      uuid,
      components,
      total: components.length,
      successCount,
      failedCount: components.length - successCount,
      results,
      message: successCount === components.length
        ? `All ${components.length} components created successfully`
        : `${successCount}/${components.length} components created`,
    },
  };
};
