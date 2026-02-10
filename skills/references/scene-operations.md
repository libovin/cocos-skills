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
| `query-node-tree` | 查询场景节点树 |

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

## query-node-tree

查询场景的节点树结构，返回节点的层级关系。

```bash
cocos-skills scene query-node-tree
cocos-skills scene query-node-tree minimal
cocos-skills scene query-node-tree basic
cocos-skills scene query-node-tree '{"only":"uuid,name,path"}'
cocos-skills scene query-node-tree '{"onlyActive":true}'
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| filter | string/object | 否 | 过滤选项 |

### 预设配置

| 预设 | 说明 |
|------|------|
| minimal | 仅 uuid 和 name |
| basic | uuid、name、path、active |
| full | 完整信息（默认） |

### 选项参数

```json
{
  "only": "uuid,name,path",     // 字符串或数组，指定包含的字段
  "onlyActive": true            // 是否仅包含激活的节点
}
```

### 响应

```json
{
  "success": true,
  "data": {
    "uuid": "根节点UUID",
    "name": "Canvas",
    "path": "/Canvas",
    "active": true,
    "children": [
      {
        "uuid": "子节点UUID",
        "name": "Sprite",
        "path": "/Canvas/Sprite",
        "active": true,
        "components": [...]
      }
    ]
  }
}
```

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
