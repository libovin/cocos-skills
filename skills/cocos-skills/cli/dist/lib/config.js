/**
 * Configuration management for Cocos Creator HTTP client
 * Reads from ~/.cocos-http/cocos-http.json
 * Ported from scripts/client.py:183-231
 */
import { homedir } from 'node:os';
import { join } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
const CONFIG_DIR = join(homedir(), '.cocos-http');
const CONFIG_PATH = join(CONFIG_DIR, 'cocos-http.json');
/**
 * Load server URL from configuration file
 * @returns Server URL or null if not found
 */
export function loadServerUrl() {
    try {
        // Check if config file exists
        if (!existsSync(CONFIG_PATH)) {
            return null;
        }
        const content = readFileSync(CONFIG_PATH, 'utf-8');
        const config = JSON.parse(content);
        // Try to get URL by current project name
        const projectName = getCurrentProjectName();
        if (projectName && config.projects[projectName]) {
            return config.projects[projectName].serverUrl;
        }
        // Fallback to currentProject from config
        if (config.currentProject && config.projects[config.currentProject]) {
            return config.projects[config.currentProject].serverUrl;
        }
    }
    catch (error) {
        // Silent fail on error
        if (error instanceof Error) {
            // Could log debug info here in verbose mode
        }
    }
    return null;
}
/**
 * Get current project name from environment or working directory
 * @returns Project name or null
 */
function getCurrentProjectName() {
    // Try environment variable first
    const projectPath = process.env.COCOS_PROJECT_PATH;
    if (projectPath) {
        return extractProjectName(projectPath);
    }
    // Try to detect from current working directory
    try {
        const currentPath = process.cwd();
        return findProjectPath(currentPath);
    }
    catch {
        return null;
    }
}
/**
 * Extract project name from path
 * @param path Project path
 * @returns Project name
 */
function extractProjectName(path) {
    const parts = path.replace(/\\/g, '/').split('/');
    return parts[parts.length - 1] || '';
}
/**
 * Find project path by walking up the directory tree
 * @param startPath Starting directory
 * @returns Project name or null
 */
function findProjectPath(startPath) {
    let currentPath = startPath;
    const maxIterations = 5;
    for (let i = 0; i < maxIterations; i++) {
        // Check for Cocos Creator project markers
        const hasSettings = existsSync(join(currentPath, 'settings'));
        const hasAssets = existsSync(join(currentPath, 'assets'));
        if (hasSettings || hasAssets) {
            return extractProjectName(currentPath);
        }
        // Move up one directory
        const parentPath = join(currentPath, '..');
        if (parentPath === currentPath) {
            break; // Reached root
        }
        currentPath = parentPath;
    }
    return null;
}
/**
 * Get default server URL
 * @returns Default URL (http://127.0.0.1:54321)
 */
export function getDefaultServerUrl() {
    return 'http://127.0.0.1:54321';
}
/**
 * Parse host and port from server URL
 * @param serverUrl Server URL
 * @returns Object with host and port
 */
export function parseServerUrl(serverUrl) {
    try {
        const url = new URL(serverUrl);
        const port = url.port ? parseInt(url.port, 10) : 54321;
        return {
            host: url.hostname,
            port,
        };
    }
    catch {
        return {
            host: '127.0.0.1',
            port: 54321,
        };
    }
}
//# sourceMappingURL=config.js.map