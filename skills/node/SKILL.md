---
name: cocos-node
description: Cocos Creator 节点操作。提供节点的创建、查询、属性设置、变换控制、删除、移动、复制和类型检测功能。当需要管理场景节点、调整游戏对象位置或组织场景结构时使用此技能。
---

# Cocos Node

Cocos Creator 节点操作技能，提供完整的场景节点管理功能。

## 核心原则

### 节点操作流程

标准节点操作流程：

```
1. 创建/查找节点 → 2. 设置属性和变换 → 3. 组织层级 → 4. 完成后清理
```

### 节点类型

| 类型 | 说明 | 典型用途 |
|------|------|----------|
| 2D 节点 | UI 和 2D 游戏对象 | 精灵、标签、按钮 |
| 3D 节点 | 3D 游戏对象 | 模型、灯光、相机 |

## 快速开始

```python
from libs.client import execute_tool

# 创建节点
execute_tool("node_create", {
    "name": "MyNode",
    "parentUuid": "parent-uuid",
    "position": {"x": 100, "y": 200}
})

# 查找节点
execute_tool("node_find", {"name": "Player"})

# 获取所有节点
execute_tool("node_get_all")

# 设置属性
execute_tool("node_set_property", {
    "uuid": "node-uuid",
    "path": "active",
    "value": True
})

# 设置变换
execute_tool("node_set_transform", {
    "uuid": "node-uuid",
    "position": {"x": 0, "y": 0, "z": 0}
})

# 移动节点
execute_tool("node_move", {
    "uuid": "node-uuid",
    "parentUuid": "new-parent-uuid"
})

# 复制节点
execute_tool("node_duplicate", {
    "uuid": "node-uuid",
    "recursive": True
})
```

## 可用操作

| 操作 | 功能 | 使用场景 |
|------|------|----------|
| [node_create](references/api-reference.md#node_create) | 创建节点 | 添加游戏对象 |
| [node_get_info](references/api-reference.md#node_get_info) | 获取节点信息 | 检查节点状态 |
| [node_find](references/api-reference.md#node_find) | 查找节点 | 定位特定节点 |
| [node_get_all](references/api-reference.md#node_get_all) | 获取所有节点 | 浏览场景结构 |
| [node_set_property](references/api-reference.md#node_set_property) | 设置属性 | 修改节点配置 |
| [node_set_transform](references/api-reference.md#node_set_transform) | 设置变换 | 调整节点状态 |
| [node_delete](references/api-reference.md#node_delete) | 删除节点 | 移除游戏对象 |
| [node_move](references/api-reference.md#node_move) | 移动节点 | 重新组织层级 |
| [node_duplicate](references/api-reference.md#node_duplicate) | 复制节点 | 批量创建对象 |
| [node_detect_type](references/api-reference.md#node_detect_type) | 检测节点类型 | 确定 2D/3D |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md) |

## 响应格式

所有操作返回统一的 JSON 格式：

```json
{
  "success": true,
  "data": {
    "uuid": "node-uuid",
    "name": "MyNode",
    "type": "cc.Node",
    "parent": "parent-uuid"
  }
}
```

## 变换坐标系

| 空间 | 说明 |
|------|------|
| world | 世界坐标系 |
| local | 局部坐标系 |

## 注意事项

1. 位置、旋转、缩放使用 JSON 格式：`{"x":0,"y":0,"z":0}`
2. 删除节点会同时删除其所有子节点
3. 移动节点时子节点会随之移动
4. 复制时默认包含所有子节点
