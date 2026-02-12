/**
 * Cocos Creator HTTP Client
 * Ported from scripts/client.py:157-399
 */

import { request } from '../utils/http.js';
import { loadServerUrl, getDefaultServerUrl, parseServerUrl } from './config.js';
import { validateModuleAction, invalidateCache } from './validator.js';
import { processRequest, processResponse } from './pipeline/pipeline.js';
import { initPipeline } from './init-pipeline.js';
import type { ApiResponse } from '../types.js';

/**
 * Client configuration
 */
export interface ClientConfig {
  baseUrl?: string;
  timeout?: number;
  validate?: boolean;
}
export class CocosClient {
  private baseUrl: string;
  private timeout: number;
  private validate: boolean;

  constructor(config: ClientConfig = {}) {
    // Initialize pipeline (register validators, preprocessors, postprocessors)
    // This is safe to call multiple times - it will only initialize once
    initPipeline();

    // Try to load from config file first
    const configUrl = loadServerUrl();

    if (config.baseUrl) {
      this.baseUrl = config.baseUrl;
    } else if (configUrl) {
      this.baseUrl = configUrl;
    } else {
      this.baseUrl = getDefaultServerUrl();
    }

    this.timeout = config.timeout ?? 30000;
    this.validate = config.validate ?? true;
  }

  /**
   * Send HTTP request
   * @param method HTTP method
   * @param endpoint API endpoint
   * @param data Request data
   * @returns API response
   */
  private async _request(
    method: 'GET' | 'POST',
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    return request({ method, url, data, timeout: this.timeout });
  }

  /**
   * Health check
   * @returns API response
   */
  async healthCheck(): Promise<ApiResponse> {
    return this._request('GET', '/api/server/health');
  }

  /**
   * Get server status
   * @returns API response
   */
  async getStatus(): Promise<ApiResponse> {
    return this._request('GET', '/api/server/status');
  }

  /**
   * Get all available modules
   * @returns API response
   */
  async getModules(): Promise<ApiResponse> {
    return this._request('GET', '/api/modules');
  }

  /**
   * Get actions for a specific module
   * @param module Module name
   * @returns API response
   */
  async getModuleActions(module: string): Promise<ApiResponse> {
    return this._request('GET', `/api/modules/${module}/actions`);
  }

  /**
 * Execute an API call
 * @param module Module name
 * @param action Action name
 * @param params Parameters array
 * @param validate Whether to validate module/action
 * @returns API response
 */
  async execute(
    module: string,
    action: string,
    params: unknown[] = [],
    validate?: boolean
  ): Promise<ApiResponse> {
    const shouldValidate = validate ?? this.validate;

    // Validate module and action
    if (shouldValidate) {
      validateModuleAction(module, action, false);
    }

    // Process request through pipeline (validator -> preprocessor)
    const pipelineResult = await processRequest(module, action, params, this);
    const processedParams = pipelineResult.params;

    // Check if preprocessor wants to skip the API call
    if (pipelineResult.skipApiCall) {
      const skipResult = pipelineResult.skipResponse || { success: true };

      // Check if preprocessor wants to skip the postprocessor
      if (pipelineResult.skipPostProcessor) {
        // Return skipResponse directly without calling postprocessor
        return skipResult;
      }

      // Pass skipResponse to postprocessor for further processing
      const finalResult = await processResponse(
        module,
        action,
        skipResult,
        processedParams,
        this
      );
      return finalResult;
    }

    // Make API call
    const result = await this._request('POST', `/api/${module}/${action}`, {
      params: processedParams,
    });

    // Process response through postprocessor
    // Pass processedParams (which may contain metadata from preprocessor)
    const finalResult = await processResponse(
      module,
      action,
      result,
      processedParams,
      this
    );

    return finalResult;
  }

  /**
   * Execute an API call in raw mode (no validation, no preprocessing/postprocessing)
   * @param module Module name
   * @param action Action name
   * @param params Parameters array
   * @returns Raw API response
   */
  async executeRaw(
    module: string,
    action: string,
    params: unknown[] = []
  ): Promise<ApiResponse> {
    // Make API call directly without any processing
    const result = await this._request('POST', `/api/${module}/${action}`, {
      params,
    });
    return result;
  }

  /**
   * Invalidate cached modules
   */
  invalidateCache(): void {
    invalidateCache();
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Get server info (host, port)
   */
  getServerInfo(): { host: string; port: number } {
    return parseServerUrl(this.baseUrl);
  }
}

/**
 * Global client instance (singleton pattern)
 */
let globalClient: CocosClient | null = null;

/**
 * Get global client instance
 * @param config Optional client configuration
 * @returns Client instance
 */
export function getClient(config?: ClientConfig): CocosClient {
  if (globalClient === null) {
    globalClient = new CocosClient(config);
  }
  return globalClient;
}

/**
 * Reset global client instance
 */
export function resetClient(): void {
  globalClient = null;
}

// ============================================================================
// Global convenience functions
// ============================================================================

/**
 * Health check
 */
export async function healthCheck(): Promise<ApiResponse> {
  const client = getClient();
  return client.healthCheck();
}

/**
 * Get server status
 */
export async function getStatus(): Promise<ApiResponse> {
  const client = getClient();
  return client.getStatus();
}

/**
 * Get all available modules
 */
export async function getModules(): Promise<ApiResponse> {
  const client = getClient();
  return client.getModules();
}

/**
 * Get actions for a specific module
 */
export async function getModuleActions(module: string): Promise<ApiResponse> {
  const client = getClient();
  return client.getModuleActions(module);
}

/**
 * Execute an API call
 */
export async function execute(
  module: string,
  action: string,
  params?: unknown[]
): Promise<ApiResponse> {
  const client = getClient();
  return client.execute(module, action, params);
}

/**
 * Execute an API call in raw mode (no validation, no preprocessing/postprocessing)
 */
export async function executeRaw(
  module: string,
  action: string,
  params?: unknown[]
): Promise<ApiResponse> {
  const client = getClient();
  return client.executeRaw(module, action, params);
}

/**
 * Validate module and action
 */
export function validateModuleActionSync(module: string, action: string): boolean {
  try {
    validateModuleAction(module, action, false);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get local known modules and actions
 */
export { listAllModules, listModuleActions, isModuleKnown, isActionKnown } from './validator.js';

/**
 * Re-export types
 */
export type { ApiResponse } from '../types.js';
