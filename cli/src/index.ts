#!/usr/bin/env node
/**
 * Cocos Skills CLI Entry Point
 * TypeScript port of Python scripts
 * Built with commander
 */

import { Command } from 'commander';
import {
  execute,
  healthCheck,
  getStatus,
  listAllModules,
  listModuleActions,
  getClient,
  isModuleKnown,
} from './lib/client.js';
import { MODULE_DESCRIPTIONS, ACTION_DESCRIPTIONS } from './lib/module-descriptions.js';
import { getActionDetails } from './lib/action-details.js';

/**
 * Check if user is asking for module or action help
 */
function checkModuleHelp(): boolean {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    // Check for: <module> <action> --help or <module> <action> -h
    if (isModuleKnown(arg) && nextArg && nextArg !== '--help' && nextArg !== '-h') {
      const afterNext = args[i + 2];
      if (afterNext === '--help' || afterNext === '-h') {
        // Check if it's a valid action for this module
        const actions = listModuleActions(arg);
        if (actions.includes(nextArg)) {
          showActionHelp(arg, nextArg);
          return true;
        }
      }
    }

    // Check for: <module> --help or <module> -h
    if (isModuleKnown(arg) && (nextArg === '--help' || nextArg === '-h')) {
      showModuleHelp(arg);
      return true;
    }
  }
  return false;
}

/**
 * Show help for a specific module
 */
function showModuleHelp(moduleName: string): void {
  const actions = listModuleActions(moduleName);
  const moduleDesc = MODULE_DESCRIPTIONS[moduleName] || '';
  const actionDescs = ACTION_DESCRIPTIONS[moduleName] || {};

  console.log(`
Module: ${moduleName}
Description: ${moduleDesc}

Available Actions (${actions.length} total):
`);

  // Group actions by category
  const categories = groupActionsByCategory(actions);
  for (const [category, actionList] of Object.entries(categories)) {
    console.log(`\n  ${category}:`);
    for (const action of actionList) {
      const desc = actionDescs[action] || '';
      console.log(`    ${action.padEnd(30)} - ${desc}`);
    }
  }

  console.log(`
Usage:
  cocos-skills ${moduleName} <action> [params...]

Examples:
  cocos-skills ${moduleName} ${actions[0]}
  cocos-skills ${moduleName} --help
  cocos-skills ${moduleName} -h

For action-specific help:
  cocos-skills ${moduleName} <action> --help
`);
}

/**
 * Show detailed help for a specific action
 */
function showActionHelp(moduleName: string, actionName: string): void {
  const moduleDesc = MODULE_DESCRIPTIONS[moduleName] || '';
  const actionDescs = ACTION_DESCRIPTIONS[moduleName] || {};
  const briefDesc = actionDescs[actionName] || '';
  const details = getActionDetails(moduleName, actionName);

  console.log(`
Action: ${moduleName} ${actionName}
Module: ${moduleDesc}
Description: ${briefDesc}
`);

  if (details) {
    // Show parameters
    if (details.parameters.length > 0) {
      console.log('Parameters:');
      for (const param of details.parameters) {
        const required = param.required ? '(required)' : '(optional)';
        console.log(`  ${param.name.padEnd(20)} ${required.padEnd(12)} ${param.type}`);
        console.log(`                      ${param.description}`);
      }
      console.log('');
    } else {
      console.log('Parameters: (none)\n');
    }

    // Show examples
    if (details.examples.length > 0) {
      console.log('Examples:');
      for (const example of details.examples) {
        console.log(`  ${example}`);
      }
      console.log('');
    }

    // Show notes
    if (details.notes) {
      console.log(`Notes: ${details.notes}\n`);
    }
  } else {
    console.log('Detailed help not available for this action.\n');
    console.log(`Usage:\n  cocos-skills ${moduleName} ${actionName} [params...]\n`);
  }
}

/**
 * Group actions by category for better display
 * Categories match the test file structure:
 * - lifecycle.test.ts: 生命周期操作
 * - node-operations.test.ts: 节点操作
 * - component-operations.test.ts: 组件操作
 * - property-operations.test.ts: 属性操作
 * - gizmo-operations.test.ts: Gizmo 操作
 * - query-operations.test.ts: 查询
 * - camera-operations.test.ts: 相机操作
 */
