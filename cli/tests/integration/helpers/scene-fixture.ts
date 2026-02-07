/**
 * Scene fixture helper for integration tests
 *
 * Provides utilities for setting up and tearing down test scenes,
 * creating test nodes, and managing test lifecycle.
 */

import type { CocosClient } from '../../../src/lib/client.js';
import type { ApiResponse } from '../../../src/types.js';

/**
 * Test node information
 */
export interface TestNodeInfo {
  uuid: string;
  name: string;
  path: string;
}

/**
 * Test scene information
 */
export interface TestSceneInfo {
  path: string;
  name: string;
  ready: boolean;
}

/**
 * Options for creating test nodes
 */
export interface CreateNodeOptions {
  parent?: string;
  name?: string;
}

/**
 * Scene fixture helper class
 */
export class SceneFixture {
  private client: CocosClient;
  private testNodes: TestNodeInfo[] = [];
  private testScenePath: string;
  private testSceneName: string;
  private isAvailable: boolean = false;

  /**
   * Create a new SceneFixture
   * @param client CocosClient instance
   * @param scenePath Test scene path (default: db://assets/IntegrationTest.scene)
   * @param sceneName Test scene name (default: IntegrationTest)
   */
  constructor(client: CocosClient, scenePath: string = 'db://assets/IntegrationTest.scene', sceneName: string = 'IntegrationTest') {
    this.client = client;
    this.testScenePath = scenePath;
    this.testSceneName = sceneName;
  }

  /**
   * Setup test scene
   * Checks server availability, creates test scene if needed
   * @returns Test scene info or null if server unavailable
   */
  async setup(): Promise<TestSceneInfo | null> {
    try {
      // Check if server is available
      const healthResponse = await this.client.healthCheck();
      if (!healthResponse.success) {
        this.isAvailable = false;
        return null;
      }

      this.isAvailable = true;

      // Check if test scene exists by trying to query it
      const existingScene = await this.client.execute('asset-db', 'query-asset-info', [this.testScenePath]);

      // Create test scene if it doesn't exist
      if (!existingScene.success) {
        const createResult = await this.client.execute('asset-db', 'create-asset', [
          this.testScenePath,
          {
            _name: this.testSceneName,
            scene: {
              autoReleaseAssets: false,
              _name: this.testSceneName,
              _id: ' IntegrationTest',
              children: [],
              globals: {
                lightmaps: [],
                custom: {},
              },
            },
          },
        ]);

        if (!createResult.success) {
          return null;
        }
      }

      // Open the test scene
      const openResult = await this.client.execute('scene', 'open-scene', [this.testScenePath]);
      if (!openResult.success) {
        return null;
      }

      // Wait for scene to be ready
      await this.waitForReady();

      return {
        path: this.testScenePath,
        name: this.testSceneName,
        ready: true,
      };
    } catch (error) {
      this.isAvailable = false;
      return null;
    }
  }

  /**
   * Create a test node
   * @param options Node creation options
   * @returns Test node info or null if failed
   */
  async createTestNode(options: CreateNodeOptions = {}): Promise<TestNodeInfo | null> {
    if (!this.isAvailable) {
      return null;
    }

    try {
      const nodeOptions = {
        parent: options.parent,
        name: options.name || `TestNode_${Date.now()}`,
      };

      const result = await this.client.execute('scene', 'create-node', [nodeOptions]);
      if (!result.success || !result.data) {
        return null;
      }

      const uuid = result.data.uuid || result.data || '';

      // Query the node tree to get the actual path
      const path = await this.getNodePath(uuid);

      const nodeInfo: TestNodeInfo = {
        uuid,
        name: nodeOptions.name,
        path: path || '',
      };

      this.testNodes.push(nodeInfo);
      return nodeInfo;
    } catch {
      return null;
    }
  }

  /**
   * Create a node with a component
   * @param name Node name
   * @param component Component type (e.g., 'cc.Sprite', 'cc.Label')
   * @returns Test node info or null if failed
   */
  async createNodeWithComponent(name: string, component: string): Promise<TestNodeInfo | null> {
    if (!this.isAvailable) {
      return null;
    }

    try {
      // First create the node
      const nodeInfo = await this.createTestNode({ name });
      if (!nodeInfo) {
        return null;
      }

      // Then add the component
      const componentResult = await this.client.execute('scene', 'create-component', [
        {
          uuid: nodeInfo.uuid,
          component,
        },
      ]);

      if (!componentResult.success) {
        // Clean up the node if component creation failed
        await this.cleanupSingleNode(nodeInfo);
        return null;
      }

      return nodeInfo;
    } catch {
      return null;
    }
  }

