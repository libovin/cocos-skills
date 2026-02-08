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
 * Postprocessor registry
 */
class PostprocessorRegistry {
  private postprocessors: Map<string, PostprocessorFn> = new Map();

  /**
   * Register a postprocessor for a specific module/action
   * @param key Key in format "module:action"
   * @param postprocessor Postprocessor function
   */
  register(key: string, postprocessor: PostprocessorFn): void {
    this.postprocessors.set(key, postprocessor);
  }

  /**
   * Get a postprocessor for a specific module/action
   * @param module Module name
   * @param action Action name
   * @returns Postprocessor function or undefined
   */
  get(module: string, action: string): PostprocessorFn | undefined {
    return this.postprocessors.get(`${module}:${action}`);
  }

  /**
   * Check if a postprocessor exists
   */
  has(module: string, action: string): boolean {
    return this.postprocessors.has(`${module}:${action}`);
  }

  /**
   * Get all registered keys
   */
  keys(): string[] {
    return Array.from(this.postprocessors.keys());
  }
}

/**
 * Global postprocessor registry instance
 */
const registry = new PostprocessorRegistry();

/**
 * Register a postprocessor
 */
export function registerPostprocessor(
  module: string,
  action: string,
  postprocessor: PostprocessorFn
): void {
  registry.register(`${module}:${action}`, postprocessor);
}

/**
 * Get a postprocessor
 */
export function getPostprocessor(module: string, action: string): PostprocessorFn | undefined {
  return registry.get(module, action);
}

/**
 * Check if a postprocessor exists
 */
export function hasPostprocessor(module: string, action: string): boolean {
  return registry.has(module, action);
}

/**
 * Get all registered postprocessor keys
 */
export function getRegisteredPostprocessors(): string[] {
  return registry.keys();
}
