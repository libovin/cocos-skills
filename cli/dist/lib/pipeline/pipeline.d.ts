/**
 * Request Pipeline
 * 请求处理管道
 *
 * 负责协调校验器、前置处理器、后置处理器的执行顺序
 */
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
export declare function processRequest(module: string, action: string, params: unknown[], client: CocosClient): Promise<PipelineResult>;
/**
 * Process API response through postprocessor
 * @param module Module name
 * @param action Action name
 * @param result API response
 * @param originalParams Original parameters
 * @param client CocosClient instance
 * @returns Processed API response
 */
export declare function processResponse(module: string, action: string, result: ApiResponse, originalParams: unknown[], client: CocosClient): Promise<ApiResponse>;
//# sourceMappingURL=pipeline.d.ts.map