---
name: cocos-skills
description: Cocos Creator 命令行自动化工具。支持场景管理、资源操作、节点创建、组件绑定、属性设置等常用开发流程。
---

# Cocos Skills

Cocos Creator 命令行自动化工具，用于快速完成游戏开发中的重复性操作。

## 快速开始

```bash
# 检查服务状态
cocos-skills health

# 查看所有命令
cocos-skills scene -h
```

---

## 常用工作流程

### 场景编辑流程

```
打开场景 → 查询节点树 → 修改节点/组件 → 保存场景
```

```bash
# 1. 打开场景
cocos-skills scene open-scene db://assets/scenes/Main.scene

# 2. 查询节点树（获取 UUID）
cocos-skills scene query-node-tree minimal

# 3. 修改操作
#    - 创建节点、添加组件、设置属性

# 4. 保存场景
cocos-skills scene save-scene
```

### 资源操作流程

```
导入资源 → 创建预制体 → 绑定组件引用
```

```bash
# 1. 导入外部资源
cocos-skills asset-db import-asset db://assets/sprite.png "C:/path/to/image.png"

# 2. 创建预制体
cocos-skills asset-db create-asset db://assets/prefabs/Tile.prefab

# 3. 查询资源 UUID（用于绑定引用）
cocos-skills asset-db query-uuid db://assets/prefabs/Tile.prefab
```

---

## 核心命令速查

### 场景管理

| 操作 | 命令 |
|------|------|
| 打开场景 | `cocos-skills scene open-scene <path>` |
| 保存场景 | `cocos-skills scene save-scene` |
| 查询节点树 | `cocos-skills scene query-node-tree minimal` |
| 查询节点详情 | `cocos-skills scene query-node <uuid>` |

### 节点操作

| 操作 | 命令 |
|------|------|
| 创建节点 | `cocos-skills scene create-node '{"parent":"<uuid>","name":"Name","type":"cc.Sprite"}'` |
| 创建节点（带组件） | `cocos-skills scene create-node '{"parent":"<uuid>","name":"Name","components":["cc.Sprite","cc.Button"]}'` |
| 删除节点 | `cocos-skills scene remove-node '{"uuid":"<uuid>"}'` |
| 复制节点（创建副本） | `cocos-skills scene duplicate-node <uuid>` |
| 移动节点 | `cocos-skills scene set-parent '{"uuids":"<uuid>","parent":"<new_parent_uuid>"}'` |

### 组件操作

| 操作 | 命令 |
|------|------|
| 添加单个组件 | `cocos-skills scene create-component '{"uuid":"<uuid>","component":"cc.Sprite"}'` |
| 批量添加组件 | `cocos-skills scene create-component '{"uuid":"<uuid>","component":["cc.Sprite","cc.Label","cc.Button"]}'` |
| 移除组件 | `cocos-skills scene remove-component '{"uuid":"<comp_uuid>"}'` |

### 属性设置

| 操作 | 命令 |
|------|------|
| 设置节点属性（component 可省略） | `cocos-skills scene set-property '{"uuid":"<uuid>","properties":[{"name":"position","value":{"x":100,"y":200,"z":0},"type":"cc.Vec3"}]}'` |
| 设置组件属性 | `cocos-skills scene set-property '{"uuid":"<uuid>","component":"cc.Sprite","properties":[{"name":"color","value":{"r":255,"g":0,"b":0,"a":255},"type":"cc.Color"}]}'` |
| 绑定节点引用 | `cocos-skills scene set-property '{"uuid":"<uuid>","component":"cc.Button","properties":[{"name":"target","value":{"uuid":"<target_uuid>"},"type":"cc.Node"}]}'` |
| 绑定预制体引用 | `cocos-skills scene set-property '{"uuid":"<uuid>","component":"cc.Button","properties":[{"name":"tilePrefab","value":{"uuid":"<prefab_uuid>"},"type":"cc.Prefab"}]}'` |
| 绑定组件引用（cc.Label等） | `cocos-skills scene set-property '{"uuid":"<uuid>","component":"MyScript","properties":[{"name":"label","value":{"uuid":"<组件UUID>"},"type":"cc.Label"}]}'` |

