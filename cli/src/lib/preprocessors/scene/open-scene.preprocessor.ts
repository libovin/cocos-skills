/**
 * Preprocessor for scene/open-scene
 * 支持 UUID 或路径两种参数格式，自动转换并验证资源存在
 */

import { ValidationError } from '../../validators/error.js';
import type { PreprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import type { ApiResponse } from '../../../types.js';

/**
 * 检查字符串是否为 UUID 格式
 * Cocos Creator 支持两种 UUID 格式：
 * 1. 标准 UUID: 8-4-4-4-12 的十六进制字符（如：9f9d4dcb-2795-4781-aaea-c3d31ce699a1）
 * 2. 短 ID: 约22个字符的 base64-like 格式（如：c0y6F5f+pAvI805TdmxIjx）
 */
function isUuidLike(input: string): boolean {
  // 标准 UUID 格式: 8-4-4-4-12
  const standardUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (standardUuidRegex.test(input)) {
    return true;
  }

  // 短 ID 格式: 约20-22个字符，包含字母、数字、+、/
  const shortIdRegex = /^[A-Za-z0-9+/]{20,22}$/i;
  return shortIdRegex.test(input);
}

/**
 * 检查字符串是否为路径格式
 * 支持 db:// 路径或文件系统绝对路径
 */
function isPathLike(input: string): boolean {
  // db:// 路径
  if (input.startsWith('db://')) {
    return true;
  }

  // 绝对路径: Windows (C:\...) 或 Unix (/home/...)
  if (/^[A-Za-z]:\\/.test(input) || input.startsWith('/')) {
    return true;
  }

  return false;
}

/**
 * 自动支持 UUID 或路径两种参数格式
 * - 如果是路径，转换为 UUID
 * - 如果是 UUID，验证资源存在
 * - 打开新场景前自动保存当前场景的未保存更改
 */
export const sceneOpenScenePreprocessor: PreprocessorFn = async (
  params: unknown[],
  client: CocosClient
): Promise<unknown[]> => {
  // 0. 在打开新场景前，检查并保存当前场景的未保存更改
  try {
    const dirtyResponse = await (client as any)._request('POST', '/api/scene/query-dirty', {
      params: [],
    }) as ApiResponse<{ result?: boolean }>;

    if (dirtyResponse.success && dirtyResponse.data?.result === true) {
      console.log('检测到当前场景有未保存的更改，正在自动保存...');

      const saveResponse = await (client as any)._request('POST', '/api/scene/save-scene', {
        params: [],
      }) as ApiResponse;

      if (saveResponse.success) {
        console.log('当前场景已自动保存');
      } else {
        console.warn('自动保存当前场景失败，但将继续打开新场景');
      }
    }
  } catch (error) {
    // 如果检查或保存失败，记录警告但继续打开新场景
    console.warn('检查当前场景状态时出错，将继续打开新场景:', error instanceof Error ? error.message : error);
  }

  if (params.length < 1) {
    return params;
  }

  const [input] = params;

  if (typeof input !== 'string') {
    return params;
  }

  // 如果输入是路径格式，转换为 UUID
  if (isPathLike(input)) {
    try {
      const response = await (client as any)._request('POST', '/api/asset-db/query-uuid', {
        params: [input],
      }) as ApiResponse;

      if (response.success && response.data) {
        // 返回转换后的 UUID
        return [response.data];
      } else {
        throw new ValidationError(
          'scene',
          'open-scene',
          'uuid',
          `无效的资源路径：${input}\n` +
          `请检查路径是否正确`
        );
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      // 如果查询失败，跳过转换让原始 API 提供错误信息
    }
  }

  // 如果输入是 UUID 格式，验证资源存在
  if (isUuidLike(input)) {
    try {
      const response = await (client as any)._request('POST', '/api/asset-db/query-url', {
        params: [input],
      }) as ApiResponse;

      // If query fails or returns no data, the asset doesn't exist
      if (!response.success || !response.data) {
        throw new ValidationError(
          'scene',
          'open-scene',
          'uuid',
          `无效的 UUID：${input}\n` +
          `建议使用资源路径打开，如：db://assets/scenes/Main.scene`
        );
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      // If query fails for other reasons, skip validation (fail open)
      // This allows the actual API call to provide the error message
    }
  }

  return params;
};
