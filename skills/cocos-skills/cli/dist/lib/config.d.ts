/**
 * Configuration management for Cocos Creator HTTP client
 * Reads from ~/.cocos-http/cocos-http.json
 * Ported from scripts/client.py:183-231
 */
/**
 * Load server URL from configuration file
 * @returns Server URL or null if not found
 */
export declare function loadServerUrl(): string | null;
/**
 * Get default server URL
 * @returns Default URL (http://127.0.0.1:54321)
 */
export declare function getDefaultServerUrl(): string;
/**
 * Parse host and port from server URL
 * @param serverUrl Server URL
 * @returns Object with host and port
 */
export declare function parseServerUrl(serverUrl: string): {
    host: string;
    port: number;
};
//# sourceMappingURL=config.d.ts.map