> **重要提示**：当属性类型为 `cc.Label`、`cc.Sprite` 等组件类型时，`value.uuid` 必须使用**组件 UUID**（通过 `query-component --raw` 获取），而非节点 UUID。

### 资源操作

| 操作 | 命令 |
|------|------|
| 创建资源 | `cocos-skills asset-db create-asset <path>` |
| 导入资源 | `cocos-skills asset-db import-asset <db_path> <file_path>` |
| 查询 UUID | `cocos-skills asset-db query-uuid <path>` |
| 查询资源信息 | `cocos-skills asset-db query-asset-info <path>` |

---

## 属性设置格式

使用 `properties` 数组批量设置多个属性，`component` 可选（默认为 `cc.Node`）：

```json
{
  "uuid": "节点UUID",
  "component": "cc.Sprite",  // 可选，默认为 cc.Node
  "properties": [
    {"name": "color", "value": {"r":255,"g":0,"b":0,"a":255}, "type": "cc.Color"},
    {"name": "sizeMode", "value": 0, "type": "cc.Number"}
  ]
}
```

**component 可选值：**
- 省略或 `cc.Node` - 节点属性（position, scale, angle 等）
- `cc.Sprite` - 精灵组件属性
- `cc.Label` - 标签组件属性
- `cc.Button` - 按钮组件属性
- 自定义脚本 - 动态查询属性验证

---

## 完整示例

### 示例 1：创建 UI 按钮

```bash
# 1. 打开场景
cocos-skills scene open-scene db://assets/scenes/Main.scene

# 2. 查询节点树，获取父节点 UUID
cocos-skills scene query-node-tree minimal

# 3. 创建按钮节点（同时添加多个组件）
cocos-skills scene create-node '{
  "parent": "ParentUUID",
  "name": "Button",
  "components": ["cc.UITransform", "cc.Sprite", "cc.Button"]
}'

# 4. 批量设置属性
cocos-skills scene set-property '{
  "uuid": "ButtonUUID",
  "component": "cc.UITransform",
  "properties": [
    {"name": "contentSize", "value": {"width":200,"height":60}, "type": "cc.Size"}
  ]
}'

cocos-skills scene set-property '{
  "uuid": "ButtonUUID",
  "component": "cc.Sprite",
  "properties": [
    {"name": "color", "value": {"r":100,"g":200,"b":100,"a":255}, "type": "cc.Color"}
  ]
}'

# 5. 保存场景
cocos-skills scene save-scene
```

### 示例 2：批量添加组件

```bash
# 一次性添加多个组件
cocos-skills scene create-component '{
  "uuid": "NodeUUID",
  "component": ["cc.Sprite", "cc.Label", "cc.Button"]
}'

# 如果组件已存在，会自动跳过
```

### 示例 3：批量设置属性

```bash
# 批量设置节点属性（component 可省略）
cocos-skills scene set-property '{
  "uuid": "NodeUUID",
  "properties": [
    {"name": "position", "value": {"x":100,"y":200,"z":0}, "type": "cc.Vec3"},
    {"name": "scale", "value": {"x":2,"y":2,"z":1}, "type": "cc.Vec3"}
  ]
}'

# 批量设置 Label 组件属性
cocos-skills scene set-property '{
  "uuid": "NodeUUID",
  "component": "cc.Label",
  "properties": [
    {"name": "string", "value": "Hello World", "type": "cc.String"},
    {"name": "fontSize", "value": 32, "type": "cc.Number"},
    {"name": "color", "value": {"r":0,"g":255,"b":0,"a":255}, "type": "cc.Color"}
  ]
}'
```

### 示例 4：绑定组件引用

