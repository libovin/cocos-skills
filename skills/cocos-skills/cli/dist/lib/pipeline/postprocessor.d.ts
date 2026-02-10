/**
 * Postprocessor Manager
 * 后置处理器管理
 *
 * 负责管理所有后置处理器
 * 后置处理器在 API 返回结果后异步执行，用于处理/补充返回数据
 * 常见用途：
 * - 补充子节点信息（如 create-node 创建子节点后返回子节点 UUID）
 * - 补充组件信息（如添加组件后返回组件详情）
 * - 结果格式转换（如将返回值转换为更友好的格式）
 */
import type { PostprocessorFn } from './types.js';
/**
 * Register a postprocessor
 */
export declare function registerPostprocessor(module: string, action: string, postprocessor: PostprocessorFn): void;
/**
 * Get a postprocessor
 */
export declare function getPostprocessor(module: string, action: string): PostprocessorFn | undefined;
/**
 * Check if a postprocessor exists
 */
export declare function hasPostprocessor(module: string, action: string): boolean;
/**
 * Get all registered postprocessor keys
 */
export declare function getRegisteredPostprocessors(): string[];
//# sourceMappingURL=postprocessor.d.ts.map