  /**
   * Get UUID for a node path
   * @param path Node path (e.g., '/Canvas/TestNode')
   * @returns UUID or null if not found
   */
  async getNodeUuid(path: string): Promise<string | null> {
    if (!this.isAvailable) {
      return null;
    }

    try {
      // Query node tree to find the node
      const result = await this.client.execute('scene', 'query-node-tree');
      if (!result.success || !result.data) {
        return null;
      }

      // Find node by path in the tree
      const findNodeByPath = (nodes: any[], targetPath: string, currentPath: string = ''): string | null => {
        for (const node of nodes) {
          const nodePath = `${currentPath}/${node.name}`;
          if (nodePath === targetPath) {
            return node.uuid;
          }
          if (node.children && node.children.length > 0) {
            const found = findNodeByPath(node.children, targetPath, nodePath);
            if (found) {
              return found;
            }
          }
        }
        return null;
      };

      return findNodeByPath(result.data, path);
    } catch {
      return null;
    }
  }

  /**
   * Get path for a node UUID
   * @param uuid Node UUID
   * @returns Path or null if not found
   */
  async getNodePath(uuid: string): Promise<string | null> {
    if (!this.isAvailable) {
      return null;
    }

    try {
      // Query node tree to find the node
      const result = await this.client.execute('scene', 'query-node-tree');
      if (!result.success || !result.data) {
        return null;
      }

      // Find node by UUID in the tree
      const findNodeByUuid = (nodes: any[], targetUuid: string, currentPath: string = ''): string | null => {
        for (const node of nodes) {
          const nodePath = `${currentPath}/${node.name}`;
          if (node.uuid === targetUuid) {
            return nodePath;
          }
          if (node.children && node.children.length > 0) {
            const found = findNodeByUuid(node.children, targetUuid, nodePath);
            if (found) {
              return found;
            }
          }
        }
        return null;
      };

      return findNodeByUuid(result.data, uuid);
    } catch {
      return null;
    }
  }

  /**
   * Wait for scene to be ready
   * @param timeout Timeout in milliseconds (default: 5000)
   * @returns true if ready, false if timeout
   */
  async waitForReady(timeout: number = 5000): Promise<boolean> {
    if (!this.isAvailable) {
      return false;
    }

    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        const result = await this.client.execute('scene', 'query-is-ready');
        if (result.success && result.data === true) {
          return true;
        }
      } catch {
        // Ignore errors and retry
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return false;
  }

  /**
   * Clean up a single node
   * @param nodeInfo Node to clean up
   */
  private async cleanupSingleNode(nodeInfo: TestNodeInfo): Promise<void> {
    if (!nodeInfo.path) {
      return;
    }

    try {
      await this.client.execute('scene', 'remove-node', [nodeInfo.path]);
    } catch {
      // Ignore cleanup errors
    }
  }

  /**
   * Clean up all test nodes created during tests
   */
  async cleanupTestNodes(): Promise<void> {
    if (!this.isAvailable || this.testNodes.length === 0) {
      return;
    }

    // Remove nodes in reverse order (children first)
    for (let i = this.testNodes.length - 1; i >= 0; i--) {
      await this.cleanupSingleNode(this.testNodes[i]);
    }

    this.testNodes = [];
  }

  /**
   * Teardown test scene
   * Closes scene and cleans up created assets
   */
  async teardown(): Promise<void> {
    if (!this.isAvailable) {
      return;
    }

    try {
      // Clean up test nodes first
      await this.cleanupTestNodes();

      // Save and close the test scene
      await this.client.execute('scene', 'save-scene');
      await this.client.execute('scene', 'close-scene');

      // Optionally delete the test scene asset
      // Uncomment if you want to clean up the test scene file
      // await this.client.execute('asset-db', 'delete-asset', [this.testScenePath]);
    } catch {
      // Ignore teardown errors
    }

    this.isAvailable = false;
  }

  /**
   * Check if the server is available
   */
  isServerAvailable(): boolean {
    return this.isAvailable;
  }

  /**
   * Get the test scene path
   */
  getTestScenePath(): string {
    return this.testScenePath;
  }

  /**
   * Get the test scene name
   */
  getTestSceneName(): string {
    return this.testSceneName;
  }

  /**
   * Get all created test nodes
   */
  getTestNodes(): TestNodeInfo[] {
    return [...this.testNodes];
  }
}
