/**
 * Pipeline Types
 * 定义管道中各阶段使用的类型
 */
import type { ApiResponse } from '../../types.js';
import type { CocosClient } from '../client.js';
/**
 * 参数校验器类型
 * @param params 原始参数数组
 * @throws ValidationError 如果校验失败
 */
export type ValidatorFn = (params: unknown[]) => void;
/**
 * 前置处理器类型
 * @param params 原始参数数组
 * @param client CocosClient 实例（可用于查询场景信息等）
 * @returns 处理后的参数数组，或 PipelineResult（用于跳过 API 调用）
 * @throws ValidationError 如果处理中发现问题（如循环检测）
 */
export type PreprocessorFn = (params: unknown[], client: CocosClient) => Promise<unknown[] | PipelineResult> | unknown[] | PipelineResult;
/**
 * 后置处理器类型
 * @param result API 返回的原始结果
 * @param originalParams 原始参数数组（某些场景可能需要）
 * @param client CocosClient 实例
 * @returns 处理后的 ApiResponse
 */
export type PostprocessorFn = (result: ApiResponse, originalParams: unknown[], client: CocosClient) => Promise<ApiResponse> | ApiResponse;
/**
 * 管道处理结果
 */
export interface PipelineResult {
    /** 处理后的参数 */
    params: unknown[];
    /** 后置处理函数（可选） */
    postprocessor?: PostprocessorFn;
    /** 跳过 API 调用并直接返回成功响应（可选） */
    skipApiCall?: boolean;
    /** 当 skipApiCall 为 true 时，返回的响应数据 */
    skipResponse?: ApiResponse;
}
/**
 * 管道配置
 * 用于注册某个 module/action 的处理器
 */
export interface PipelineConfig {
    /** 参数校验器（可选） */
    validator?: ValidatorFn;
    /** 前置处理器（可选） */
    preprocessor?: PreprocessorFn;
    /** 后置处理器（可选） */
    postprocessor?: PostprocessorFn;
}
//# sourceMappingURL=types.d.ts.map