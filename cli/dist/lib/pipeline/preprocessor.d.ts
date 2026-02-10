/**
 * Preprocessor Manager
 * 前置处理器管理
 *
 * 负责管理所有前置处理器
 * 前置处理器在发送请求前异步执行，用于修改/补充参数
 * 常见用途：
 * - 生成默认值（如 create-asset 的默认数据）
 * - 参数转换（如路径格式转换）
 * - 业务逻辑校验（如 set-parent 的循环检测）
 */
import type { PreprocessorFn } from './types.js';
/**
 * Register a preprocessor
 */
export declare function registerPreprocessor(module: string, action: string, preprocessor: PreprocessorFn): void;
/**
 * Get a preprocessor
 */
export declare function getPreprocessor(module: string, action: string): PreprocessorFn | undefined;
/**
 * Check if a preprocessor exists
 */
export declare function hasPreprocessor(module: string, action: string): boolean;
/**
 * Get all registered preprocessor keys
 */
export declare function getRegisteredPreprocessors(): string[];
//# sourceMappingURL=preprocessor.d.ts.map