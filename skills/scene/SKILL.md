---
name: cocos-scene
description: Cocos Creator 场景管理技能。提供场景的获取、打开、保存、创建、另存为和关闭功能，以及场景层级结构查询、节点操作、组件操作、视图控制等完整功能。当需要管理游戏场景、导航场景状态、获取场景节点结构或操作节点组件时使用此技能。
---

# Cocos Scene

Cocos Creator 场景管理技能，提供完整的场景操作和层级结构查询功能。

## 核心原则

### 场景操作流程

标准场景操作流程：

```
1. 查询场景状态 → 2. 打开场景 → 3. 操作节点/组件 → 4. 保存场景
```

### 场景状态

| 状态 | 说明 |
|------|------|
| 已打开 | 场景已加载并显示在编辑器中 |
| 已修改 | 场景内容已修改但未保存 |
| 就绪 | 场景可进行操作 |

## 快速开始

```python
from scripts.client import execute

# 查询场景就绪状态
execute("scene", "query-is-ready")

# 打开场景
execute("scene", "open-scene", ["db://assets/scenes/Main.scene"])

# 创建节点
execute("scene", "create-node", ["Canvas/NewNode"])

# 保存场景
execute("scene", "save-scene")
```

## 可用操作

### 场景管理

场景文件的打开、保存和状态查询。

