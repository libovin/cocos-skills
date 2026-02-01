---
name: cocos-project
description: Cocos Creator 项目管理技能。提供项目设置面板打开、配置查询与修改等功能。当需要管理项目设置或修改项目配置参数时使用此技能。
---

# Cocos Creator 项目管理

提供 Cocos Creator 项目设置的管理功能，包括设置面板打开、配置查询与修改等。

## 快速开始

```python
from scripts.client import execute

# 打开项目设置面板
execute("project", "open-settings")

# 查询配置
execute("project", "query-config", ["general"])

# 设置配置
execute("project", "set-config", ["general", "key", "value"])
```

## 可用操作

| Action | 功能 | 使用场景 |
|--------|------|----------|
| `open-settings` | 打开项目设置面板 | UI 交互 |
| `query-config` | 查询项目设置配置 | 配置读取 |
| `set-config` | 设置项目配置 | 配置修改 |

## 配置类别

常见配置类别：

| 类别 | 说明 |
|------|------|
| general | 通用设置 |
| build | 构建设置 |
| physics | 物理设置 |
| animation | 动画设置 |
| script | 脚本设置 |

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

1. 修改项目配置会直接影响项目行为
2. 某些配置修改后需要重启编辑器才能生效
