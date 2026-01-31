---
name: cocos-component
description: Cocos Creator 组件管理。提供组件的添加、移除、列表查询、属性设置、脚本附加和可用组件类型获取功能。当需要为节点添加组件、编辑组件属性或管理游戏对象功能时使用此技能。
---

# Cocos Component

Cocos Creator 组件管理技能，提供节点组件的完整操作功能。

## 核心原则

### 组件操作流程

标准组件操作流程：

```
1. 选择目标节点 → 2. 查询现有组件 → 3. 添加/移除组件 → 4. 设置属性 → 5. 附加脚本（如需要）
```

### 组件类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 内建组件 | Cocos Creator 内建组件 | cc.Sprite, cc.Label, cc.RigidBody |
| 脚本组件 | 自定义 TypeScript/JavaScript 脚本 | MyGameLogic, PlayerController |

## 快速开始

```python
from libs.client import execute_tool

# 查询节点的组件列表
execute_tool("component_get_components", {
    "uuid": "node-uuid"
})

# 添加内建组件
execute_tool("component_add", {
    "uuid": "node-uuid",
    "componentType": "cc.Sprite"
})

# 附加脚本组件
execute_tool("component_attach_script", {
    "uuid": "node-uuid",
    "scriptPath": "db://assets/scripts/MyScript.ts"
})

# 设置组件属性
execute_tool("set_component_property", {
    "uuid": "node-uuid",
    "componentUuid": "comp-uuid",
    "property": "string",
    "value": "Hello World"
})
```

## 可用操作

| 操作 | 功能 | 使用场景 |
|------|------|----------|
| [component_add](references/api-reference.md#component_add) | 添加组件 | 为节点添加功能 |
| [component_remove](references/api-reference.md#component_remove) | 移除组件 | 移除不需要的功能 |
| [component_get_components](references/api-reference.md#component_get_components) | 获取组件列表 | 查询节点组件 |
| [set_component_property](references/api-reference.md#set_component_property) | 设置属性 | 编辑组件配置 |
| [component_attach_script](references/api-reference.md#component_attach_script) | 附加脚本 | 添加自定义逻辑 |
| [component_get_available_components](references/api-reference.md#component_get_available_components) | 获取可用组件 | 按类别浏览 |

**组件类型参考**: 参见 [组件类型](references/component-types.md)
**详细 API 文档**: 参见 [API 参考](references/api-reference.md) |

## 响应格式

所有操作返回统一的 JSON 格式：

```json
{
  "success": true,
  "data": {
    "uuid": "node-uuid",
    "components": [
      {
        "type": "cc.Sprite",
        "uuid": "component-uuid",
        "enabled": true
      }
    ]
  }
}
```

## 属性类型

设置组件属性时需要指定类型：

| 类型 | 说明 | 示例 |
|------|------|------|
| string | 字符串 | "Hello World" |
| number | 数字 | 42, 3.14 |
| boolean | 布尔值 | true, false |
| color | 颜色 | {"r":255,"g":0,"b":0,"a":255} |
| vec2 | 二维向量 | {"x":100,"y":50} |
| vec3 | 三维向量 | {"x":1,"y":2,"z":3} |
| node | 节点引用 | "node-uuid" |
