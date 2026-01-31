---
name: cocos-scene
description: Cocos Creator 场景管理。提供场景的获取、打开、保存、创建、另存为和关闭功能，以及场景层级结构查询。当需要管理游戏场景、导航场景状态或获取场景节点结构时使用此技能。
---

# Cocos Scene

Cocos Creator 场景管理技能，提供完整的场景操作和层级结构查询功能。

## 核心原则

### 场景操作流程

标准场景操作流程：

```
1. 获取当前场景 → 2. 打开/创建场景 → 3. 操作场景内容 → 4. 保存场景
```

### 场景状态

| 状态 | 说明 |
|------|------|
| 已打开 | 场景已加载并显示在编辑器中 |
| 已修改 | 场景内容已修改但未保存 |
| 已关闭 | 场景已从编辑器卸载 |

## 快速开始

```python
from libs.client import execute_tool

# 获取当前场景
execute_tool("scene_get_current")

# 获取场景列表
execute_tool("scene_get_list")

# 打开场景
execute_tool("scene_open", {"uuid": "db://assets/scenes/Main.scene"})

# 保存场景
execute_tool("scene_save")

# 另存为新场景
execute_tool("scene_save_as", {"uuid": "db://assets/scenes/Copy.scene"})

# 获取场景层级
execute_tool("scene_get_hierarchy", {"dump": True})
```

## 可用操作

| 操作 | 功能 | 使用场景 |
|------|------|----------|
| [scene_get_current](references/api-reference.md#scene_get_current) | 获取当前场景 | 确认当前场景状态 |
| [scene_get_list](references/api-reference.md#scene_get_list) | 获取场景列表 | 浏览可用场景 |
| [scene_open](references/api-reference.md#scene_open) | 打开场景 | 加载并编辑场景 |
| [scene_save](references/api-reference.md#scene_save) | 保存场景 | 保存修改内容 |
| [scene_save_as](references/api-reference.md#scene_save_as) | 另存为场景 | 创建场景副本 |
| [scene_create](references/api-reference.md#scene_create) | 创建场景 | 新建空白场景 |
| [scene_close](references/api-reference.md#scene_close) | 关闭场景 | 卸载当前场景 |
| [scene_get_hierarchy](references/api-reference.md#scene_get_hierarchy) | 获取层级结构 | 了解场景结构 |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md)

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

## 注意事项

1. 打开新场景会自动关闭当前场景
2. 未保存的修改会在关闭时丢失
3. 创建场景时路径必须以 `.scene` 结尾
