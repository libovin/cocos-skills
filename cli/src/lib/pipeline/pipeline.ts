/**
 * Request Pipeline
 * 请求处理管道
 *
 * 负责协调校验器、前置处理器、后置处理器的执行顺序
 */

import { getValidator } from './validator.js';
import { getPreprocessor } from './preprocessor.js';
import { getPostprocessor } from './postprocessor.js';
import type { CocosClient } from '../client.js';
import type { ApiResponse } from '../../types.js';
import type { PipelineResult } from './types.js';

/**
 * Process request through the pipeline
 * @param module Module name
 * @param action Action name
 * @param params Original parameters
 * @param client CocosClient instance
 * @returns Pipeline result with processed params and optional postprocessor
 */
export async function processRequest(
  module: string,
  action: string,
  params: unknown[],
  client: CocosClient
): Promise<PipelineResult> {
  let processedParams = params;

  // Step 1: Validator (synchronous)
  const validator = getValidator(module, action);
  if (validator) {
    validator(processedParams);
  }

  // Step 2: Preprocessor (asynchronous)
  const preprocessor = getPreprocessor(module, action);
  if (preprocessor) {
    const preprocessorResult = await preprocessor(processedParams, client);

    // Check if preprocessor returned a PipelineResult (for skipApiCall feature)
    if (
      typeof preprocessorResult === 'object' &&
      preprocessorResult !== null &&
      'params' in preprocessorResult
    ) {
      // It's a PipelineResult, return it directly
      return preprocessorResult as PipelineResult;
    }

    processedParams = Array.isArray(preprocessorResult) ? preprocessorResult : [preprocessorResult];
  }

  // Return processed params and optional postprocessor
  return {
    params: processedParams,
    postprocessor: getPostprocessor(module, action),
  };
}

/**
 * Process API response through postprocessor
 * @param module Module name
 * @param action Action name
 * @param result API response
 * @param originalParams Original parameters
 * @param client CocosClient instance
 * @returns Processed API response
 */
export async function processResponse(
  module: string,
  action: string,
  result: ApiResponse,
  originalParams: unknown[],
  client: CocosClient
): Promise<ApiResponse> {
  const postprocessor = getPostprocessor(module, action);
  if (!postprocessor) {
    return result;
  }

  return postprocessor(result, originalParams, client);
}
