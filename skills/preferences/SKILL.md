---
name: cocos-preferences
description: Cocos Creator 偏好设置管理技能。提供偏好设置面板打开、配置查询与修改等功能。当需要管理编辑器偏好设置或修改配置参数时使用此技能。
---

# Cocos Creator 偏好设置管理

提供 Cocos Creator 编辑器偏好设置的管理功能，包括设置面板打开、配置查询与修改等。

## 快速开始

```python
from scripts.client import execute

# 打开偏好设置面板
execute("preferences", "open-settings")

# 查询配置
execute("preferences", "query-config", ["general", "language", "global"])

# 设置配置
execute("preferences", "set-config", ["general", "language", "zh-CN", "global"])
```

## 可用操作

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `open-settings` | 打开偏好设置面板 | UI 交互 |
| `query-config` | 查询偏好设置配置 | 配置读取 |
| `set-config` | 设置偏好配置 | 配置修改 |

## 配置类型

| 类型 | 说明 |
|------|------|
| global | 全局偏好设置 |
| project | 项目偏好设置 |

## 响应格式

所有操作返回统一的 JSON 格式：

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

## 注意事项

1. 修改全局偏好设置会影响所有项目
2. 项目偏好设置只对当前项目生效
