/**
 * Cocos Creator HTTP Client
 * Ported from scripts/client.py:157-399
 */
import type { ApiResponse } from '../types.js';
/**
 * Client configuration
 */
export interface ClientConfig {
    baseUrl?: string;
    timeout?: number;
    validate?: boolean;
}
export declare class CocosClient {
    private baseUrl;
    private timeout;
    private validate;
    constructor(config?: ClientConfig);
    /**
     * Send HTTP request
     * @param method HTTP method
     * @param endpoint API endpoint
     * @param data Request data
     * @returns API response
     */
    private _request;
    /**
     * Health check
     * @returns API response
     */
    healthCheck(): Promise<ApiResponse>;
    /**
     * Get server status
     * @returns API response
     */
    getStatus(): Promise<ApiResponse>;
    /**
     * Get all available modules
     * @returns API response
     */
    getModules(): Promise<ApiResponse>;
    /**
     * Get actions for a specific module
     * @param module Module name
     * @returns API response
     */
    getModuleActions(module: string): Promise<ApiResponse>;
    /**
     * Execute an API call
     * @param module Module name
     * @param action Action name
     * @param params Parameters array
     * @param validate Whether to validate module/action
     * @returns API response
     */
    execute(module: string, action: string, params?: unknown[], validate?: boolean): Promise<ApiResponse>;
    /**
     * Invalidate cached modules
     */
    invalidateCache(): void;
    /**
     * Get base URL
     */
    getBaseUrl(): string;
    /**
     * Get server info (host, port)
     */
    getServerInfo(): {
        host: string;
        port: number;
    };
}
/**
 * Get global client instance
 * @param config Optional client configuration
 * @returns Client instance
 */
export declare function getClient(config?: ClientConfig): CocosClient;
/**
 * Reset global client instance
 */
export declare function resetClient(): void;
/**
 * Health check
 */
export declare function healthCheck(): Promise<ApiResponse>;
/**
 * Get server status
 */
export declare function getStatus(): Promise<ApiResponse>;
/**
 * Get all available modules
 */
export declare function getModules(): Promise<ApiResponse>;
/**
 * Get actions for a specific module
 */
export declare function getModuleActions(module: string): Promise<ApiResponse>;
/**
 * Execute an API call
 */
export declare function execute(module: string, action: string, params?: unknown[]): Promise<ApiResponse>;
/**
 * Validate module and action
 */
export declare function validateModuleActionSync(module: string, action: string): boolean;
/**
 * Get local known modules and actions
 */
export { listAllModules, listModuleActions, isModuleKnown, isActionKnown } from './validator.js';
/**
 * Re-export types
 */
export type { ApiResponse } from '../types.js';
//# sourceMappingURL=client.d.ts.map