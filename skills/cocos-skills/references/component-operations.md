# Component Operations

节点组件操作相关功能。

## API 列表

| 命令 | 功能 |
|------|------|
| `create-component` | 添加组件到节点（支持单个或批量） |
| `remove-component` | 从节点移除组件 |
| `reset-component` | 重置组件属性 |
| `query-component` | 查询组件详情 |
| `query-component-has-script` | 查询组件是否为脚本组件 |

---

## create-component

为节点添加指定类型的组件，支持单个组件或批量添加多个组件。

### 基本语法

```bash
# 单个组件
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "cc.Sprite"}'

# 批量添加多个组件
cocos-skills scene create-component '{"uuid": "节点UUID", "component": ["cc.Sprite", "cc.Label", "cc.Button"]}'
```

### 参数（JSON 对象）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 节点 UUID |
| component | string \| string[] | 是 | 组件类型，支持单个组件（字符串）或多个组件（数组） |

### 使用示例

#### 添加单个组件

```bash
# 内置组件
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "cc.Widget"}'
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "cc.Camera"}'
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "cc.Animation"}'

# 自定义脚本组件
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "Game2048"}'
```

#### 批量添加多个组件

```bash
# 一次性添加多个组件
cocos-skills scene create-component '{
  "uuid": "节点UUID",
  "component": ["cc.UITransform", "cc.Sprite", "cc.Button"]
}'

# 混合内置组件和自定义脚本
cocos-skills scene create-component '{
  "uuid": "节点UUID",
  "component": ["cc.Sprite", "cc.Label", "Game2048"]
}'
```

**批量添加说明：**
- 如果某个组件已存在，会自动跳过该组件
- 只添加不存在的组件
- 返回结果会显示哪些组件已跳过

### 支持的组件类型

#### 内置组件

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

#### 自定义脚本组件

自定义脚本组件使用 `@ccclass` 装饰器中注册的名称：

```typescript
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('Game2048')  // 这里的名称 'Game2048' 就是 component 参数要使用的值
export class Game2048 extends Component {
    // ...
}
```

使用时：
```bash
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "Game2048"}'
```

---

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

---

## reset-component

将组件的所有属性恢复为引擎默认值。

```bash
cocos-skills scene reset-component '{"uuid": "<组件UUID>"}'
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 组件 UUID |

### 获取组件 UUID

```bash
# 1. 查询节点树获取组件信息
cocos-skills scene query-node-tree

# 2. 从节点的 components 字段中获取组件 value（即组件UUID）
```

---

## query-component

查询组件的详细属性信息。

```bash
cocos-skills scene query-component <组件UUID>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 组件 UUID |

---

## query-component-has-script

查询组件是否为脚本组件。

```bash
cocos-skills scene query-component-has-script <组件UUID>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 组件 UUID（不是节点 UUID） |

### 响应

```json
{
  "success": true,
  "data": true  // true 表示是脚本组件，false 表示不是
}
```

### 获取组件 UUID

```bash
# 1. 查询节点树获取组件信息
cocos-skills scene query-node-tree

# 2. 从节点的 components 字段中获取组件 value（即组件UUID）
```

---

## 组件属性路径

修改组件属性时需要使用 `__comps__.索引.属性名` 格式：

| 路径 | 说明 |
|------|------|
| `__comps__.0.color` | 第一个组件的 color 属性 |
| `__comps__.1.contentSize` | 第二个组件的 contentSize |
| `__comps__.2.string` | 第三个组件的 string 属性 |

---

## 操作流程示例

### 示例 1：创建节点并添加组件

```bash
# 1. 创建节点（同时添加组件）
cocos-skills scene create-node '{
  "parent": "父节点UUID",
  "name": "Button",
  "components": ["cc.UITransform", "cc.Sprite", "cc.Button"]
}'

# 2. 或者先创建节点，再批量添加组件
cocos-skills scene create-node '{"parent": "父节点UUID", "name": "Button"}'
cocos-skills scene create-component '{
  "uuid": "新节点UUID",
  "component": ["cc.UITransform", "cc.Sprite", "cc.Button"]
}'

# 3. 保存场景
cocos-skills scene save-scene
```

### 示例 2：查询并修改组件

```bash
# 1. 获取节点信息，查看现有组件
cocos-skills scene query-node <节点UUID>

# 2. 添加单个组件
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "cc.Sprite"}'

# 3. 添加自定义脚本组件
cocos-skills scene create-component '{"uuid": "节点UUID", "component": "Game2048"}'

# 4. 查询组件详情
cocos-skills scene query-component <组件UUID>

# 5. 保存场景
cocos-skills scene save-scene
```

---

## 注意事项

1. **组件唯一性**：每种组件类型在一个节点上只能有一个（除了 cc.Component）
2. **批量添加**：批量添加时，已存在的组件会自动跳过
3. **修改后保存**：组件操作后必须调用 `save-scene`
4. **UUID 获取**：组件 UUID 从 `query-node-tree` 的 `components` 字段获取
5. **移除影响**：移除组件可能会影响节点功能
