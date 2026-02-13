/**
 * Preprocessor for scene/set-property
 * 只支持批量模式
 * 将 { uuid, component, properties } 格式转换为多个 set-property 调用
 */

import type { PreprocessorFn, PipelineResult } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import { isBuiltinComponent } from '../../validators/scene/component-properties.js';
import { ValidationError } from '../../validators/error.js';
import { extractPropertyInfo, type PropertyInfo } from '../../utils/component-props.js';
import {
  queryNode,
  findComponentInfo,
  type SimplifiedNode,
} from '../../utils/scene-node.js';

/**
 * Query component properties dynamically
 * Returns property info array with name and type
 */
async function queryComponentProperties(client: CocosClient, componentUuid: string): Promise<PropertyInfo[]> {
  try {
    const result = await client.executeRaw('scene', 'query-component', [componentUuid]);
    
    if (!result.success || !result.data) {
      return [];
    }
    
    const componentData = result.data as Record<string, unknown>;
    const compValue = componentData.value as Record<string, unknown> | undefined;
    
    if (!compValue) {
      return [];
    }
    
    return extractPropertyInfo(compValue);
  } catch {
    return [];
  }
}

const USAGE = `用法: cocos-skills scene set-property '<JSON配置>'

示例（设置节点属性，component 可省略）:
  cocos-skills scene set-property '{"uuid":"xxx","properties":[{"name":"position","value":[0,0,0],"type":"Vec3"}]}'

示例（设置组件属性）:
  cocos-skills scene set-property '{"uuid":"xxx","component":"cc.Sprite","properties":[{"name":"color","value":[255,0,0,255],"type":"Color"}]}'`;

/**
 * Preprocessor that converts batch format to set-property API calls
 */
export const sceneSetPropertyPreprocessor: PreprocessorFn = async (
  params: unknown[],
  client: CocosClient
): Promise<unknown[] | PipelineResult> => {
  const options = params[0] as Record<string, unknown> | undefined;
  if (!options) {
    throw new ValidationError('scene', 'set-property', 'usage', `需要提供一个 JSON 配置对象\n\n${USAGE}`);
  }

  const { uuid: nodeUuid, component: componentType, properties } = options;

  if (typeof nodeUuid !== 'string' || nodeUuid.trim() === '') {
    throw new ValidationError('scene', 'set-property', 'usage', `uuid 不能为空\n\n${USAGE}`);
  }

  if (!Array.isArray(properties) || properties.length === 0) {
    throw new ValidationError('scene', 'set-property', 'usage', `properties 必须是非空数组\n\n${USAGE}`);
  }

  // Default to cc.Node if component not specified
  const actualComponentType = (componentType as string | undefined) ?? 'cc.Node';

  // Query node to get component index
  const nodeData = await queryNode(client, nodeUuid);

  if (!nodeData) {
    throw new ValidationError(
      'scene',
      'set-property',
      'usage',
      `节点 "${nodeUuid}" 不存在或无法访问`
    );
  }

  // Determine if this is a node property (cc.Node) or component property
  const isNodeProperty = actualComponentType === 'cc.Node';

  let pathPrefix: string;
  let componentUuid: string | undefined;

  if (isNodeProperty) {
    // Node properties don't have __comps__ prefix
    pathPrefix = '';
  } else {
    // Component properties need __comps__.index prefix
    const components = nodeData.components;

    // Find component info
    const componentInfo = findComponentInfo(components, actualComponentType);

    if (!componentInfo) {
      const availableTypes = components?.map((c) => c.type).join(', ') || '无';
      throw new ValidationError(
        'scene',
        'set-property',
        'usage',
        `节点上未找到组件 "${actualComponentType}"\n可用组件: ${availableTypes}`
      );
    }

    // Store component UUID for dynamic property query
    componentUuid = componentInfo.uuid;

    // Find component index
    const componentIndex = components!.findIndex((comp) => comp.type === actualComponentType);
    
    // Build property path prefix
    pathPrefix = `__comps__.${componentIndex}.`;
    
    // For non-builtin components, dynamically query and validate properties
    if (!isBuiltinComponent(actualComponentType) && componentUuid) {
      const validProperties = await queryComponentProperties(client, componentUuid);
      const validPropNames = new Set(validProperties.map((p) => p.name));
      
      const invalidProps: string[] = [];
      for (const prop of properties) {
        if (typeof prop === 'object' && prop !== null) {
          const propObj = prop as Record<string, unknown>;
          const propName = propObj.name as string;
          
          if (propName && !validPropNames.has(propName)) {
            invalidProps.push(propName);
          }
        }
      }
      
      if (invalidProps.length > 0) {
        const propList = validProperties
          .map((p) => `  ${p.name}: ${p.type}`)
          .join('\n');
        throw new ValidationError(
          'scene',
          'set-property',
          'usage',
          `属性名 "${invalidProps.join(', ')}" 无效\n\n${actualComponentType} 支持属性:\n${propList}`
        );
      }
    }
  }

  // Convert properties array to final set-property call structure
  const setPropertyCalls: Array<{ uuid: string; path: string; dump: { value: unknown; type: string } }> = [];
  for (const prop of properties) {
    if (typeof prop === 'object' && prop !== null) {
      const propObj = prop as Record<string, unknown>;
      if (typeof propObj.name === 'string' && 'value' in propObj && typeof propObj.type === 'string') {
        // Build full path: if pathPrefix is empty, use name directly
        const path = pathPrefix ? `${pathPrefix}${propObj.name}` : propObj.name;
        setPropertyCalls.push({
          uuid: nodeUuid,
          path,
          dump: {
            value: propObj.value,
            type: propObj.type,
          },
        });
      }
    }
  }

  if (setPropertyCalls.length === 0) {
    throw new ValidationError('scene', 'set-property', 'usage', `没有有效的属性设置\n\n${USAGE}`);
  }

  // Batch mode: skip original API call and pass prepared calls to postprocessor
  const skipResult: PipelineResult = {
    params,
    skipApiCall: true,
    skipPostProcessor: false,
    skipResponse: {
      success: true,
      data: {
        calls: setPropertyCalls,
        message: `Prepared ${setPropertyCalls.length} set-property calls`,
      },
    },
  };

  return skipResult;
};
