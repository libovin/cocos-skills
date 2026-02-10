/**
 * HTTP request utility for Cocos Creator API
 * Uses native fetch (Node.js 18+)
 */
import type { ApiResponse } from '../types.js';
export interface RequestOptions {
    method: 'GET' | 'POST';
    url: string;
    data?: unknown;
    timeout?: number;
}
/**
 * Send HTTP request to Cocos Creator HTTP server
 * @param options Request options
 * @returns API response
 */
export declare function request(options: RequestOptions): Promise<ApiResponse>;
//# sourceMappingURL=http.d.ts.map