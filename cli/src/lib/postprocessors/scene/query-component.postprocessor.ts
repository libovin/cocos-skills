/**
 * Postprocessor for scene/query-component
 * 简化 query-component 返回结果
 *
 * 原始结构：{ value: { uuid: { value: "xxx" }, name: { value: "xxx" }, ... }, type: "cc.Label" }
 * 简化后：  { uuid: "xxx", name: "xxx", type: "cc.Label", props: { ... } }
 */

import type { PostprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import type { ApiResponse } from '../../../types.js';
import { extractComponentProps } from '../../utils/component-props.js';

/**
 * 简化后的组件信息
 */
interface SimplifiedComponentInfo {
  uuid: string;
  name: string;
  type: string;
  enabled: boolean;
  props: Record<string, unknown>;
}

/**
 * 简化 query-component 返回结果
 */
export const sceneQueryComponentPostprocessor: PostprocessorFn = async (
  result: ApiResponse,
  _originalParams: unknown[],
  _client: CocosClient
): Promise<ApiResponse> => {
  if (!result.success || !result.data) {
    return result;
  }

  const data = result.data as Record<string, unknown>;
  const compValue = data.value as Record<string, unknown> | undefined;

  if (!compValue) {
    return result;
  }

  // 提取基本字段
  const uuidField = compValue.uuid;
  const nameField = compValue.name;
  const enabledField = compValue.enabled;
  const typeField = data.type;

  if (!uuidField || !nameField || !typeField) {
    return result;
  }

  const simplified: SimplifiedComponentInfo = {
    uuid: (uuidField as Record<string, unknown>).value as string,
    name: (nameField as Record<string, unknown>).value as string,
    type: typeField as string,
    enabled: (enabledField as Record<string, unknown>).value as boolean,
    props: extractComponentProps(compValue),
  };

  return {
    ...result,
    data: simplified,
  };
};