```bash
# 1. 查询预制体 UUID
cocos-skills asset-db query-uuid db://assets/prefabs/Tile.prefab

# 2. 查询节点 UUID
cocos-skills scene query-node-tree

# 3. 绑定预制体引用
cocos-skills scene set-property '{
  "uuid": "GridNodeUUID",
  "component": "cc.Button",
  "properties": [
    {"name": "tilePrefab", "value": {"uuid": "TilePrefabUUID"}, "type": "cc.Prefab"}
  ]
}'

# 4. 绑定节点引用
cocos-skills scene set-property '{
  "uuid": "GridNodeUUID",
  "component": "cc.Button",
  "properties": [
    {"name": "target", "value": {"uuid": "ContainerUUID"}, "type": "cc.Node"}
  ]
}'

# 5. 保存场景
cocos-skills scene save-scene
```

---

## 支持的数据类型

| 类型 | Value 格式 |
|------|------------|
| `cc.Vec3` | `{"x":0, "y":0, "z":0}` |
| `cc.Quat` | `{"x":0, "y":0, "z":0, "w":1}` |
| `cc.Vec2` | `{"x":0, "y":0}` |
| `cc.Color` | `{"r":255, "g":255, "b":255, "a":255}` |
| `cc.Size` | `{"width":100, "height":100}` |
| `cc.Node` | `{"uuid":"节点UUID"}` |
| `cc.String` | `"文本内容"` |
| `cc.Number` | `123` |
| `cc.Boolean` | `true` 或 `false` |
| `cc.Prefab` | `{"uuid":"预制体UUID"}` |
| `cc.SpriteFrame` | `{"uuid":"帧UUID"}` |

---

## 常用属性速查

### 节点属性 (cc.Node)

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `position` | cc.Vec3 | 世界坐标位置 |
| `scale` | cc.Vec3 | 缩放比例 |
| `angle` | cc.Vec3 | 旋转角度 |
| `layer` | cc.Enum | 层级 |
| `mobility` | cc.Enum | 移动性 (0=Static, 1=Stationary, 2=Movable) |
| `name` | cc.String | 节点名称 |
| `active` | cc.Boolean | 是否激活 |

### UITransform 组件

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `contentSize` | cc.Size | 内容尺寸 |
| `anchorPoint` | cc.Vec2 | 锚点位置 |

### Sprite 组件

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `color` | cc.Color | 颜色 |
| `spriteFrame` | cc.SpriteFrame | 精灵帧 |
| `type` | cc.Enum | 精灵类型 (0=SIMPLE, 1=SLICED, 2=TILED, 3=FILLED) |
| `sizeMode` | cc.Enum | 尺寸模式 (0=CUSTOM, 1=TRIMMED, 2=RAW) |

### Label 组件

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `string` | cc.String | 文本内容 |
| `fontSize` | cc.Number | 字体大小 |
| `color` | cc.Color | 文本颜色 |
| `lineHeight` | cc.Number | 行高 |
| `overflow` | cc.Enum | 溢出模式 (0=NONE, 1=CLAMP, 2=SHRINK, 3=RESIZE_HEIGHT) |

### Button 组件

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `interactable` | cc.Boolean | 是否可交互 |
| `transition` | cc.Enum | 过渡类型 (0=无, 1=颜色, 2=精灵, 3=缩放) |
| `target` | cc.Node | 目标节点 |

### Widget 组件

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `top` | cc.Number | 上边距 |
| `bottom` | cc.Number | 下边距 |
| `left` | cc.Number | 左边距 |
| `right` | cc.Number | 右边距 |
| `isAbsoluteTop` | cc.Boolean | 上边距是否绝对值 |

---

## 路径格式说明

| 类型 | 格式 |
|------|------|
| 场景文件 | `db://assets/scenes/Main.scene` |
| 预制体 | `db://assets/prefabs/Tile.prefab` |
| 图片资源 | `db://assets/textures/sprite.png` |

---

## 详细文档

- [场景操作](references/scene-operations.md) - 场景打开、保存、查询
- [节点操作](references/node-operations.md) - 节点创建、复制、删除、移动
- [组件操作](references/component-operations.md) - 组件添加、移除
- [属性操作](references/property-operations.md) - 属性设置、重置、引用绑定
- [资源操作](references/asset-operations.md) - 资源创建、导入、查询
