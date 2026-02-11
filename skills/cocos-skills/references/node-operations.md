# Node Operations

场景节点操作相关功能。

## API 列表

| 命令 | 功能 |
|------|------|
| `query-node-tree` | 查询场景节点树 |
| `create-node` | 创建新节点 |
| `remove-node` | 删除节点 |
| `copy-node` | 复制节点 |
| `duplicate-node` | 快速复制节点 |
| `paste-node` | 粘贴节点 |
| `cut-node` | 剪切节点 |
| `set-parent` | 设置父节点 |
| `reset-node` | 重置节点变换 |
| `restore-prefab` | 恢复预制体 |

## query-node-tree

查询场景的节点树结构，返回节点的层级关系。

```bash
cocos-skills scene query-node-tree
```

### 参数

无需参数。

### 返回结构

每个节点包含以下属性：
- `uuid` - 节点 UUID
- `name` - 节点名称
- `active` - 是否激活
- `locked` - 是否锁定
- `type` - 节点类型（如 cc.Node、cc.Scene）
- `path` - 节点路径（如 "Canvas/Game2048"）
- `components` - 组件列表
  - `type` - 组件类型（如 cc.Sprite、cc.Label）
  - `value` - 组件 UUID
  - `isCustom` - 是否为自定义脚本组件
  - `extends` - 组件继承链
- `children` - 子节点列表（递归结构）

### 响应

```json
{
  "success": true,
  "data": {
    "name": "Game2048",
    "uuid": "e973a2e6-457b-44cc-b1fd-72337f66464a",
    "active": true,
    "locked": false,
    "type": "cc.Scene",
    "path": "/",
    "children": [
      {
        "name": "Canvas",
        "uuid": "ce0ld0hTlLOI05QXW1E4qx",
        "active": true,
        "locked": false,
        "type": "cc.Node",
        "path": "Canvas",
        "components": [
          {
            "isCustom": false,
            "type": "cc.UITransform",
            "value": "32hyvcc+hN37zlnbDqVERN",
            "extends": ["cc.Component", "cc.Object"]
          }
        ],
        "children": [...]
      }
    ]
  }
}
```

## create-node

创建新节点并返回节点 UUID。

```bash
cocos-skills scene create-node '{"parent": "父节点UUID", "name": "ChildNode", "type": "cc.Sprite"}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| parent | string | 是 | 父节点 UUID |
| name | string | 否 | 节点名称 |
| type | string | 否 | 节点类型（自动创建对应组件和子节点） |
| components | array | 否 | 额外组件类型数组（如 `["cc.Widget"]`） |

### 支持的 type 类型

使用 `type` 参数时会**自动创建对应的组件和子节点**。

| 类型 | 自动添加的组件 | 自动创建的子节点 |
|------|------|------|
| cc.Camera | cc.Camera | - |
| cc.Sprite | cc.Sprite | - |
| cc.Label | cc.Label | - |
| cc.Graphics | cc.Graphics | - |
| cc.Mask | cc.Mask, cc.Graphics | - |
| cc.ParticleSystem2D | cc.ParticleSystem2D | - |
| cc.TiledMap | cc.TiledMap | - |
| cc.Button | cc.Button, cc.Sprite | Label |
| cc.Canvas | cc.Canvas, cc.Widget | Camera |
| cc.EditBox | cc.Sprite, cc.EditBox | PLACEHOLDER_LABEL, TEXT_LABEL |
| cc.Layout | cc.Layout | - |
| cc.PageView | cc.Sprite, cc.PageView | view, indicator |
| cc.ProgressBar | cc.Sprite, cc.ProgressBar | Bar |
| cc.ScrollView | cc.Sprite, cc.ScrollView | scrollBar, view |
| cc.Slider | cc.Sprite, cc.Slider | Handle |
| cc.Toggle | cc.Sprite, cc.Toggle | Checkmark |
| cc.ToggleGroupContainer | cc.ToggleGroupContainer | Toggle1, Toggle2, Toggle3 |
| cc.RichText | cc.RichText | - |
| cc.VideoPlayer | cc.VideoPlayer | - |
| cc.WebView | cc.WebView | - |
| cc.Widget | cc.Widget | - |
| cc.MeshRenderer | cc.MeshRenderer | - |
| cc.Terrain | cc.Terrain | - |

### 响应

```json
{
  "success": true,
  "data": {
    "uuid": "新节点的UUID"
  }
}
```

## remove-node

删除节点及其所有子节点（不可撤销），支持单个或批量删除。

```bash
# 删除单个节点
cocos-skills scene remove-node '{"uuid":"<节点UUID>"}'

