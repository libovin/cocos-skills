/**
 * Request Processing Pipeline
 *
 * 请求处理管道 - 清晰的四个阶段
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  1. Validator (参数校验)                                     │
 * │     - 同步执行                                               │
 * │     - 验证参数格式、类型、必填项                              │
 * │     - 失败时抛出 ValidationError                              │
 * ├─────────────────────────────────────────────────────────────┤
 * │  2. Preprocessor (前置处理)                                  │
 * │     - 异步执行                                               │
 * │     - 修改/补充参数（如生成默认值、检测循环）                 │
 * │     - 返回处理后的 params                                    │
 * ├─────────────────────────────────────────────────────────────┤
 * │  3. API Call (HTTP 请求)                                    │
 * │     - 发送处理后的参数到 Cocos Creator HTTP Server           │
 * ├─────────────────────────────────────────────────────────────┤
 * │  4. Postprocessor (后置处理)                                 │
 * │     - 异步执行                                               │
 * │     - 处理 API 返回结果（如补充子节点、组件信息）             │
 * │     - 返回处理后的 ApiResponse                               │
 * └─────────────────────────────────────────────────────────────┘
 */

// Re-export all pipeline components
export * from './types.js';
export * from './validator.js';
export * from './preprocessor.js';
export * from './postprocessor.js';
export * from './pipeline.js';
