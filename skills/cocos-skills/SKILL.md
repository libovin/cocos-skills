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
| 删除节点 | `cocos-skills scene remove-node '{"uuid":"<uuid>"}'` |
| 复制节点 | `cocos-skills scene copy-node <uuid>` |
| 粘贴节点 | `cocos-skills scene paste-node '{"uuids":"<uuid>","target":"<parent_uuid>"}'` |

### 组件操作

| 操作 | 命令 |
|------|------|
| 添加组件 | `cocos-skills scene create-component '{"uuid":"<uuid>","component":"cc.Sprite"}'` |
| 移除组件 | `cocos-skills scene remove-component '{"uuid":"<comp_uuid>"}'` |

### 属性设置

| 操作 | 命令 |
|------|------|
| 设置位置 | `cocos-skills scene set-property '{"uuid":"<uuid>","path":"position","dump":{"value":{"x":0,"y":0,"z":0},"type":"cc.Vec3"}}'` |
| 设置颜色 | `cocos-skills scene set-property '{"uuid":"<uuid>","path":"__comps__.0._color","dump":{"value":{"r":255,"g":255,"b":255,"a":255},"type":"cc.Color"}}'` |
| 设置文本 | `cocos-skills scene set-property '{"uuid":"<uuid>","path":"__comps__.1._string","dump":{"value":"Hello","type":"cc.String"}}'` |
| 绑定节点引用 | `cocos-skills scene set-property '{"uuid":"<uuid>","path":"__comps__.0.target","dump":{"value":{"uuid":"<target_uuid>"},"type":"cc.Node"}}'` |
| 绑定预制体引用 | `cocos-skills scene set-property '{"uuid":"<uuid>","path":"__comps__.0.tilePrefab","dump":{"value":{"uuid":"<prefab_uuid>"},"type":"cc.Prefab"}}'` |

### 资源操作

| 操作 | 命令 |
|------|------|
| 创建资源 | `cocos-skills asset-db create-asset <path>` |
| 导入资源 | `cocos-skills asset-db import-asset <db_path> <file_path>` |
| 查询 UUID | `cocos-skills asset-db query-uuid <path>` |
| 查询资源信息 | `cocos-skills asset-db query-asset-info <path>` |

---

## 属性路径格式

### 节点属性（直接使用属性名）

| 路径 | 类型 | 示例 |
|------|------|------|
| `position` | cc.Vec3 | 位置 |
| `_lpos` | cc.Vec3 | 本地位置 |
| `scale` | cc.Vec3 | 缩放 |
| `eulerAngles` | cc.Vec3 | 欧拉角 |
| `angle` | cc.Number | 2D 旋转角度 |
| `_active` | cc.Boolean | 是否激活 |

### 组件属性（使用 `__comps__.索引.属性名`）

| 路径 | 组件 | 说明 |
|------|------|------|
| `__comps__.0._color` | Sprite | 精灵颜色 |
| `__comps__.1._string` | Label | 文本内容 |
| `__comps__.1._fontSize` | Label | 字体大小 |
| `__comps__.1._color` | Label | 文字颜色 |
| `__comps__.0._contentSize` | UITransform | 内容尺寸 |
| `__comps__.0._interactable` | Button | 是否可交互 |

**注意**: 组件索引从 0 开始，先用 `query-node <uuid>` 查看组件列表确定索引。

---

## 完整示例

### 示例 1：创建 UI 按钮

```bash
# 1. 打开场景
cocos-skills scene open-scene db://assets/scenes/Main.scene

# 2. 查询节点树，获取父节点 UUID
cocos-skills scene query-node-tree minimal

# 3. 创建按钮节点
cocos-skills scene create-node '{"parent":"ParentUUID","name":"Button","type":"cc.Node"}'

# 4. 添加 UITransform 组件
cocos-skills scene create-component '{"uuid":"ButtonUUID","component":"cc.UITransform"}'

# 5. 添加 Sprite 组件
cocos-skills scene create-component '{"uuid":"ButtonUUID","component":"cc.Sprite"}'

# 6. 添加 Button 组件
cocos-skills scene create-component '{"uuid":"ButtonUUID","component":"cc.Button"}'

# 7. 设置大小
cocos-skills scene set-property '{"uuid":"ButtonUUID","path":"__comps__.0._contentSize","dump":{"value":{"width":200,"height":60},"type":"cc.Size"}}'

# 8. 设置颜色
cocos-skills scene set-property '{"uuid":"ButtonUUID","path":"__comps__.1._color","dump":{"value":{"r":100,"g":200,"b":100,"a":255},"type":"cc.Color"}}'

# 9. 保存场景
cocos-skills scene save-scene
```

### 示例 2：绑定组件引用

```bash
# 1. 查询预制体 UUID
cocos-skills asset-db query-uuid db://assets/prefabs/Tile.prefab

# 2. 查询节点 UUID
cocos-skills scene query-node-tree minimal

# 3. 绑定预制体引用
cocos-skills scene set-property '{"uuid":"GridNodeUUID","path":"__comps__.0.tilePrefab","dump":{"value":{"uuid":"TilePrefabUUID"},"type":"cc.Prefab"}}'

# 4. 绑定节点引用
cocos-skills scene set-property '{"uuid":"GridNodeUUID","path":"__comps__.0.tileContainer","dump":{"value":{"uuid":"ContainerUUID"},"type":"cc.Node"}}'

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
