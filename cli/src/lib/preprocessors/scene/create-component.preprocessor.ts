/**
 * Preprocessor for scene/create-component
 * 检查节点是否已存在指定组件，如果存在则跳过 API 调用
 * 支持 component 为字符串或数组（批量添加）
 */

import type { PreprocessorFn, PipelineResult } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import {
  queryNode,
  getMissingComponents,
  type SimplifiedNode,
} from '../../utils/scene-node.js';

/**
 * Preprocessor that checks if component already exists on node
 * If component exists, skips the API call and returns success
 * Supports component as string or array for batch adding
 */
export const sceneCreateComponentPreprocessor: PreprocessorFn = async (
  params: unknown[],
  client: CocosClient
): Promise<unknown[] | PipelineResult> => {
  const options = params[0] as Record<string, unknown> | undefined;
  if (!options) {
    return params;
  }

  const { uuid: nodeUuid, component: componentParam } = options;

  if (typeof nodeUuid !== 'string') {
    return params;
  }

  // Handle component as string or array
  let componentTypes: string[];
  let isArray = false;

  if (typeof componentParam === 'string') {
    componentTypes = [componentParam];
  } else if (Array.isArray(componentParam)) {
    componentTypes = componentParam.filter((item) => typeof item === 'string');
    isArray = true;
    if (componentTypes.length === 0) {
      return params;
    }
  } else {
    return params;
  }

  // Query node to check if components already exist
  const nodeData = await queryNode(client, nodeUuid);

  if (!nodeData) {
    return params;
  }

  const components = nodeData.components;

  if (!components || !Array.isArray(components)) {
    return params;
  }

  // Find missing components
  const missingComponents = getMissingComponents(components, componentTypes);

  // If all components already exist, skip API call
  if (missingComponents.length === 0) {
    const existingTypes = componentTypes.join(', ');
    const skipResult: PipelineResult = {
      params,
      skipApiCall: true,
      skipResponse: {
        success: true,
        data: {
          uuid: nodeUuid,
          components: componentTypes,
          skipped: true,
          message: isArray
            ? `All components [${existingTypes}] already exist on node`
            : `Component ${existingTypes} already exists on node`,
        },
      },
    };
    return skipResult;
  }

  // For array format, pass to postprocessor for handling
  if (isArray) {
    const skipResult: PipelineResult = {
      params,
      skipApiCall: true,
      skipResponse: {
        success: true,
        data: {
          uuid: nodeUuid,
          components: missingComponents,
          skipped: false,
          message: `Preparing to create ${missingComponents.length} components`,
        },
      },
    };
    return skipResult;
  }

  return params;
};
