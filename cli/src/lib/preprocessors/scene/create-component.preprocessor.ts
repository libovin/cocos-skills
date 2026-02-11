/**
 * Preprocessor for scene/create-component
 * 检查节点是否已存在指定组件，如果存在则跳过 API 调用
 */

import type { PreprocessorFn, PipelineResult } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';

/**
 * Component info from query-node __comps__
 */
interface ComponentInfo {
  type: string;
  uuid: string;
  enabled?: boolean;
  value?: unknown;
  extends?: string[];
}

/**
 * Preprocessor that checks if component already exists on node
 * If component exists, skips the API call and returns success
 */
export const sceneCreateComponentPreprocessor: PreprocessorFn = async (
  params: unknown[],
  client: CocosClient
): Promise<unknown[] | PipelineResult> => {
  const options = params[0] as Record<string, unknown> | undefined;
  if (!options) {
    return params;
  }

  const { uuid: nodeUuid, component: componentType } = options;

  if (typeof nodeUuid !== 'string' || typeof componentType !== 'string') {
    return params;
  }

  try {
    // Query node to check if component already exists
    const result = await client.execute(
      'scene',
      'query-node',
      [nodeUuid],
      false
    );

    if (!result.success || !result.data) {
      return params;
    }

    // Extract components from node data
    const nodeData = result.data as Record<string, unknown>;
    const components = nodeData.__comps__ as ComponentInfo[] | undefined;

    if (!components || !Array.isArray(components)) {
      return params;
    }

    // Check if component already exists (match by type)
    const existingComponent = components.find(
      (comp) => comp.type === componentType
    );

    if (existingComponent) {
      // Component already exists, skip API call
      const skipResult: PipelineResult = {
        params,
        skipApiCall: true,
        skipResponse: {
          success: true,
          data: {
            uuid: nodeUuid,
            component: componentType,
            componentUuid: existingComponent.uuid,
            skipped: true,
            message: `Component ${componentType} already exists on node`,
          },
        },
      };
      return skipResult;
    }
  } catch {
    // If query fails, proceed with normal API call
    return params;
  }

  return params;
};
