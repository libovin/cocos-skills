#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const rootDir = dirname(scriptsDir);

const tsContent = readFileSync(join(rootDir, 'cli', 'src', 'types.ts'), 'utf-8');
// 读取 details/index.ts 而不是 action-details.ts
const detailsContent = readFileSync(join(rootDir, 'cli', 'src', 'lib', 'details', 'index.ts'), 'utf-8');
const pyContent = readFileSync(join(rootDir, 'scripts', 'client.py'), 'utf-8');

// 从 types.ts 提取 VALID_MODULES
const tsModules = {};
const tsModuleRegex = /(\w+|'[^']+'):\s*\[\s*([\s\S]*?)\s*\]\s*as\s*const,/g;
let match;
while ((match = tsModuleRegex.exec(tsContent)) !== null) {
  const key = match[1].replace(/'/g, '');
  const actions = [];
  const actionRegex = /'([^']+)'/g;
  let actionMatch;
  while ((actionMatch = actionRegex.exec(match[2])) !== null) {
    actions.push(actionMatch[1]);
  }
  tsModules[key] = actions;
}

// 从 details/ 目录读取每个模块文件
const adModules = {};
const moduleKeys = ['scene', 'asset-db', 'project', 'builder', 'engine', 'information', 'preferences', 'program', 'programming', 'server', 'device', 'extension'];

// 首先从 details 目录读取每个模块文件
for (const mod of moduleKeys) {
  try {
    const modContent = readFileSync(join(rootDir, 'cli', 'src', 'lib', 'details', `${mod}.ts`), 'utf-8');
    const actions = [];
    // 匹配 export const xxxDetails: ModuleActionDetails = { ... } 中的 action 名称
    const actionRegex = /'([^']+)':\s*\{/g;
    let actionMatch;
    while ((actionMatch = actionRegex.exec(modContent)) !== null) {
      actions.push(actionMatch[1]);
    }
    adModules[mod] = actions;
  } catch (e) {
    adModules[mod] = [];
  }
}

// 从 Python client.py 提取 VALID_MODULES
const pyModules = {};

const validModulesStart = pyContent.indexOf('VALID_MODULES: Dict[str, Set[str]] = {');
const validModulesContent = pyContent.substring(validModulesStart);

// 匹配每个模块的定义
const modulePattern = /"([^"]+)":\s*\{[\s\S]*?\n\s*\}/g;
let moduleMatch;

while ((moduleMatch = modulePattern.exec(validModulesContent)) !== null) {
  const moduleName = moduleMatch[1];
  const moduleContent = moduleMatch[0];

  // 使用 exec 逐个提取 action 名称（捕获组）
  const actionPattern = /"([^"]+)"/g;
  const actions = [];
  let actionMatch;

  while ((actionMatch = actionPattern.exec(moduleContent)) !== null) {
    actions.push(actionMatch[1]);  // 捕获组1是不带引号的字符串
  }

  // 移除第一个元素（模块名本身）
  if (actions.length > 0) {
    actions.shift();  // 移除模块名
  }

  pyModules[moduleName] = actions;
}

console.log('\n========================================');
console.log('VALID_MODULES 完整验证报告');
console.log('========================================\n');

const allModules = [...new Set([
  ...Object.keys(tsModules),
  ...Object.keys(adModules),
  ...Object.keys(pyModules)
])].sort();

let allMatch = true;
const differences = [];

for (const module of allModules) {
  const tsActions = new Set(tsModules[module] || []);
  const adActions = new Set(adModules[module] || []);
  const pyActions = new Set(pyModules[module] || []);

  const tsOnly = [...tsActions].filter(a => !adActions.has(a) || !pyActions.has(a));
  const adOnly = [...adActions].filter(a => !tsActions.has(a) || !pyActions.has(a));
  const pyOnly = [...pyActions].filter(a => !tsActions.has(a) || !adActions.has(a));

  console.log(`模块: ${module}`);
  console.log(`  types.ts:          ${tsActions.size} actions`);
  console.log(`  action-details.ts: ${adActions.size} actions`);
  console.log(`  client.py:         ${pyActions.size} actions`);

  if (tsActions.size !== adActions.size || tsActions.size !== pyActions.size ||
      tsOnly.length > 0 || adOnly.length > 0 || pyOnly.length > 0) {
    allMatch = false;
    differences.push(module);

    const diffActions = new Set([...tsOnly, ...adOnly, ...pyOnly]);
    if (diffActions.size > 0) {
      console.log(`  不一致的 actions (${diffActions.size}):`);

      for (const action of diffActions) {
        const inTs = tsActions.has(action);
        const inAd = adActions.has(action);
        const inPy = pyActions.has(action);
        const locations = [];
        if (inTs) locations.push('ts');
        if (inAd) locations.push('ad');
        if (inPy) locations.push('py');

        const missing = [];
        if (!inTs) missing.push('ts');
        if (!inAd) missing.push('ad');
        if (!inPy) missing.push('py');

        console.log(`    ${action.padEnd(30)} [${locations.join(',')}] 缺少: [${missing.join(',')}]`);
      }
    }
  } else {
    console.log('  一致');
  }
  console.log('');
}

const tsTotal = Object.values(tsModules).reduce((sum, actions) => sum + actions.length, 0);
const adTotal = Object.values(adModules).reduce((sum, actions) => sum + actions.length, 0);
const pyTotal = Object.values(pyModules).reduce((sum, actions) => sum + actions.length, 0);

console.log('========================================');
console.log('汇总统计');
console.log('========================================');
console.log(`types.ts 总 actions:          ${tsTotal}`);
console.log(`action-details.ts 总 actions: ${adTotal}`);
console.log(`client.py 总 actions:         ${pyTotal}`);
console.log(`差异模块数: ${differences.length}`);
console.log('========================================\n');

if (allMatch) {
  console.log('验证通过：三个文件中的 VALID_MODULES 完全一致！');
} else {
  console.log('验证失败：发现不一致的模块！');
  console.log(`差异模块: ${differences.join(', ')}\n`);
}

process.exit(allMatch ? 0 : 1);
