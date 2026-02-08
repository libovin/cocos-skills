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
 * Preprocessor registry
 */
class PreprocessorRegistry {
  private preprocessors: Map<string, PreprocessorFn> = new Map();

  /**
   * Register a preprocessor for a specific module/action
   * @param key Key in format "module:action"
   * @param preprocessor Preprocessor function
   */
  register(key: string, preprocessor: PreprocessorFn): void {
    this.preprocessors.set(key, preprocessor);
  }

  /**
   * Get a preprocessor for a specific module/action
   * @param module Module name
   * @param action Action name
   * @returns Preprocessor function or undefined
   */
  get(module: string, action: string): PreprocessorFn | undefined {
    return this.preprocessors.get(`${module}:${action}`);
  }

  /**
   * Check if a preprocessor exists
   */
  has(module: string, action: string): boolean {
    return this.preprocessors.has(`${module}:${action}`);
  }

  /**
   * Get all registered keys
   */
  keys(): string[] {
    return Array.from(this.preprocessors.keys());
  }
}

/**
 * Global preprocessor registry instance
 */
const registry = new PreprocessorRegistry();

/**
 * Register a preprocessor
 */
export function registerPreprocessor(
  module: string,
  action: string,
  preprocessor: PreprocessorFn
): void {
  registry.register(`${module}:${action}`, preprocessor);
}

/**
 * Get a preprocessor
 */
export function getPreprocessor(module: string, action: string): PreprocessorFn | undefined {
  return registry.get(module, action);
}

/**
 * Check if a preprocessor exists
 */
export function hasPreprocessor(module: string, action: string): boolean {
  return registry.has(module, action);
}

/**
 * Get all registered preprocessor keys
 */
export function getRegisteredPreprocessors(): string[] {
  return registry.keys();
}
