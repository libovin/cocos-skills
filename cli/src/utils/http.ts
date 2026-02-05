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
export async function request(options: RequestOptions): Promise<ApiResponse> {
  const { method, url, data, timeout = 30000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    };

    if (method === 'POST' && data !== undefined) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    const result = await response.json();
    return result;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: `Request timeout after ${timeout}ms`,
          data: null,
        };
      }

      // Check for connection errors
      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        return {
          success: false,
          error: `Connection failed: ${error.message}`,
          data: null,
        };
      }

      return {
        success: false,
        error: error.message,
        data: null,
      };
    }

    return {
      success: false,
      error: 'Unknown error',
      data: null,
    };
  }
}