function groupActionsByCategory(actions: string[]): Record<string, string[]> {
  const categories: Record<string, string[]> = {
    '生命周期操作': [],
    '节点操作': [],
    '组件操作': [],
    '属性操作': [],
    'Gizmo 操作': [],
    '查询': [],
    '相机操作': [],
  };

  // Lifecycle operations (lifecycle.test.ts)
  const lifecycleActions = ['query-is-ready', 'open-scene', 'save-scene', 'save-as-scene', 'close-scene', 'soft-reload'];

  // Node operations (node-operations.test.ts)
  const nodeActions = ['create-node', 'remove-node', 'copy-node', 'cut-node', 'paste-node', 'duplicate-node', 'set-parent', 'reset-node', 'restore-prefab', 'reset-component'];

  // Component operations (component-operations.test.ts)
  const componentActions = ['create-component', 'remove-component', 'execute-component-method', 'execute-scene-script'];

  // Property operations (property-operations.test.ts)
  const propertyActions = ['set-property', 'reset-property', 'move-array-element', 'remove-array-element'];

  // Gizmo operations (gizmo-operations.test.ts)
  const gizmoActions = ['change-gizmo-tool', 'query-gizmo-tool-name', 'change-gizmo-pivot', 'query-gizmo-pivot', 'change-gizmo-coordinate', 'query-gizmo-coordinate', 'change-is2D', 'query-is2D', 'set-grid-visible', 'query-is-grid-visible', 'set-icon-gizmo-3d', 'query-is-icon-gizmo-3d', 'set-icon-gizmo-size', 'query-icon-gizmo-size', 'snapshot', 'snapshot-abort'];

  // Camera operations (camera-operations.test.ts)
  const cameraActions = ['focus-camera', 'align-with-view', 'align-view-with-node'];

  // Query operations (query-operations.test.ts)
  const queryActions = ['query-node', 'query-node-tree', 'query-nodes-by-asset-uuid', 'query-dirty', 'query-component', 'query-classes', 'query-components', 'query-component-has-script', 'query-scene-bounds', 'is-native'];

  for (const action of actions) {
    if (lifecycleActions.includes(action)) {
      categories['生命周期操作'].push(action);
    } else if (nodeActions.includes(action)) {
      categories['节点操作'].push(action);
    } else if (componentActions.includes(action)) {
      categories['组件操作'].push(action);
    } else if (propertyActions.includes(action)) {
      categories['属性操作'].push(action);
    } else if (gizmoActions.includes(action)) {
      categories['Gizmo 操作'].push(action);
    } else if (cameraActions.includes(action)) {
      categories['相机操作'].push(action);
    } else if (queryActions.includes(action)) {
      categories['查询'].push(action);
    }
  }

  // Remove empty categories
  for (const key of Object.keys(categories)) {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  }

  return categories;
}

/**
 * Parse JSON parameter
 */
function parseJsonParam(param: string): unknown {
  try {
    return JSON.parse(param);
  } catch {
    return param;
  }
}

/**
 * Parse parameters from command line
 */
function parseParams(params: string[]): unknown[] {
  return params.map(parseJsonParam);
}

// Check for module help before commander processes args
if (checkModuleHelp()) {
  process.exit(0);
}

const program = new Command();

// CLI configuration
program
  .name('cocos-skills')
  .description('Cocos Creator HTTP API Tool')
  .version('1.0.0')
  .option('--json', 'Output in JSON format (default)', true)
  .option('--verbose', 'Show detailed output');

// Global commands
program
  .command('health')
  .description('Check server health')
  .action(async () => {
    const result = await healthCheck();
    console.log(JSON.stringify(result, null, 2));
  });

program
  .command('status')
  .description('Get server status')
  .action(async () => {
    const result = await getStatus();
    console.log(JSON.stringify(result, null, 2));
  });

program
  .command('config')
  .description('Show configuration info')
  .action(() => {
    const client = getClient();
    const serverInfo = client.getServerInfo();
    console.log(JSON.stringify({
      success: true,
      data: {
        baseUrl: client.getBaseUrl(),
        host: serverInfo.host,
        port: serverInfo.port,
      },
    }, null, 2));
  });

program
  .command('list-modules')
  .description('List all available modules')
  .action(() => {
    const modules = listAllModules();
    console.log(JSON.stringify({
      success: true,
      data: {
        modules,
        count: modules.length,
      },
    }, null, 2));
  });

program
  .command('list-actions <module>')
  .description('List actions for a module')
  .action((module) => {
    const actions = listModuleActions(module);
    if (actions.length === 0) {
      console.log(JSON.stringify({
        success: false,
        error: `Unknown module: ${module}`,
        data: null,
      }, null, 2));
      process.exit(1);
      return;
    }
    console.log(JSON.stringify({
      success: true,
      data: {
        module,
        actions,
        count: actions.length,
      },
    }, null, 2));
  });

// Add dynamic module commands
const modules = listAllModules();
for (const moduleName of modules) {
  const moduleDesc = MODULE_DESCRIPTIONS[moduleName] || '';

  program
    .command(`${moduleName} [action] [params...]`)
    .description(moduleDesc)
    .action(async (action, params) => {
      // If no action specified, show module help
      if (!action) {
        showModuleHelp(moduleName);
        return;
      }

      // Parse and execute the action
      const parsedParams = parseParams(params);
      const result = await execute(moduleName, action, parsedParams);
      console.log(JSON.stringify(result, null, 2));

      if (!result.success) {
        process.exit(1);
      }
    });
}

// Parse and execute
program.parseAsync(process.argv).catch((error) => {
  console.error(JSON.stringify({
    success: false,
    error: error instanceof Error ? error.message : String(error),
    data: null,
  }, null, 2));
  process.exit(1);
});
