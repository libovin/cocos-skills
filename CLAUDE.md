# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**cocos-skills** is a TypeScript/Node.js CLI tool that provides HTTP-based automation for the Cocos Creator game engine editor. It communicates with the Cocos Creator HTTP Server to enable programmatic control over scenes, assets, project settings, builds, and more.

## Build Commands

```bash
# Compile TypeScript to cli/dist/
npm run build

# Watch mode for development
npm run dev

# Build before publishing
npm run prepublishOnly

# Verify VALID_MODULES sync across types.ts, details/, and cocos-http
node scripts/verify-actions.mjs
```

**Build System**: TypeScript compiler targeting ES2022 with Node16 modules. Output goes to `cli/dist/`. Requires Node.js >=18.0.0.

## CLI Usage

```bash
cocos-skills <module> <action> [params...]

# Examples:
cocos-skills scene open-scene db://assets/Main.scene
cocos-skills scene create-node '{"parent":"Canvas","name":"NewNode"}'
cocos-skills asset-db create-asset db://assets/config.json
```

## Architecture

### Request Processing Pipeline

The project uses a four-stage request processing pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│  1. Validator (参数校验)                                     │
│     - 同步执行                                               │
│     - 验证参数格式、类型、必填项                              │
│     - 失败时抛出 ValidationError                              │
├─────────────────────────────────────────────────────────────┤
│  2. Preprocessor (前置处理)                                  │
│     - 异步执行                                               │
│     - 修改/补充参数（如生成默认值、检测循环）                 │
│     - 返回处理后的 params                                    │
├─────────────────────────────────────────────────────────────┤
│  3. API Call (HTTP 请求)                                    │
│     - 发送处理后的参数到 Cocos Creator HTTP Server           │
├─────────────────────────────────────────────────────────────┤
│  4. Postprocessor (后置处理)                                 │
│     - 异步执行                                               │
│     - 处理 API 返回结果（如补充子节点、组件信息）             │
│     - 返回处理后的 ApiResponse                               │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
cli/src/lib/
├── pipeline/                    # 请求处理管道核心
│   ├── index.ts                # 管道入口
│   ├── types.ts                # 类型定义
│   ├── validator.ts            # 参数校验器管理
│   ├── preprocessor.ts         # 前置处理器管理
│   ├── postprocessor.ts        # 后置处理器管理
│   └── pipeline.ts             # 管道协调器
├── validators/                  # 参数校验器实现
│   ├── registry.ts             # 校验器注册表
│   ├── scene/                  # scene 模块校验器
│   └── asset-db/               # asset-db 模块校验器
├── preprocessors/               # 前置处理器实现
│   ├── index.ts                # 前置处理器注册表
│   ├── scene/                  # scene 模块前置处理器
│   └── asset-db/               # asset-db 模块前置处理器
├── postprocessors/              # 后置处理器实现
│   ├── index.ts                # 后置处理器注册表
│   └── scene/                  # scene 模块后置处理器
├── client.ts                   # CocosClient 类
├── validator.ts                # 模块/动作校验（检查是否有效）
├── init-pipeline.ts            # 管道初始化
└── ...
```

### Key Patterns

- **Type-Driven Development**: All modules and actions are defined in `VALID_MODULES` constant in `cli/src/types.ts`
- **Singleton Client**: Global `CocosClient` instance cached in `client.ts`; use `getClient()` to access
- **Pipeline Pattern**: Four-stage processing pipeline with clear separation of concerns
- **Registry Pattern**: Validators, preprocessors, and postprocessors are registered in centralized registries

### Adding a New Action

When adding a new action to a module:

1. **Add to VALID_MODULES** in `cli/src/types.ts`
2. **Add to module details** in `cli/src/lib/details/{module}.ts` (description, parameters, examples)
3. **Add processor** (optional):
   - **Validator** (参数校验): `cli/src/lib/validators/{module}/{action}.validator.ts`
   - **Preprocessor** (前置处理): `cli/src/lib/preprocessors/{module}/{action}.preprocessor.ts`
   - **Postprocessor** (后置处理): `cli/src/lib/postprocessors/{module}/{action}.postprocessor.ts`
4. **Register processor** in the corresponding `registry.ts` or `index.ts`
5. **Run verification**: `node scripts/verify-actions.mjs` to sync with cocos-http executor.controller.ts

### Communication Flow

```
CLI Command → CocosClient.execute()
  → validateModuleAction() [检查模块/动作是否有效]
  → processRequest()
    → Validator [参数校验，同步]
    → Preprocessor [前置处理，异步]
  → HTTP POST to Cocos Creator HTTP Server
  → processResponse()
    → Postprocessor [后置处理，异步]
  → ApiResponse { success, data, error }