# 批量删除多个节点
cocos-skills scene remove-node '{"uuid":["<节点UUID1>","<节点UUID2>"]}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string/array | 是 | 节点 UUID（单个字符串或 UUID 数组） |

## copy-node

复制节点到剪贴板。

```bash
cocos-skills scene copy-node <节点UUID>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 要复制的节点 UUID |

## paste-node

粘贴剪贴板中的节点。

```bash
# 粘贴单个节点
cocos-skills scene paste-node '{"uuids":"节点UUID","target":"目标节点UUID"}'

# 粘贴多个节点
cocos-skills scene paste-node '{"uuids":["节点UUID1","节点UUID2"],"target":"目标节点UUID"}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuids | string/array | 是 | 要粘贴的节点 UUID（单个或数组） |
| target | string | 是 | 目标父节点 UUID |

## duplicate-node

快捷复制并粘贴（等同于 copy-node + paste-node）。

```bash
cocos-skills scene duplicate-node <节点UUID>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 要复制的节点 UUID |

## cut-node

剪切节点到剪贴板。

```bash
cocos-skills scene cut-node <节点UUID>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 要剪切的节点 UUID |

## set-parent

设置节点的父节点（移动节点），支持批量移动。

```bash
# 单个节点
cocos-skills scene set-parent '{"uuids":"节点UUID","parent":"父节点UUID"}'

# 多个节点
cocos-skills scene set-parent '{"uuids":["节点UUID1","节点UUID2"],"parent":"父节点UUID"}'

# 指定插入位置
cocos-skills scene set-parent '{"uuids":"节点UUID","parent":"父节点UUID","index":0}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuids | array | 是 | 要移动的节点 UUID 数组 |
| parent | string | 是 | 新父节点的 UUID |
| index | number | 否 | 插入位置（默认末尾） |

### 循环检测

系统会自动检测并阻止会形成循环引用的节点移动：
- 不能将父节点移动到其子节点下
- 检测到循环会抛出错误提示

## reset-node

重置节点变换为默认值。

```bash
cocos-skills scene reset-node <节点UUID>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 节点 UUID |

重置效果：
- position → (0, 0, 0)
- rotation → (0, 0, 0)
- scale → (1, 1, 1)

## restore-prefab

恢复预制体实例到原始状态。

```bash
cocos-skills scene restore-prefab <预制体UUID>
```

## 操作流程示例

```bash
# 1. 获取节点树，找到节点 UUID
cocos-skills scene query-node-tree

# 2. 创建节点（parent 为必填）
cocos-skills scene create-node '{"parent": "父节点UUID", "name": "MyNode"}'

# 3. 复制节点
cocos-skills scene copy-node <源节点UUID>

# 4. 粘贴节点
cocos-skills scene paste-node '{"uuids":"源节点UUID","target":"父节点UUID"}'

# 5. 保存场景
cocos-skills scene save-scene
```

## 注意事项

1. **修改后保存**：节点操作后必须调用 `save-scene`
2. **删除不可撤销**：`remove-node` 操作不可撤销
3. **UUID 获取**：节点 UUID 通过 `query-node-tree` 获取
4. **循环检测**：`set-parent` 会自动检测循环引用