**详细 API**: [scene-management.md](references/scene-management.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `open-scene` | 打开场景 | 加载并编辑场景 |
| `save-scene` | 保存场景 | 保存修改内容 |
| `save-as-scene` | 另存为场景 | 创建场景副本 |
| `close-scene` | 关闭场景 | 卸载当前场景 |
| `query-is-ready` | 查询场景就绪状态 | 状态检查 |
| `query-dirty` | 查询场景修改状态 | 检查是否已修改 |
| `query-scene-bounds` | 查询场景边界 | 获取场景边界信息 |
| `is-native` | 查询是否原生场景 | 判断场景类型 |

### 节点操作

场景节点的创建、删除、复制和层级管理。

**详细 API**: [node-operations.md](references/node-operations.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `create-node` | 创建节点 | 添加新节点 |
| `remove-node` | 删除节点 | 移除节点 |
| `reset-node` | 重置节点 | 恢复节点默认状态 |
| `copy-node` | 复制节点 | 复制到剪贴板 |
| `duplicate-node` | 快速复制节点 | 立即复制节点 |
| `paste-node` | 粘贴节点 | 粘贴剪贴板内容 |
| `cut-node` | 剪切节点 | 剪切到剪贴板 |
| `set-parent` | 设置父节点 | 调整节点层级 |

### 属性管理

节点属性的设置、重置和数组操作。

**详细 API**: [property-management.md](references/property-management.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `set-property` | 设置属性值 | 修改节点属性 |
| `reset-property` | 重置属性值 | 恢复默认值 |
| `move-array-element` | 移动数组元素 | 调整数组顺序 |
| `remove-array-element` | 删除数组元素 | 删除数组项 |

### 组件操作

节点组件的创建、删除和方法执行。

**详细 API**: [component-operations.md](references/component-operations.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `create-component` | 创建组件 | 添加组件到节点 |
| `remove-component` | 移除组件 | 从节点删除组件 |
| `reset-component` | 重置组件 | 恢复组件默认值 |
| `execute-component-method` | 执行组件方法 | 调用组件方法 |
| `query-component` | 查询组件信息 | 获取组件详情 |
| `query-components` | 查询组件列表 | 获取节点所有组件 |
| `query-component-has-script` | 查询是否有脚本组件 | 检查脚本组件 |

### 预制体

预制体的恢复操作。

**详细 API**: [prefab.md](references/prefab.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `restore-prefab` | 恢复预制体状态 | 撤销预制体修改 |

### 查询操作

节点和类的查询功能。

**详细 API**: [query-operations.md](references/query-operations.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `query-node` | 查询节点信息 | 获取节点详情 |
| `query-node-tree` | 查询节点树 | 获取场景层级结构 |
| `query-nodes-by-asset-uuid` | 按资源 UUID 查询节点 | 查找使用某资源的节点 |
| `query-classes` | 查询可用类列表 | 获取可实例化的类 |

### 编辑器工具

Gizmo 工具和坐标系统控制。

**详细 API**: [editor-tools.md](references/editor-tools.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `change-gizmo-tool` | 更改 Gizmo 工具 | 切换选择/移动/旋转/缩放 |
| `query-gizmo-tool-name` | 查询当前 Gizmo 工具 | 获取当前工具名称 |
| `change-gizmo-pivot` | 更改 Gizmo 中心点 | 切换中心/轴心 |
| `query-gizmo-pivot` | 查询 Gizmo 中心点 | 获取当前中心模式 |
| `change-gizmo-coordinate` | 更改坐标系 | 切换世界/本地坐标 |
| `query-gizmo-coordinate` | 查询坐标系 | 获取当前坐标模式 |

### 视图控制

场景视图的模式和对齐控制。

**详细 API**: [view-control.md](references/view-control.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `change-is2D` | 切换 2D/3D 视图模式 | 视图模式切换 |
| `query-is2D` | 查询是否 2D 模式 | 获取当前视图模式 |
| `focus-camera` | 相机聚焦节点 | 定位到指定节点 |
| `align-with-view` | 节点与视图对齐 | 对齐节点到当前视图 |
| `align-view-with-node` | 视图与节点对齐 | 对齐视图到节点方向 |

### 显示设置

网格和图标显示控制。

**详细 API**: [display-settings.md](references/display-settings.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `set-grid-visible` | 设置网格可见性 | 显示/隐藏网格 |
| `query-is-grid-visible` | 查询网格可见性 | 获取网格状态 |
| `set-icon-gizmo-3d` | 设置图标 3D 模式 | 切换图标显示模式 |
| `query-is-icon-gizmo-3d` | 查询图标是否 3D | 获取图标模式 |
| `set-icon-gizmo-size` | 设置图标大小 | 调整图标尺寸 |
| `query-is-icon-gizmo-size` | 查询图标大小 | 获取图标尺寸 |

### 脚本执行

场景脚本和热更新操作。

**详细 API**: [script-execution.md](references/script-execution.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `execute-scene-script` | 执行场景脚本 | 运行编辑器脚本 |
| `soft-reload` | 软重载脚本 | 热更新脚本 |

### 快照操作

场景快照功能。

**详细 API**: [snapshot-operations.md](references/snapshot-operations.md)

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `snapshot` | 创建场景快照 | 保存场景状态 |
| `snapshot-abort` | 中止快照 | 取消快照操作 |

## 响应格式

所有操作返回统一的 JSON 格式：

```json
{
  "success": true,
  "data": {
    "name": "Main Scene",
    "uuid": "scene-uuid",
    "modified": false
  }
}
```

## 场景路径格式

场景路径使用 Cocos Creator 资源数据库路径：

| 类型 | 格式 | 示例 |
|------|------|------|
| 相对路径 | db://assets/... | db://assets/scenes/Main.scene |

## 使用示例

### 场景管理

```python
# 打开场景
execute("scene", "open-scene", ["db://assets/scenes/Main.scene"])

# 检查场景是否已修改
execute("scene", "query-dirty")

# 保存场景
execute("scene", "save-scene")

# 另存为新场景
execute("scene", "save-as-scene", ["db://assets/scenes/Copy.scene"])
```

### 节点操作

```python
# 创建节点
execute("scene", "create-node", ["Canvas/NewNode"])

# 复制节点
execute("scene", "copy-node", ["node-uuid"])

# 设置父节点
execute("scene", "set-parent", ["node-uuid", "parent-uuid"])

# 删除节点
execute("scene", "remove-node", ["node-uuid"])
```

### 属性管理

```python
# 设置节点位置
execute("scene", "set-property", ["node-uuid", "position", {"x": 100, "y": 100, "z": 0}])

# 设置节点缩放
execute("scene", "set-property", ["node-uuid", "scale", {"x": 2, "y": 2, "z": 1}])

# 重置属性
execute("scene", "reset-property", ["node-uuid", "position"])

# 移动数组元素
execute("scene", "move-array-element", ["node-uuid", "children", 0, 5])
```

### 组件操作

```python
# 创建 Sprite 组件
execute("scene", "create-component", ["node-uuid", "cc.Sprite"])

# 查询节点组件
execute("scene", "query-components", ["node-uuid"])

# 移除组件
execute("scene", "remove-component", ["node-uuid", "component-uuid"])

# 执行组件方法
execute("scene", "execute-component-method", ["node-uuid", "component-uuid", "setEnabled", [true]])
```

### 编辑器工具

```python
# 切换到移动工具
execute("scene", "change-gizmo-tool", ["move"])

# 切换中心点模式
execute("scene", "change-gizmo-pivot", ["center"])

# 切换坐标系
execute("scene", "change-gizmo-coordinate", ["local"])
```

### 视图控制

```python
# 切换到 2D 模式
execute("scene", "change-is2D", [true])

# 聚焦到节点
execute("scene", "focus-camera", ["node-uuid"])

# 对齐节点到视图
execute("scene", "align-with-view", ["node-uuid"])
```

## 注意事项

1. **场景切换**: 打开新场景会自动关闭当前场景，未保存的修改会丢失
2. **节点 UUID**: 所有节点操作需要提供节点的 UUID
3. **组件 UUID**: 组件操作需要提供组件的 UUID
4. **路径格式**: 创建场景时路径必须以 `.scene` 结尾
5. **预制体**: 修改预制体实例后可使用 `restore-prefab` 恢复
6. **脚本热更**: `soft-reload` 会重新加载所有脚本，但不会重置场景