```

### Server Configuration

The client reads the server URL from `~/.cocos-http/cocos-http.json`:

```json
{
  "currentProject": "project-name",
  "projects": {
    "project-name": {
      "serverUrl": "http://127.0.0.1:54321"
    }
  }
}
```

Default fallback: `http://127.0.0.1:54321`

### Project Detection

The client detects the current Cocos Creator project by:
1. Checking `COCOS_PROJECT_PATH` environment variable
2. Traversing upward from current directory looking for `settings/` or `assets/` folders

This allows the client to automatically select the correct server URL from multi-project configurations.

## Key Files

| File | Purpose |
|------|---------|
| `cli/src/index.ts` | CLI entry point (commander-based), initializes pipeline |
| `cli/src/types.ts` | Type definitions and `VALID_MODULES` const |
| `cli/src/lib/client.ts` | `CocosClient` class and global convenience functions |
| `cli/src/lib/validator.ts` | Module/action validation (check if valid) |
| `cli/src/lib/init-pipeline.ts` | Pipeline initialization |
| `cli/src/lib/pipeline/` | Request processing pipeline core |
| `cli/src/lib/pipeline/pipeline.ts` | Pipeline orchestration |
| `cli/src/lib/pipeline/validator.ts` | Parameter validator manager |
| `cli/src/lib/pipeline/preprocessor.ts` | Preprocessor manager |
| `cli/src/lib/pipeline/postprocessor.ts` | Postprocessor manager |
| `cli/src/lib/validators/` | Parameter validator implementations |
| `cli/src/lib/preprocessors/` | Preprocessor implementations |
| `cli/src/lib/postprocessors/` | Postprocessor implementations |
| `cli/src/lib/details/index.ts` | Aggregates all module details |
| `cli/src/lib/details/{module}.ts` | Per-module action documentation |
| `cli/src/lib/config.ts` | Server URL configuration loading |
| `cli/src/lib/asset-templates.ts` | Default asset data generators |
| `cli/src/lib/UuidService.ts` | UUID generation service |
| `cli/src/utils/http.ts` | Native fetch-based HTTP client |
| `scripts/verify-actions.mjs` | VALID_MODULES sync verification script |
| `skills/{module}/SKILL.md` | Module documentation (Chinese) |

## TypeScript Conventions

- **Module System**: Node16 ESM - imports must use `.js` extensions
- **Import Style**: `import { foo } from './bar.js';` (note `.js` for TypeScript files)
- **Type Safety**: Strict mode enabled; use literal types for module/action names
- **Error Handling**: Return `ApiResponse` objects instead of throwing; use `ValidationError` for validation errors

## API Response Format

All HTTP API calls return:

```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## Available Modules

Defined in `VALID_MODULES`: `scene`, `asset-db`, `project`, `builder`, `engine`, `information`, `preferences`, `program`, `programming`, `server`, `device`, `extension`

See `skills/{module}/SKILL.md` for module-specific documentation.

**Largest Module**: `scene` with 89 actions covering scene operations, node operations, property management, component operations, queries, editor tools, view control, display settings, script execution, and snapshot operations.

## Asset Templates

The `asset-templates.ts` file provides default JSON data for creating various Cocos Creator asset types. When `create-asset` is called with only a path, the appropriate template is auto-generated based on the file extension:

- `.prefab` - Prefab structure with `_name`, `id`, `children`
- `.scene` - Scene structure with optimize setup
- `.material` - Material with shader and properties
- `.anim` - Animation with wrap mode and curve data
- `.asset` - Generic asset with `_name`
- `.json` - Generic JSON asset with `{}`

## Module Details Structure

Each module in `details/{module}.ts` exports a `ModuleActionDetails` object:

```typescript
export const {moduleName}Details: ModuleActionDetails = {
  'action-name': {
    description: 'Action description',
    parameters: [
      { name: 'param1', type: 'string', required: true, description: '...' }
    ],
    examples: ['example usage'],
    notes: 'additional information'
  }
};
```

These details are used by the CLI help system and must be kept in sync with `VALID_MODULES`.

## Documentation Notes

- **SKILL.md** is the main skill overview in Chinese
- **skills/{module}/SKILL.md** contains module-specific documentation
