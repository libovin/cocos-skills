---
name: cocos-prefab
description: Cocos Creator 预制体管理。提供预制体的列表查询、资源加载、实例化、创建、更新、应用、还原、复制、恢复和验证功能。当需要管理预制体资源、实例化场景对象或批量创建游戏元素时使用此技能。
---

# Cocos Prefab

Cocos Creator 预制体管理技能，提供完整的预制体资源操作和实例管理功能。

## 核心原则

### 预制体操作流程

标准预制体操作流程：

```
1. 查询预制体列表 → 2. 加载预制体 → 3. 实例化到场景 → 4. 编辑实例 → 5. 选择应用或还原
```

### 预制体状态管理

- **绿色**: 预制体实例，无本地修改
- **蓝色**: 预制体实例，有本地修改（可应用或还原）
- **灰色**: 普通节点（已解除链接）

## 快速开始

```python
from libs.client import execute_tool

# 查询预制体列表
execute_tool("prefab_get_list")

# 加载预制体
execute_tool("prefab_load", {
    "uuid": "db://assets/prefabs/MyPrefab.prefab"
})

# 实例化预制体
execute_tool("prefab_instantiate", {
    "uuid": "db://assets/prefabs/MyPrefab.prefab",
    "parentUuid": "parent-uuid"
})
```

## 可用操作

| 操作 | 功能 | 使用场景 |
|------|------|----------|
| [prefab_get_list](references/api-reference.md#prefab_get_list) | 获取预制体列表 | 浏览资源、选择预制体 |
| [prefab_load](references/api-reference.md#prefab_load) | 加载预制体 | 预览、准备操作 |
| [prefab_get_info](references/api-reference.md#prefab_get_info) | 获取预制体信息 | 检查预制体结构 |
| [prefab_instantiate](references/api-reference.md#prefab_instantiate) | 实例化预制体 | 创建游戏对象 |
| [prefab_create_from_node](references/api-reference.md#prefab_create_from_node) | 创建预制体 | 制作新预制体 |
| [prefab_apply](references/api-reference.md#prefab_apply) | 应用修改 | 批量更新实例 |
| [prefab_revert](references/api-reference.md#prefab_revert) | 还原修改 | 放弃本地修改 |
| [prefab_unlink](references/api-reference.md#prefab_unlink) | 解除链接 | 转为普通节点 |
| [prefab_duplicate](references/api-reference.md#prefab_duplicate) | 复制预制体 | 创建变体 |

**详细 API 文档**: 参见 [API 参考](references/api-reference.md) |

## 响应格式

所有操作返回统一的 JSON 格式：

```json
{
  "success": true,
  "data": {
    "uuid": "prefab-uuid",
    "name": "MyPrefab",
    "path": "db://assets/prefabs/MyPrefab.prefab"
  }
}
```

## 预制体路径格式

预制体路径使用 Cocos Creator 资源数据库路径：

| 类型 | 格式 | 示例 |
|------|------|------|
| 相对路径 | db://assets/... | db://assets/prefabs/MyPrefab.prefab |

## 注意事项

1. 预制体实例的修改不会自动同步到资源
2. 应用操作会影响所有使用该预制体的实例
3. 还原操作会清除实例上的所有本地修改
4. 解除链接后的节点不再是预制体实例
