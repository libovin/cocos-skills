# Scene Operations

场景文件管理相关操作。

## API 列表

| 命令 | 功能 |
|------|------|
| `query-is-ready` | 查询场景是否准备就绪 |
| `open-scene` | 打开场景或预制体 |
| `save-scene` | 保存当前场景 |
| `save-as-scene` | 另存为新场景 |
| `close-scene` | 关闭当前场景 |
| `query-dirty` | 查询是否有未保存的修改 |
| `query-classes` | 查询可用的组件类列表 |
| `query-components` | 查询所有可用的组件类型 |
| `query-scene-bounds` | 查询场景的边界信息 |

## query-is-ready

查询场景是否准备就绪，在执行场景操作前建议检查此状态。

```bash
cocos-skills scene query-is-ready
```

### 响应

```json
{
  "success": true,
  "data": true
}
```

## open-scene

打开场景或预制体文件。支持 UUID 或路径格式。

```bash
cocos-skills scene open-scene db://assets/scenes/Main.scene
cocos-skills scene open-scene <uuid>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuidOrPath | string | 是 | UUID 或路径（`db://...`） |

### 自动保存功能

打开新场景前会自动检查当前场景是否有未保存的更改，如果有则自动保存。

### UUID/路径转换

```bash
# UUID → 路径
cocos-skills asset-db query-url <uuid>

# 路径 → UUID
cocos-skills asset-db query-uuid db://assets/Main.scene
```

## save-scene

保存当前场景的所有更改。

```bash
cocos-skills scene save-scene
```

## save-as-scene

将当前场景另存为新文件，系统会弹出文件保存对话框。

```bash
cocos-skills scene save-as-scene
```

**使用场景**：
- 基于当前场景创建变体版本
- 备份场景当前状态
- 创建场景模板

## close-scene

关闭当前场景，系统会自动打开到默认场景。

```bash
cocos-skills scene close-scene
```

关闭前会自动保存未保存的更改。

## query-dirty

查询场景是否有未保存的修改。

```bash
cocos-skills scene query-dirty
```

### 响应

```json
{
  "success": true,
  "data": true  // true 表示有未保存的更改
}
```

## query-classes

查询可用的组件类列表，支持按基类过滤。

```bash
cocos-skills scene query-classes '{"extends": "cc.Component"}'
cocos-skills scene query-classes '{"extends": "cc.Node"}'
cocos-skills scene query-classes '{"extends": "cc.Sprite"}'
cocos-skills scene query-classes '{"extends": "cc.Renderer"}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| extends | string | 否 | 基类过滤（如 cc.Component、cc.Node） |
| scriptName | string | 否 | 脚本名称 |

### 常用基类

| 基类 | 说明 |
|------|------|
| cc.Component | 所有组件 |
| cc.Node | 节点类型 |
| cc.Sprite | 精灵组件 |
| cc.Renderer | 渲染器组件 |

## query-components

查询所有可用的组件类型列表（包含内置组件和自定义脚本组件）。

```bash
cocos-skills scene query-components
```

### 响应

```json
{
  "success": true,
  "data": [
    {
      "name": "cc.Sprite",
      "cid": "cc.Sprite",
      "path": "cc.Sprite"
    },
    ...
  ]
}
```

### query-classes vs query-components

| 命令 | 特点 | 适用场景 |
|------|------|---------|
| query-classes | 支持基类过滤，返回类信息 | 需要查找特定类型的组件类 |
| query-components | 返回更详细的组件信息（含路径、UUID） | 需要获取完整的组件列表 |

## query-scene-bounds

查询场景的边界信息。

```bash
cocos-skills scene query-scene-bounds
```

### 响应

```json
{
  "success": true,
  "data": {
    "min": {"x": 0, "y": 0, "z": 0},
    "max": {"x": 100, "y": 100, "z": 0}
  }
}
```

返回场景的包围盒信息，包括最小点和最大点坐标。

## 场景操作流程

```
1. 检查状态 → 2. 打开场景 → 3. 操作节点 → 4. 保存场景
```

```bash
# 完整流程示例
cocos-skills scene query-is-ready           # 1. 检查状态
cocos-skills scene open-scene db://assets/Main.scene  # 2. 打开场景
cocos-skills scene query-node-tree          # 3. 获取节点树
# ... 执行节点操作 ...
cocos-skills scene save-scene               # 4. 保存场景
```

## 路径格式

| 类型 | 格式 | 示例 |
|------|------|------|
| 场景文件 | `db://assets/...` | `db://assets/scenes/Main.scene` |
| 预制体 | `db://assets/...` | `db://assets/prefabs/Enemy.prefab` |

## 注意事项

1. **修改后保存**：修改场景后必须调用 `save-scene`，否则磁盘文件不会更新
2. **UUID 获取**：节点 UUID 可通过 `query-node-tree` 获取
3. **自动保存**：`open-scene` 和 `close-scene` 会自动保存当前场景
