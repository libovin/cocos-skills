# Component Operations

节点组件操作相关功能。

## API 列表

| 命令 | 功能 |
|------|------|
| `create-component` | 添加组件到节点 |
| `remove-component` | 从节点移除组件 |
| `reset-component` | 重置组件属性 |
| `execute-component-method` | 调用组件方法 |
| `query-component` | 查询组件详情 |
| `query-components` | 查询可用组件类型 |

## create-component

为节点添加指定类型的组件。

```bash
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "cc.Widget"}'
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "cc.Camera"}'
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "cc.Animation"}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 节点 UUID |
| component | string | 是 | 组件类型（如 `cc.Sprite`、`cc.Widget`） |

### 常用组件类型

| 组件 | 说明 |
|------|------|
| cc.Sprite | 精灵渲染组件 |
| cc.Label | 文本渲染组件 |
| cc.Button | 按钮交互组件 |
| cc.Widget | UI 对齐组件 |
| cc.Layout | 自动布局组件 |
| cc.Canvas | 画布组件 |
| cc.Camera | 相机组件 |
| cc.Animation | 动画组件 |
| cc.UITransform | UI 变换组件 |
| cc.RigidBody2D | 2D 刚体组件 |
| cc.Collider2D | 2D 碰撞体组件 |

## remove-component

从节点移除指定组件。

```bash
cocos-skills scene remove-component '{"uuid": "<组件UUID>"}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 组件 UUID |

### 获取组件 UUID

```bash
# 1. 查询节点树获取组件信息
cocos-skills scene query-node-tree

# 2. 从节点的 components 字段中获取组件 value（即组件UUID）
```

## reset-component

将组件的所有属性恢复为引擎默认值。

```bash
cocos-skills scene reset-component /Canvas/Sprite cc.Sprite
cocos-skills scene reset-component /UI/Button cc.Button
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 节点路径 |
| component | string | 是 | 组件名称 |

## execute-component-method

动态调用组件的公共方法。

```bash
cocos-skills scene execute-component-method '{"uuid": "节点UUID", "component": "cc.Sprite", "method": "setContentSize", "args": [100, 100]}'
cocos-skills scene execute-component-method '{"uuid": "节点UUID", "component": "cc.Label", "method": "string", "args": ["Hello World"]}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 节点 UUID |
| component | string | 是 | 组件类型（如 `cc.Sprite`） |
| method | string | 是 | 方法名称 |
| args | array | 否 | 方法参数数组 |

## query-component

查询组件的详细属性信息。

```bash
cocos-skills scene query-component <组件UUID>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 组件 UUID |

## query-components

查询所有可用的组件类型列表。

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

## 组件属性路径

修改组件属性时需要使用 `__comps__.索引.属性名` 格式：

| 路径 | 说明 |
|------|------|
| `__comps__.0._color` | 第一个组件的 color 属性 |
| `__comps__.1._contentSize` | 第二个组件的 contentSize |
| `__comps__.2.string` | 第三个组件的 string 属性 |

## 操作流程示例

```bash
# 1. 获取节点信息，查看现有组件
cocos-skills scene query-node-tree

# 2. 添加组件
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "cc.Sprite"}'

# 3. 调用组件方法
cocos-skills scene execute-component-method '{"uuid": "节点UUID", "component": "cc.Sprite", "method": "setEnabled", "args": [true]}'

# 4. 保存场景
cocos-skills scene save-scene
```

## 注意事项

1. **组件唯一性**：每种组件类型在一个节点上只能有一个（除了 cc.Component）
2. **修改后保存**：组件操作后必须调用 `save-scene`
3. **UUID 获取**：组件 UUID 从 `query-node-tree` 的 `components` 字段获取
4. **移除影响**：移除组件可能会影响节点功能
